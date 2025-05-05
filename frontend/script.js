// Dummy endpoint base
const BASE_URL = "http://localhost:5000";

// Dummy image URL
const DUMMY_IMAGE = "https://via.placeholder.com/300x160.png?text=Book+Cover";

// Auth state
let currentUser = null;

// Elements
const authSection = document.getElementById("authSection");
const bookSection = document.querySelector(".book-section");
const welcomeUser = document.getElementById("welcome-user");
const logoutBtn = document.getElementById("logoutBtn");
const booksContainer = document.getElementById("booksContainer");

document.getElementById("registerBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!username || !password) return alert("Please fill all fields");

  const res = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (res.ok) {
    alert("Register success! Please login.");
  } else {
    alert(data.message || "Register failed.");
  }
});

document.getElementById("loginBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!username || !password) return alert("Please fill all fields");

  const res = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (res.ok) {
    currentUser = data.user;
    welcomeUser.textContent = `Hello, ${currentUser.username}`;
    authSection.classList.add("hidden");
    bookSection.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    fetchBooks();
  } else {
    alert(data.message || "Login failed.");
  }
});

logoutBtn.addEventListener("click", () => {
  currentUser = null;
  authSection.classList.remove("hidden");
  bookSection.classList.add("hidden");
  logoutBtn.classList.add("hidden");
  welcomeUser.textContent = "";
});

document.getElementById("addBookBtn").addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  if (!title || !author) return alert("Please fill in all fields");

  const res = await fetch(`${BASE_URL}/api/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author }),
  });

  if (res.ok) {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    fetchBooks();
  } else {
    alert("Failed to add book");
  }
});

async function fetchBooks() {
  const res = await fetch(`${BASE_URL}/api/books`);
  const books = await res.json();

  booksContainer.innerHTML = "";
  books.forEach((book) => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <img src="${DUMMY_IMAGE}" alt="cover" />
      <h3 contenteditable="true" data-id="${book.id}" class="editable-title">${book.title}</h3>
      <p contenteditable="true" data-id="${book.id}" class="editable-author">${book.author}</p>
      <button class="btn secondary save-btn" data-id="${book.id}">Save</button>
      <button class="btn danger delete-btn" data-id="${book.id}">Delete</button>
    `;
    booksContainer.appendChild(card);
  });

  // Save handlers
  document.querySelectorAll(".save-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const title = document
        .querySelector(`.editable-title[data-id="${id}"]`)
        .innerText.trim();
      const author = document
        .querySelector(`.editable-author[data-id="${id}"]`)
        .innerText.trim();

      await fetch(`${BASE_URL}/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author }),
      });

      fetchBooks();
    });
  });

  // Delete handlers
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      await fetch(`${BASE_URL}/api/books/${id}`, { method: "DELETE" });
      fetchBooks();
    });
  });
}
