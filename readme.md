# PTS Pemrograman Web - Mini Project Front-End Individual
**Nama Mahasiswa:** Muhammad Bintang Prasetya  
**NPM:** 2440304023  
**Prodi:** Teknik Komputer FT-UBT (Semester 5)  
**Tahun Akademik:** 2026  

---

## 1. Identitas Mahasiswa
- **Nama:** Muhammad Bintang Prasetya
- **NPM:** 2440304023
- **Program Studi:** Teknik Komputer - Fakultas Teknik Universitas Borneo Tarakan

---

## 2. Nama Aplikasi dan Deskripsi Singkat
- **Nama Aplikasi:** Lapak Jersey UMKM Tarakan
- **Deskripsi Singkat:**  
  Aplikasi *Interactive Data Dashboard* berbasis web front-end yang mengonsumsi data REST API publik DummyJSON untuk menyajikan katalog produk jersey sepak bola klub top Eropa versi UMKM lokal. Aplikasi ini dilengkapi dengan pengolahan statistik otomatis (Rata-rata Harga dalam Rupiah, Produk Termahal, Total Jersey, dan Jumlah Kategori Liga), fitur penandaan favorit disimpan di `localStorage`, validasi form preferensi *client-side*, serta penanganan *loading/error state* yang dilengkapi tombol *retry* dan catatan *timestamp* waktu muat data.

---

## 3. Perhitungan Variasi Soal Berdasarkan NIM/NPM
Tiga digit terakhir NPM: **2440304023** $\rightarrow$ **$X = 0$, $Y = 2$, $Z = 3$**

1. **Digit X = 0** $\rightarrow$ **Dataset & Tema:**
   * **Dataset:** Products (`(https://dummyjson.com/products?limit=20)`)
   * **Tema Project:** Dashboard Produk / UMKM (Lapak Jersey UMKM Tarakan)
2. **Digit Y = 2** $\rightarrow$ **Fitur Utama Wajib:**
   * **Favorite / Bookmark:** Menyimpan produk pilihan pengguna ke `localStorage`
3. **Digit Z = 3** $\rightarrow$ **Form & Validasi Client-Side:**
   * **Validasi Form:** Memvalidasi bahwa minimal satu kategori/preferensi dipilih
4. **Challenge Individual C:**
   * **Rumus:** $S = X + Y + Z = 0 + 2 + 3 = 5$
   * **Hitung C:** $C = S \bmod 4 = 5 \bmod 4 = 1$
   * **Hasil Challenge C = 1:** Tombol **Retry** ketika fetch gagal + Waktu terakhir data berhasil dimuat (*Last Loaded Timestamp*)

---

## 4. Dataset / API yang Digunakan
- **REST API Server:** DummyJSON Products (`(https://dummyjson.com/products?limit=20)`)
- **Pengolahan Data (*Front-End Transformation*):**  
  Data JSON mentah dari DummyJSON dipetakan di sisi *front-end* menggunakan JavaScript untuk mengonversi harga dari USD ke mata uang Rupiah (`IDR`) serta memetakan produk menjadi katalog jersey bola UMKM yang terhubung dengan aset gambar lokal.

---

## 5. Fitur Utama dan Challenge
1. **Analisis Data Wajib (JavaScript):**
   * Kalkulasi total jersey dimuat.
   * Kalkulasi rata-rata harga produk dalam Rupiah menggunakan `.reduce()`.
   * Pencarian produk termahal menggunakan `.sort()`.
   * Identifikasi jumlah kategori unik liga menggunakan `Set`.
2. **Fitur Favorite / Bookmark (Digit Y=2):**
   * Menandai/menghapus jersey favorit dan menyimpannya secara permanen di `localStorage`.
   * Menampilkan *badge counter* jumlah jersey favorit secara *real-time*.
   * Filter tampilan khusus tab "★ Favorit Saya".
3. **Form Preferensi & Validasi (Digit Z=3):**
   * Validasi *client-side* untuk input Nama Lengkap dan minimal 1 pilihan checkbox kategori/liga.
   * Menampilkan pesan error khusus di bawah *field* yang tidak valid tanpa me-load ulang halaman.
