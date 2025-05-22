// script.js - Supabase Auth via CDN
let currentUser = null;

const BASE_URL = "https://book-catalog-app-z8p8.onrender.com";
const DUMMY_IMAGE = "/image/default-book.jpg";

document.addEventListener("DOMContentLoaded", async () => {
  const authSection = document.getElementById("authSection");
  const bookSection = document.querySelector(".book-section");
  const welcomeUser = document.getElementById("welcome-user");
  const logoutBtn = document.getElementById("logoutBtn");
  const booksContainer = document.getElementById("booksContainer");

  if (
    !authSection ||
    !bookSection ||
    !welcomeUser ||
    !logoutBtn ||
    !booksContainer
  ) {
    alert("DOM gagal dimuat. Silakan refresh halaman.");
    return;
  }

  // Tunggu sampai supabase global tersedia
  const checkSupabase = async () => {
    return new Promise((resolve) => {
      let tries = 0;
      const interval = setInterval(() => {
        if (window.supabase && window.supabase.createClient) {
          clearInterval(interval);
          resolve(window.supabase);
        }
        if (tries++ > 40) {
          clearInterval(interval);
          resolve(null);
        }
      }, 500);
    });
  };

  const supabaseLib = await checkSupabase();

  if (!supabaseLib) {
    alert("Supabase gagal dimuat.");
    return;
  }

  const supabase = supabaseLib.createClient(
    "https://uoumouxnuzwioaolnfmw.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvdW1vdXhudXp3aW9hb2xuZm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NTQxMzUsImV4cCI6MjA2MzEzMDEzNX0.YbL_R0L7HInsvemamaJ_7BXPvwW5zyYvULiqFhXtJdA"
  );

  // Cek session
  const { data } = await supabase.auth.getSession();
  const session = data?.session;

  if (session) {
    currentUser = session.user;
    welcomeUser.textContent = `Hello, ${currentUser.email}`;
    authSection.classList.add("hidden");
    bookSection.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    fetchBooks();
  }

  document.getElementById("registerBtn").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!username || !password) return alert("Isi semua field.");

    const { error } = await supabase.auth.signUp({ email: username, password });
    if (error) return alert(error.message);

    alert("Register berhasil. Silakan cek email untuk konfirmasi.");
  });

  document.getElementById("loginBtn").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!username || !password) return alert("Isi semua field.");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });

    if (error) return alert(error.message);

    currentUser = data.user;
    const token = data.session.access_token;
    localStorage.setItem("token", token);

    welcomeUser.textContent = `Hello, ${currentUser.email}`;
    authSection.classList.add("hidden");
    bookSection.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");

    fetchBooks();
  });

  logoutBtn.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return alert("Logout gagal");

    currentUser = null;
    localStorage.removeItem("token");
    welcomeUser.textContent = "";
    authSection.classList.remove("hidden");
    bookSection.classList.add("hidden");
    logoutBtn.classList.add("hidden");
  });

  document.getElementById("addBookBtn").addEventListener("click", async () => {
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();

    if (!title || !author) return alert("Isi semua field");

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return alert("Harus login dulu");

    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/api/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, author, user_id: data.user.id }),
    });

    if (res.ok) {
      document.getElementById("title").value = "";
      document.getElementById("author").value = "";
      fetchBooks();
    } else {
      const errData = await res.json();
      alert(errData.message || "Gagal menambah buku");
    }
  });

  async function fetchBooks() {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) return alert("Harus login dulu");

    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/books`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const books = await res.json();
    if (!Array.isArray(books))
      return alert(books.message || "Gagal ambil buku");

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

        const res = await fetch(`${BASE_URL}/api/books/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, author }),
        });

        if (res.ok) {
          alert("Buku berhasil diubah");
          fetchBooks();
        } else {
          const err = await res.json();
          alert(err.message || "Gagal update");
        }
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/api/books/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          alert("Buku dihapus");
          fetchBooks();
        } else {
          const err = await res.json();
          alert(err.message || "Gagal hapus buku");
        }
      });
    });
  }
});
