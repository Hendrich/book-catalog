//import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase Client
const supabase = supabase.createClient(
  "https://uoumouxnuzwioaolnfmw.supabase.co ",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvdW1vdXhudXp3aW9hb2xuZm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NTQxMzUsImV4cCI6MjA2MzEzMDEzNX0.YbL_R0L7HInsvemamaJ_7BXPvwW5zyYvULiqFhXtJdA"
);

// Base URL aplikasi
const BASE_URL = "https://book-catalog-app-z8p8.onrender.com ";
const DUMMY_IMAGE = "/image/default-book.jpg";

// Auth state
let currentUser = null;

// Elements
const authSection = document.getElementById("authSection");
const bookSection = document.querySelector(".book-section");
const welcomeUser = document.getElementById("welcome-user");
const logoutBtn = document.getElementById("logoutBtn");
const booksContainer = document.getElementById("booksContainer");

// Cek status login saat halaman dimuat
document.addEventListener("DOMContentLoaded", async () => {
  const { data } = await supabase.auth.getSession();
  const session = data.session;

  if (session) {
    currentUser = session.user;
    welcomeUser.textContent = `Hello, ${currentUser.email}`;
    authSection.classList.add("hidden");
    bookSection.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    fetchBooks();
  }
});

// Register handler
document.getElementById("registerBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) return alert("Please fill all fields");

  // Gunakan Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: username,
    password: password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Register success! Please check your email for confirmation.");
});

// Login handler
document.getElementById("loginBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) return alert("Please fill all fields");

  // Gunakan Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password: password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  const user = data.user;
  const token = data.session.access_token;

  localStorage.setItem("token", token);
  currentUser = user;

  welcomeUser.textContent = `Hello, ${user.email}`;
  authSection.classList.add("hidden");
  bookSection.classList.remove("hidden");
  logoutBtn.classList.remove("hidden");

  fetchBooks();
});

// Logout handler
logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  currentUser = null;
  localStorage.removeItem("token");
  authSection.classList.remove("hidden");
  bookSection.classList.add("hidden");
  logoutBtn.classList.add("hidden");
  welcomeUser.textContent = "";
});

// Tambah buku
document.getElementById("addBookBtn").addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();

  if (!title || !author) return alert("Please fill in all fields");

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    alert("You must be logged in to add a book");
    return;
  }

  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, author, user_id: user.id }),
  });

  if (res.ok) {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    fetchBooks();
  } else {
    const data = await res.json();
    alert(data.message || "Failed to add book");
  }
});

// Ambil semua buku milik pengguna
async function fetchBooks() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    alert("You must be logged in to view books");
    return;
  }

  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/books`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const books = await res.json();

  if (!Array.isArray(books)) {
    console.error("Unexpected response:", books);
    alert(books.message || "Failed to fetch books.");
    return;
  }

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

      const token = localStorage.getItem("token");

      await fetch(`${BASE_URL}/api/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, author }),
      });

      fetchBooks();
    });
  });

  // Delete handlers
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const token = localStorage.getItem("token");

      await fetch(`${BASE_URL}/api/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchBooks();
    });
  });
}
