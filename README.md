# Sistem Absensi PKL

Website absensi untuk siswa Praktik Kerja Lapangan (PKL) dengan fitur lengkap dan penyimpanan data di GitHub.

## Fitur

### 🎓 Dashboard Siswa
- Login individual untuk setiap siswa
- Form absensi harian dengan data:
  - Nama siswa (otomatis)
  - Tempat PKL (dapat dikustomisasi)
  - Guru pembimbing (dapat dikustomisasi)
  - Jam berangkat dan pulang
  - Keterangan tambahan
- Riwayat absensi pribadi
- Statistik kehadiran personal
- Tampilan tanggal dan waktu real-time

### 👨‍🏫 Dashboard Admin
- Login khusus untuk guru/admin
- Melihat semua data absensi siswa
- Filter data berdasarkan siswa dan tanggal
- Statistik kehadiran harian
- Export data ke format CSV/Excel
- Monitoring real-time kehadiran

### 🔧 Fitur Teknis
- Responsive design untuk semua perangkat
- Penyimpanan data di GitHub repository
- Sistem autentikasi sederhana
- Update tanggal dan waktu otomatis
- Interface yang modern dan profesional

## Setup dan Instalasi

### 1. Persiapan GitHub Repository

1. Buat repository baru di GitHub untuk menyimpan data
2. Buat Personal Access Token di GitHub:
   - Pergi ke Settings > Developer settings > Personal access tokens
   - Generate new token dengan scope `repo`
3. Salin token yang dihasilkan

### 2. Konfigurasi Environment

1. Rename file `.env.local.example` menjadi `.env.local`
2. Isi dengan data GitHub Anda:
\`\`\`env
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_REPO=your-username/your-repo-name
\`\`\`

### 3. Menjalankan Website

1. Buka `index.html` di browser untuk halaman login
2. Atau deploy ke hosting seperti Vercel, Netlify, atau GitHub Pages

## Data Login Default

### Siswa
- Username: `siswa1` - `siswa5`
- Password: `password123`
- Nama: Ahmad Rizki, Siti Nurhaliza, Budi Santoso, Dewi Sartika, Eko Prasetyo

### Admin
- Username: `admin` / Password: `admin123`
- Username: `guru1` / Password: `guru123`

## Struktur File

\`\`\`
├── index.html              # Halaman login
├── student-dashboard.html  # Dashboard siswa
├── admin-dashboard.html    # Dashboard admin
├── styles.css             # Styling utama
├── auth.js               # Sistem autentikasi
├── student.js            # Fungsi dashboard siswa
├── admin.js              # Fungsi dashboard admin
├── app/
│   └── api/
│       ├── attendance/
│       │   └── route.js   # API endpoint absensi
│       └── students/
│           └── route.js   # API endpoint profil siswa
└── README.md             # Dokumentasi
\`\`\`

## Kustomisasi

### Menambah Siswa Baru
Edit file `auth.js` pada bagian `users.students` dan tambahkan data siswa baru.

### Mengubah Tampilan
Edit file `styles.css` untuk menyesuaikan warna, font, dan layout sesuai kebutuhan sekolah.

### Menambah Fitur
- Tambah field baru di form absensi
- Modifikasi statistik yang ditampilkan
- Tambah validasi data tambahan

## Deployment

### GitHub Pages
1. Upload semua file ke repository GitHub
2. Aktifkan GitHub Pages di repository settings
3. Website akan tersedia di `https://username.github.io/repository-name`

### Vercel
1. Connect repository ke Vercel
2. Deploy otomatis akan berjalan
3. Set environment variables di Vercel dashboard

### Netlify
1. Drag & drop folder ke Netlify
2. Atau connect dengan GitHub repository
3. Set environment variables di Netlify dashboard

## Keamanan

⚠️ **Penting**: Sistem ini menggunakan autentikasi sederhana untuk demo. Untuk penggunaan production:

1. Implementasi sistem autentikasi yang lebih aman
2. Enkripsi password di database
3. Gunakan HTTPS untuk semua komunikasi
4. Validasi input yang lebih ketat
5. Rate limiting untuk API endpoints

## Support

Jika mengalami masalah atau butuh bantuan kustomisasi, silakan buat issue di repository ini.

## Lisensi

MIT License - Bebas digunakan untuk keperluan pendidikan dan komersial.
