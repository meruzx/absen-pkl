// Authentication and login functionality
document.addEventListener("DOMContentLoaded", () => {
  // Tab switching
  const tabBtns = document.querySelectorAll(".tab-btn")
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      tabBtns.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Login form submission
  const loginForm = document.getElementById("loginForm")
  loginForm.addEventListener("submit", handleLogin)

  // Check if already logged in
  const currentUser = localStorage.getItem("currentUser")
  if (currentUser) {
    const user = JSON.parse(currentUser)
    redirectToDashboard(user.role)
  }
})

// Default users (in production, this should be in a secure database)
const users = {
  students: [
    { username: "siswa1", password: "password123", name: "Ahmad Rizki", id: "S001" },
    { username: "siswa2", password: "password123", name: "Siti Nurhaliza", id: "S002" },
    { username: "siswa3", password: "password123", name: "Budi Santoso", id: "S003" },
    { username: "siswa4", password: "password123", name: "Dewi Sartika", id: "S004" },
    { username: "siswa5", password: "password123", name: "Eko Prasetyo", id: "S005" },
  ],
  admins: [
    { username: "admin", password: "admin123", name: "Guru Pembimbing", id: "A001" },
    { username: "guru1", password: "guru123", name: "Pak Suryanto", id: "A002" },
  ],
}

async function handleLogin(e) {
  e.preventDefault()

  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  const activeTab = document.querySelector(".tab-btn.active").dataset.tab

  // Show loading
  const loginBtn = document.querySelector(".login-btn")
  const originalText = loginBtn.innerHTML
  loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memverifikasi...'
  loginBtn.disabled = true

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  let user = null

  if (activeTab === "student") {
    user = users.students.find((s) => s.username === username && s.password === password)
    if (user) user.role = "student"
  } else {
    user = users.admins.find((a) => a.username === username && a.password === password)
    if (user) user.role = "admin"
  }

  if (user) {
    // Store user session
    localStorage.setItem("currentUser", JSON.stringify(user))

    // Success animation
    loginBtn.innerHTML = '<i class="fas fa-check"></i> Berhasil!'
    loginBtn.style.background = "#28a745"

    setTimeout(() => {
      redirectToDashboard(user.role)
    }, 1000)
  } else {
    // Error handling
    loginBtn.innerHTML = '<i class="fas fa-times"></i> Login Gagal!'
    loginBtn.style.background = "#dc3545"

    setTimeout(() => {
      loginBtn.innerHTML = originalText
      loginBtn.style.background = ""
      loginBtn.disabled = false
    }, 2000)

    alert("Username atau password salah!")
  }
}

function redirectToDashboard(role) {
  if (role === "student") {
    window.location.href = "student-dashboard.html"
  } else {
    window.location.href = "admin-dashboard.html"
  }
}

function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
}

// Initialize GitHub storage
function initializeGitHubStorage() {
  if (!localStorage.getItem("attendanceData")) {
    localStorage.setItem("attendanceData", JSON.stringify([]))
  }
}

initializeGitHubStorage()
