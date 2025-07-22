// Student dashboard functionality
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  if (!currentUser || currentUser.role !== "student") {
    window.location.href = "index.html"
    return
  }

  // Display student name
  document.getElementById("studentName").textContent = currentUser.name

  // Initialize dashboard
  updateDateTime()
  loadStudentProfile()
  loadAttendanceHistory()
  updateStats()

  // Set up form submission
  document.getElementById("attendanceForm").addEventListener("submit", handleAttendanceSubmission)

  // Update time every second
  setInterval(updateDateTime, 1000)
})

function updateDateTime() {
  const now = new Date()
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  document.getElementById("currentTime").textContent = now.toLocaleTimeString("id-ID", timeOptions)
  document.getElementById("currentDate").textContent = now.toLocaleDateString("id-ID", dateOptions)
}

function loadStudentProfile() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const studentData = getStudentData(currentUser.id)

  if (studentData) {
    document.getElementById("tempatPKL").value = studentData.tempatPKL || ""
    document.getElementById("guruPembimbing").value = studentData.guruPembimbing || ""
  }
}

function getStudentData(studentId) {
  const studentProfiles = JSON.parse(localStorage.getItem("studentProfiles") || "{}")
  return studentProfiles[studentId]
}

function saveStudentData(studentId, data) {
  const studentProfiles = JSON.parse(localStorage.getItem("studentProfiles") || "{}")
  studentProfiles[studentId] = { ...studentProfiles[studentId], ...data }
  localStorage.setItem("studentProfiles", JSON.stringify(studentProfiles))
}

async function handleAttendanceSubmission(e) {
  e.preventDefault()

  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const formData = new FormData(e.target)
  const today = new Date().toISOString().split("T")[0]

  // Check if already submitted today
  const existingAttendance = getAttendanceData().find(
    (record) => record.studentId === currentUser.id && record.date === today,
  )

  if (existingAttendance) {
    alert("Anda sudah mengisi absensi untuk hari ini!")
    return
  }

  const attendanceData = {
    id: Date.now().toString(),
    studentId: currentUser.id,
    studentName: currentUser.name,
    date: today,
    tempatPKL: formData.get("tempatPKL"),
    guruPembimbing: formData.get("guruPembimbing"),
    jamBerangkat: formData.get("jamBerangkat"),
    jamPulang: formData.get("jamPulang") || null,
    keterangan: formData.get("keterangan"),
    status: formData.get("jamBerangkat") ? "Hadir" : "Tidak Hadir",
    timestamp: new Date().toISOString(),
  }

  // Save student profile data
  saveStudentData(currentUser.id, {
    tempatPKL: attendanceData.tempatPKL,
    guruPembimbing: attendanceData.guruPembimbing,
  })

  // Show loading
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...'
  submitBtn.disabled = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Save to localStorage (simulating GitHub storage)
    const allAttendance = getAttendanceData()
    allAttendance.push(attendanceData)
    localStorage.setItem("attendanceData", JSON.stringify(allAttendance))

    // Success feedback
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Tersimpan!'
    submitBtn.style.background = "#28a745"

    // Reset form
    e.target.reset()
    loadStudentProfile() // Reload saved profile data

    // Refresh data
    loadAttendanceHistory()
    updateStats()

    setTimeout(() => {
      submitBtn.innerHTML = originalText
      submitBtn.style.background = ""
      submitBtn.disabled = false
    }, 2000)
  } catch (error) {
    submitBtn.innerHTML = '<i class="fas fa-times"></i> Gagal!'
    submitBtn.style.background = "#dc3545"

    setTimeout(() => {
      submitBtn.innerHTML = originalText
      submitBtn.style.background = ""
      submitBtn.disabled = false
    }, 2000)

    alert("Gagal menyimpan data. Silakan coba lagi.")
  }
}

function getAttendanceData() {
  return JSON.parse(localStorage.getItem("attendanceData") || "[]")
}

function loadAttendanceHistory() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const allAttendance = getAttendanceData()
  const studentAttendance = allAttendance
    .filter((record) => record.studentId === currentUser.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const tbody = document.getElementById("attendanceHistory")

  if (studentAttendance.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #666;">Belum ada data absensi</td></tr>'
    return
  }

  tbody.innerHTML = studentAttendance
    .map(
      (record) => `
        <tr>
            <td>${new Date(record.date).toLocaleDateString("id-ID")}</td>
            <td>${record.tempatPKL}</td>
            <td>${record.guruPembimbing}</td>
            <td>${record.jamBerangkat || "-"}</td>
            <td>${record.jamPulang || "-"}</td>
            <td>
                <span class="status-badge ${record.status === "Hadir" ? "status-hadir" : "status-tidak-hadir"}">
                    ${record.status}
                </span>
            </td>
        </tr>
    `,
    )
    .join("")
}

function updateStats() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const allAttendance = getAttendanceData()
  const studentAttendance = allAttendance.filter((record) => record.studentId === currentUser.id)

  const totalHadir = studentAttendance.filter((record) => record.status === "Hadir").length
  const totalTidakHadir = studentAttendance.filter((record) => record.status === "Tidak Hadir").length
  const totalData = studentAttendance.length
  const persentase = totalData > 0 ? Math.round((totalHadir / totalData) * 100) : 0

  document.getElementById("totalHadir").textContent = totalHadir
  document.getElementById("totalTidakHadir").textContent = totalTidakHadir
  document.getElementById("persentaseKehadiran").textContent = persentase + "%"
}
