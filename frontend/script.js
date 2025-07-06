import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import appConfig from './js/config.js';
import apiService from './js/services/apiService.js';
import notificationManager from './js/components/notifications.js';

// Use configuration instead of hard-coded values
const supabase = createClient(appConfig.supabaseUrl, appConfig.supabaseAnonKey);

const authSection = document.getElementById("authSection");
const bookSection = document.querySelector(".book-section");
const logoutBtn = document.getElementById("logoutBtn");
const welcomeUser = document.getElementById("welcome-user");
const booksContainer = document.getElementById("booksContainer");

let currentUser = null;

// Show loading state
function showLoading(element, show = true) {
  if (show) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
  } else {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
  }
}

// Saat halaman dimuat: cek session & update UI
window.addEventListener("DOMContentLoaded", async () => {
  try {
    // Check for stored auth token and user data
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      currentUser = JSON.parse(userData);
      welcomeUser.textContent = `Hello, ${currentUser.email}`;
      authSection.classList.add("hidden");
      bookSection.classList.remove("hidden");
      logoutBtn.classList.remove("hidden");
      await fetchBooks();
    } else {
      // Bersihkan state jika tidak login
      welcomeUser.textContent = "";
      authSection.classList.remove("hidden");
      bookSection.classList.add("hidden");
      logoutBtn.classList.add("hidden");
    }
  } catch (error) {
    console.error('Error checking session:', error);
    notificationManager.error('Error checking authentication status');
  }
});

document.getElementById("registerBtn").addEventListener("click", async () => {
  const registerBtn = document.getElementById("registerBtn");
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  
  if (!username || !password) {
    notificationManager.warning(appConfig.messages.validation.emailRequired);
    return;
  }

  // Basic email validation
  if (!appConfig.validation.email.test(username)) {
    notificationManager.error(appConfig.messages.validation.emailInvalid);
    return;
  }

  if (password.length < appConfig.validation.minPasswordLength) {
    notificationManager.error(appConfig.messages.validation.passwordTooShort);
    return;
  }

  showLoading(registerBtn);
  
  try {
    // Use backend API for registration instead of Supabase direct
    const result = await apiService.post('/api/auth/register', {
      email: username,
      password: password
    });
    
    if (!result.success) {
      notificationManager.error(`Registration failed: ${result.error?.message || 'Registration failed'}`);
    } else {
      notificationManager.success(appConfig.messages.success.registrationSuccess);
      // Clear form
      document.getElementById("username").value = "";
      document.getElementById("password").value = "";
    }
  } catch (error) {
    console.error('Registration error:', error);
    notificationManager.error(appConfig.messages.error.registrationFailed);
  } finally {
    showLoading(registerBtn, false);
  }
});

document.getElementById("loginBtn").addEventListener("click", async () => {
  const loginBtn = document.getElementById("loginBtn");
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  
  if (!username || !password) {
    notificationManager.warning(appConfig.messages.validation.emailRequired);
    return;
  }

  showLoading(loginBtn);

  try {
    // Use backend API for login instead of Supabase direct
    const result = await apiService.post('/api/auth/login', {
      email: username,
      password: password
    });

    if (!result.success) {
      notificationManager.error(`Login failed: ${result.error?.message || 'Invalid credentials'}`);
      return;
    }

    // Store token and user data
    currentUser = result.data.user;
    localStorage.setItem('authToken', result.data.token);
    localStorage.setItem('userData', JSON.stringify(currentUser));
    
    notificationManager.success(appConfig.messages.success.loginSuccess);

    welcomeUser.textContent = `Hello, ${currentUser.email}`;
    authSection.classList.add("hidden");
    bookSection.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");

    // Clear form
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    await fetchBooks();
  } catch (error) {
    console.error('Login error:', error);
    notificationManager.error(appConfig.messages.error.loginFailed);
  } finally {
    showLoading(loginBtn, false);
  }
});

logoutBtn.addEventListener("click", async () => {
  showLoading(logoutBtn);
  
  try {
    // Clear local storage and user state
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    currentUser = null;
    welcomeUser.textContent = "";
    authSection.classList.remove("hidden");
    bookSection.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    booksContainer.innerHTML = "";
    
    notificationManager.success(appConfig.messages.success.logoutSuccess);
  } catch (error) {
    console.error('Logout error:', error);
    notificationManager.error("Logout failed");
  } finally {
    showLoading(logoutBtn, false);
  }
});