4. **Challenge Individual (Challenge C=1):**
   * Tombol **"Coba Lagi (Retry Fetch)"** yang muncul saat request API gagal.
   * Tombol **"Simulasi Network Error"** untuk menguji penanganan *error state*.
   * Informasi *timestamp* waktu terakhir data berhasil dimuat (*Last Loaded Time*).

---

## 6. Cara Menjalankan Project
1. Pastikan aplikasi **Laragon 5** telah terinstal dan berjalan (*Apache Active*).
2. Salin folder proyek ini ke direktori web server Laragon:  
   `C:\laragon\www\PTS_PEMWEB_2440304023_Muhammad_Bintang`
3. Buka peramban web (Google Chrome / Microsoft Edge) dan ketikkan alamat berikut:  
   `http://localhost/PTS_PEMWEB_2440304023_Muhammad_Bintang/`

---

## 7. Screenshot Tampilan Aplikasi
Tersedia di dalam file `PTS_2440304023_Muhammad Bintang.pdf`

---

## 8. Endpoint REST API
| Endpoint Path | Method | Status Code | Content-Type | Deskripsi |
| :--- | :---: | :---: | :---: | :--- |
| `[https://dummyjson.com/products?limit=20](https://dummyjson.com/products?limit=20)` | `GET` | `200 OK` | `application/json` | Mengambil data mentah 20 produk dari DummyJSON untuk diproses menjadi katalog jersey. |
| `[https://dummyjson.com/invalid-url-404](https://dummyjson.com/invalid-url-404)` | `GET` | `404 Not Found` | `application/json` | Endpoint buatan untuk menguji *Error State* dan tombol *Retry*. |

---

## 9. Jawaban 10 Pertanyaan Penjelasan Kode

### Pertanyaan 1: Alur sejak halaman dibuka sampai data REST API tampil.
* **Jawaban:** Saat halaman dibuka, browser mengeksekusi script `app.js`. Fungsi `updateFavBadgeCount()` dipanggil untuk membaca data favorit dari `localStorage`, disusul panggilan fungsi `fetchProducts()`. Fungsi `fetchProducts()` menampilkan *loading spinner*, lalu mengeksekusi `fetch(simulatedEndpoint)` menggunakan `async/await`. Setelah respons HTTP diterima dan dikonversi via `response.json()`, data dipetakan ke objek jersey lokal dalam Rupiah, *timestamp* dicatat, fungsi `hitungAnalisisData()` menghitung statistik otomatis, dan fungsi `renderProducts()` menggambar elemen kartu ke DOM.

### Pertanyaan 2: Mengapa setelah fetch() selesai Anda masih perlu memeriksa response.ok?
* **Jawaban:** Fungsi `fetch()` pada JavaScript tidak akan melempar *rejection* atau error jika server mengembalikan kode status kesalahan HTTP seperti `404 Not Found` atau `500 Internal Server Error`. `fetch()` hanya menganggap error jika terjadi kegagalan koneksi jaringan (*offline*). Oleh karena itu, pemeriksaan `if (!response.ok)` wajib dilakukan untuk melempar error secara manual ketika kode status di luar rentang `200-299`.

### Pertanyaan 3: Pilih satu data JSON dari API dan jelaskan bagaimana data tersebut diubah menjadi elemen DOM yang terlihat.
* **Jawaban:** Data JSON berupa objek produk (memiliki `id` dan `price`). Di dalam fungsi `renderProducts()`, kita membuat elemen DOM menggunakan `document.createElement('article')` untuk kartu, `createElement('img')` untuk gambar, `createElement('h3')` untuk judul, dan `createElement('p')` untuk harga. Properti data dimasukkan via `textContent` dan `src`, lalu dirangkai menggunakan `card.append(imgContainer, contentArea)` dan ditambahkan ke kontainer utama menggunakan `productList.append(card)`.

### Pertanyaan 4: Apa yang terjadi jika internet terputus, endpoint salah, atau server mengembalikan HTTP 404/500?
* **Jawaban:** Jika terjadi kesalahan jaringan atau respons HTTP tidak `ok`, alur di dalam blok `try` terhenti dan berpindah ke blok `catch(error)`. Tampilan *loading spinner* disembunyikan, pesan kesalahan ditampilkan pada `#error-message`, dan `#error-box` yang berisi tombol **Retry** ditampilkan di layar agar pengguna dapat mencoba ulang *request*.

