// Admin dashboard functionality
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "index.html"
    return
  }

  // Display admin name
  document.getElementById("adminName").textContent = currentUser.name

  // Initialize dashboard
  updateDateTime()
  loadAllAttendanceData()
  updateAdminStats()
  loadStudentFilter()

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

function getAttendanceData() {
  return JSON.parse(localStorage.getItem("attendanceData") || "[]")
}

function getAllStudents() {
  // Get students from auth.js users object
  return [
    { username: "siswa1", name: "Ahmad Rizki", id: "S001" },
    { username: "siswa2", name: "Siti Nurhaliza", id: "S002" },
    { username: "siswa3", name: "Budi Santoso", id: "S003" },
    { username: "siswa4", name: "Dewi Sartika", id: "S004" },
    { username: "siswa5", name: "Eko Prasetyo", id: "S005" },
  ]
}

function loadStudentFilter() {
  const students = getAllStudents()
  const filterSelect = document.getElementById("filterSiswa")

  students.forEach((student) => {
    const option = document.createElement("option")
    option.value = student.id
    option.textContent = student.name
    filterSelect.appendChild(option)
  })
}

function loadAllAttendanceData(filteredData = null) {
  const allAttendance = filteredData || getAttendanceData()
  const sortedAttendance = allAttendance.sort((a, b) => new Date(b.date) - new Date(a.date))

  const tbody = document.getElementById("allAttendanceData")

  if (sortedAttendance.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: #666;">Tidak ada data absensi</td></tr>'
    return
  }

  tbody.innerHTML = sortedAttendance
    .map(
      (record, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${record.studentName}</td>
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
            <td>${record.keterangan || "-"}</td>
        </tr>
    `,
    )
    .join("")
}

function updateAdminStats() {
  const allAttendance = getAttendanceData()
  const students = getAllStudents()
  const today = new Date().toISOString().split("T")[0]

  const todayAttendance = allAttendance.filter((record) => record.date === today)
  const hadirHariIni = todayAttendance.filter((record) => record.status === "Hadir").length
  const tidakHadirHariIni = students.length - hadirHariIni
  const persentaseHariIni = students.length > 0 ? Math.round((hadirHariIni / students.length) * 100) : 0

  document.getElementById("totalSiswa").textContent = students.length
  document.getElementById("hadirHariIni").textContent = hadirHariIni
  document.getElementById("tidakHadirHariIni").textContent = tidakHadirHariIni
  document.getElementById("persentaseHariIni").textContent = persentaseHariIni + "%"
}

function filterData() {
  const selectedStudent = document.getElementById("filterSiswa").value
  const selectedDate = document.getElementById("filterTanggal").value

  let filteredData = getAttendanceData()

  if (selectedStudent) {
    filteredData = filteredData.filter((record) => record.studentId === selectedStudent)
  }

  if (selectedDate) {
    filteredData = filteredData.filter((record) => record.date === selectedDate)
  }

  loadAllAttendanceData(filteredData)
}

function exportData() {
  const allAttendance = getAttendanceData()

  if (allAttendance.length === 0) {
    alert("Tidak ada data untuk diekspor")
    return
  }

  // Create CSV content
  const headers = [
    "No",
    "Nama Siswa",
    "Tanggal",
    "Tempat PKL",
    "Guru Pembimbing",
    "Jam Berangkat",
    "Jam Pulang",
    "Status",
    "Keterangan",
  ]
  const csvContent = [
    headers.join(","),
    ...allAttendance.map((record, index) =>
      [
        index + 1,
        `"${record.studentName}"`,
        new Date(record.date).toLocaleDateString("id-ID"),
        `"${record.tempatPKL}"`,
        `"${record.guruPembimbing}"`,
        record.jamBerangkat || "-",
        record.jamPulang || "-",
        record.status,
        `"${record.keterangan || "-"}"`,
      ].join(","),
    ),
  ].join("\n")

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `absensi-pkl-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