// TAMBAH BUKU
document.getElementById("addBookBtn").addEventListener("click", async () => {
  const addBtn = document.getElementById("addBookBtn");
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();

  if (!title || !author) {
    notificationManager.warning(appConfig.messages.validation.titleRequired);
    return;
  }

  showLoading(addBtn);

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) return handleUnauthorized();

    const result = await apiService.post('/api/books', { title, author }, token);
    
    if (result.success) {
      notificationManager.success(appConfig.messages.success.bookAdded);
      document.getElementById("title").value = "";
      document.getElementById("author").value = "";
      await fetchBooks();
    } else {
      notificationManager.error(result.error?.message || 'Failed to add book');
    }
  } catch (error) {
    console.error('Add book error:', error);
    if (error.status === 401) {
      handleUnauthorized();
    } else {
      notificationManager.error('Failed to add book');
    }
  } finally {
    showLoading(addBtn, false);
  }
});

// AMBIL BUKU
async function fetchBooks() {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) return handleUnauthorized();

    const result = await apiService.get('/api/books', token);

    if (!result.success) {
      notificationManager.error(result.error?.message || 'Failed to fetch books');
      return;
    }

    const books = result.data || [];
    booksContainer.innerHTML = "";
    
    if (books.length === 0) {
      booksContainer.innerHTML = '<p class="text-center">No books found. Add your first book!</p>';
      return;
    }

    books.forEach((book) => {
      const card = document.createElement("div");
      card.className = "book-card";
      card.innerHTML = `
        <img src="${appConfig.constants.DEFAULT_BOOK_IMAGE}" alt="cover" />
        <h3 contenteditable="true" data-id="${book.id}" class="editable-title">${book.title}</h3>
        <p contenteditable="true" data-id="${book.id}" class="editable-author">${book.author}</p>
        <button class="btn secondary save-btn" data-id="${book.id}">Save</button>
        <button class="btn danger delete-btn" data-id="${book.id}">Delete</button>
      `;
      booksContainer.appendChild(card);
    });

    // Add event listeners for save buttons
    document.querySelectorAll(".save-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const saveBtn = e.target;
        const id = e.target.dataset.id;
        const title = document
          .querySelector(`.editable-title[data-id="${id}"]`)
          .innerText.trim();
        const author = document
          .querySelector(`.editable-author[data-id="${id}"]`)
          .innerText.trim();

        if (!title || !author) {
          notificationManager.warning('Title and author are required');
          return;
        }

        showLoading(saveBtn);

        try {
          const { data: sessionData } = await supabase.auth.getSession();
          const token = sessionData.session?.access_token;
          if (!token) return handleUnauthorized();

          const result = await apiService.put(`/api/books/${id}`, { title, author }, token);

          if (result.success) {
            notificationManager.success(appConfig.messages.success.bookUpdated);
            await fetchBooks();
          } else {
            notificationManager.error(result.error?.message || 'Failed to update book');
          }
        } catch (error) {
          console.error('Update book error:', error);
          if (error.status === 401) {
            handleUnauthorized();
          } else {
            notificationManager.error('Failed to update book');
          }
        } finally {
          showLoading(saveBtn, false);
        }
      });
    });

    // Add event listeners for delete buttons
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const deleteBtn = e.target;
        const id = e.target.dataset.id;

        // Confirmation dialog
        if (!confirm('Are you sure you want to delete this book?')) {
          return;
        }

        showLoading(deleteBtn);

        try {
          const { data: sessionData } = await supabase.auth.getSession();
          const token = sessionData.session?.access_token;
          if (!token) return handleUnauthorized();

          const result = await apiService.delete(`/api/books/${id}`, token);

          if (result.success) {
            notificationManager.success(appConfig.messages.success.bookDeleted);
            await fetchBooks();
          } else {
            notificationManager.error(result.error?.message || 'Failed to delete book');
          }
        } catch (error) {
          console.error('Delete book error:', error);
          if (error.status === 401) {
            handleUnauthorized();
          } else {
            notificationManager.error('Failed to delete book');
          }
        } finally {
          showLoading(deleteBtn, false);
        }
      });
    });
  } catch (error) {
    console.error('Fetch books error:', error);
    if (error.status === 401) {
      handleUnauthorized();
    } else {
      notificationManager.error('Failed to fetch books');
    }
  }
}

// Jika 401, paksa logout
function handleUnauthorized() {
  notificationManager.error(appConfig.messages.error.unauthorized);
  supabase.auth.signOut();
  setTimeout(() => {
    window.location.reload();
  }, 2000);
}