### Pertanyaan 5: Jelaskan bagaimana fitur berdasarkan digit Y bekerja. Cantumkan nama fungsi/event yang digunakan.
* **Jawaban:** Fitur Favorite (Y=2) bekerja dengan membaca dan menulis ID produk ke `localStorage` via `getFavoritesFromStorage()` dan `saveFavoritesToStorage()`. Ketika tombol favorit diklik, *event listener* `click` memicu fungsi `toggleFavorite(productId)`. Fungsi ini menambah/menghapus ID dari array favorit, memperbarui jumlah *badge* melalui `updateFavBadgeCount()`, dan merender ulang tampilan DOM via `renderProducts()`.

### Pertanyaan 6: Jelaskan bagaimana validasi berdasarkan digit Z bekerja dan mengapa input tidak valid tidak boleh langsung diproses.
* **Jawaban:** Validasi (Z=3) bekerja pada *event listener* `submit` di form `#preference-form`. JavaScript mengeksekusi `document.querySelectorAll('input[name="kategori_preferensi"]:checked')`. Jika jumlah pilihan adalah `0`, pesan error ditampilkan pada `#error-kategori` dan variabel `isValid` diubah menjadi `false`. Input tidak valid tidak boleh diproses untuk menjaga integritas data dan mencegah masuknya data kosong/rusak ke dalam sistem.

### Pertanyaan 7: Jelaskan penggunaan localStorage pada proyek Anda.
* **Jawaban:** Data yang disimpan di `localStorage` adalah *array of strings* berisi ID jersey favorit (`umkm_jersey_favorites`) dalam format JSON string. Data dibaca saat inisialisasi aplikasi untuk menghitung jumlah favorit dan memberi tanda bintang pada kartu produk, serta diubah setiap kali pengguna mengklik tombol favorit. `localStorage` digunakan agar preferensi pengguna tetap tersimpan meskipun halaman di-*refresh* atau browser ditutup.

### Pertanyaan 8: Analisis Input - Proses - Output potongan satu fungsi JavaScript penting (maksimal 15 baris).
```javascript
function formatRupiah(jumlah) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(jumlah);
}
```

### Pertanyaan 9: Sebutkan bug/error paling sulit selama PTS, penyebabnya, cara menemukannya, dan cara memperbaikinya.
* **Jawaban**: Error paling sulit adalah saat gambar eksternal dari URL internet mengalami broken link atau diblokir oleh kebijakan server (hotlinking). Penyebabnya adalah ketergantungan pada koneksi dan server eksternal. Ditemukan melalui tab Console DevTools yang menampilkan pesan GET 404/403. Diperbaiki dengan mengunduh seluruh gambar jersey ke folder lokal images/ dan memperbarui jalur gambar pada array data di js/app.js.

### Pertanyaan 10: Jika diberi satu minggu lagi, sebutkan dua perbaikan teknis yang akan Anda lakukan dan alasannya.
* **Jawaban**: Menambahkan fitur Live Search dengan teknik debounce agar pengguna dapat mencari jersey berdasarkan nama klub tanpa mengalami lag UI. Menambahkan Modal Popup Detail Item untuk menampilkan rincian bahan jersey, panduan ukuran (size chart), dan simulasi tombol keranjang belanja.


## 10. AI Usage Log
| Tanggal | AI/Tool | Tujuan | Prompt/Ringkasan | Bagian Digunakan | Verifikasi/Modifikasi |
| :---: | :---: | :--- | :--- | :--- | :--- |
| 19/10/2026 | Gemini | Brainstorming & HTML/CSS | Brainstorming tema UMKM lokal & pembuatan struktur HTML/CSS responsif | Layout CSS Grid & Flexbox | Memodifikasi variabel warna :root dan menyesuaikan tag semantik HTML5. |
| 19/10/2026 | Gemini | Logic & Validation | Bantuan penanganan Fetch API, error retry state, dan validasi form | Fungsi fetchProducts(), validasi checkbox, & localStorage | Memeriksa fungsi via Laragon 5, mengganti data gambar ke lokal images/, dan memverifikasi di DevTools. |