// [CONFIG]: API DummyJSON & Kurs Rupiah
const API_URL = 'https://dummyjson.com/products?limit=20';
const KURS_RUPIAH = 16000;

// Daftar Jersey beserta Gambar Lokal dari folder images/
const DAFTAR_JERSEY = [
    { nama: "Jersey Manchester United Home 2026", liga: "Premier League", img: "images/mu.jpg" },
    { nama: "Jersey Manchester City Away 2026", liga: "Premier League", img: "images/city.jpg" },
    { nama: "Jersey Real Madrid Home Edisi Gold", liga: "La Liga", img: "images/rm.jpg" },
    { nama: "Jersey FC Barcelona Home Retro", liga: "La Liga", img: "images/fcb.jpg" },
    { nama: "Jersey Arsenal Home 2026 Fans Version", liga: "Premier League", img: "images/ars.jpg" },
    { nama: "Jersey Liverpool Away 2026 Premium", liga: "Premier League", img: "images/liv.jpg" },
    { nama: "Jersey Chelsea Home Custom Name", liga: "Premier League", img: "images/chl.jpg" },
    { nama: "Jersey AC Milan Home Retro 2007", liga: "Serie A", img: "images/acm.jpg" },
    { nama: "Jersey Inter Milan Away Premium", liga: "Serie A", img: "images/int.jpg" },
    { nama: "Jersey Juventus Home Black & White", liga: "Serie A", img: "images/juv.jpg" },
    { nama: "Jersey Bayern Munchen Home Red", liga: "Bundesliga", img: "images/bay.jpg" },
    { nama: "Jersey Paris Saint-Germain Third Kit", liga: "Ligue 1", img: "images/psg.jpg" },
    { nama: "Jersey Borussia Dortmund Home Yellow", liga: "Bundesliga", img: "images/dor.jpg" },
    { nama: "Jersey Atletico Madrid Home Stripes", liga: "La Liga", img: "images/atm.jpg" },
    { nama: "Jersey Tottenham Hotspur Home White", liga: "Premier League", img: "images/tot.jpg" },
    { nama: "Jersey AS Roma Home Retro Red", liga: "Serie A", img: "images/rom.jpg" },
    { nama: "Jersey Napoli Home Special Edition", liga: "Serie A", img: "images/nap.jpg" },
    { nama: "Jersey Ajax Amsterdam Black Gold", liga: "Eredivisie", img: "images/ajx.jpg" },
    { nama: "Jersey Portugal Ronaldo #7", liga: "Tim Nasional", img: "images/cr.jpg" },
    { nama: "Jersey Argentina Messi #10 3-Stars", liga: "Tim Nasional", img: "images/lm.jpg" }
];

// State Aplikasi
let allProducts = [];
let currentFilter = 'all';
let simulatedEndpoint = API_URL;

// Elemen DOM
const productList = document.querySelector('#product-list');
const loadingSpinner = document.querySelector('#loading-spinner');
const errorBox = document.querySelector('#error-box');
const errorMessage = document.querySelector('#error-message');
const btnRetry = document.querySelector('#btn-retry');
const btnSimulasiError = document.querySelector('#btn-simulasi-error');
const lastLoadedInfo = document.querySelector('#last-loaded-info');

// Toolbar & Filter
const btnFilterAll = document.querySelector('#btn-filter-all');
const btnFilterFav = document.querySelector('#btn-filter-fav');
const favCountSpan = document.querySelector('#fav-count');

// Elemen Statistik
const statTotalProduk = document.querySelector('#stat-total-produk');
const statRataHarga = document.querySelector('#stat-rata-harga');
const statProdukTermahal = document.querySelector('#stat-produk-termahal');
const statTotalKategori = document.querySelector('#stat-total-kategori');

// Helper Format Rupiah
function formatRupiah(jumlah) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(jumlah);
}

// [FETCH API]: Async/Await dari DummyJSON + Custom Local Images Mapping
async function fetchProducts() {
    loadingSpinner.style.display = 'block';
    errorBox.style.display = 'none';
    productList.replaceChildren();

    try {
        const response = await fetch(simulatedEndpoint);

        if (!response.ok) {
            throw new Error(`HTTP Error: status ${response.status}`);
        }

        const data = await response.json();
        
        // Transformasi Data ke Jersey + Pemetaan Gambar Lokal
        allProducts = (data.products || []).map((item, index) => {
            const jerseyInfo = DAFTAR_JERSEY[index % DAFTAR_JERSEY.length];
            const hargaRupiah = Math.round(item.price * KURS_RUPIAH);
            return {
                id: item.id,
                title: jerseyInfo.nama,
                category: jerseyInfo.liga,
                priceRp: hargaRupiah,
                thumbnail: jerseyInfo.img
            };
        });

        // Waktu Muat Terakhir (Challenge C=1)
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        lastLoadedInfo.textContent = `Waktu Muat: ${timeString} WITA`;

        // Analisis Data Wajib
        hitungAnalisisData(allProducts);

        // Render Kartu ke DOM
        renderProducts();

    } catch (error) {
        console.error('[API Fetch Error]:', error);
        errorMessage.textContent = `Gagal memuat katalog: ${error.message}`;
        errorBox.style.display = 'block';
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

// TAG [ANALISIS DATA WAJIB]: Pengolahan Array JavaScript
function hitungAnalisisData(products) {
    if (products.length === 0) return;

    statTotalProduk.textContent = `${products.length} Jersey`;

    const totalHarga = products.reduce((acc, curr) => acc + curr.priceRp, 0);
    const avgHarga = Math.round(totalHarga / products.length);
    statRataHarga.textContent = formatRupiah(avgHarga);

    const sortedByPrice = [...products].sort((a, b) => b.priceRp - a.priceRp);
    const termahal = sortedByPrice[0];
    statProdukTermahal.textContent = `${termahal.title} (${formatRupiah(termahal.priceRp)})`;

    const kategoriSet = new Set(products.map(p => p.category));
    statTotalKategori.textContent = `${kategoriSet.size} Liga`;
}

// TAG [LOCALSTORAGE]: Menyimpan Favorit (Digit Y=2)
function getFavoritesFromStorage() {
    return JSON.parse(localStorage.getItem('umkm_jersey_favorites')) || [];
}

function saveFavoritesToStorage(favoritesArray) {
    localStorage.setItem('umkm_jersey_favorites', JSON.stringify(favoritesArray));
    updateFavBadgeCount();
}

function toggleFavorite(productId) {
    let favorites = getFavoritesFromStorage();
    if (favorites.includes(productId)) {
        favorites = favorites.filter(id => id !== productId);
    } else {
        favorites.push(productId);
    }
    saveFavoritesToStorage(favorites);
    renderProducts();
}

function updateFavBadgeCount() {
    const favorites = getFavoritesFromStorage();
    favCountSpan.textContent = favorites.length;
}

// TAG [DOM RENDER]: Menampilkan Kartu Produk
function renderProducts() {
    productList.replaceChildren();
    const favorites = getFavoritesFromStorage();

    let displayedProducts = allProducts;
    if (currentFilter === 'fav') {
        displayedProducts = allProducts.filter(p => favorites.includes(p.id));
    }

    if (displayedProducts.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = currentFilter === 'fav' 
            ? 'Belum ada jersey favorit yang Anda tandai.' 
            : 'Tidak ada jersey ditemukan.';
        emptyMsg.className = 'text-muted';
        productList.append(emptyMsg);
        return;
    }

    displayedProducts.forEach(product => {
        const isFav = favorites.includes(product.id);

        const card = document.createElement('article');
        card.className = 'card';

        const imgContainer = document.createElement('div');
        imgContainer.className = 'card-img-wrapper';

        const img = document.createElement('img');
        img.src = product.thumbnail;
        img.alt = product.title;
        img.className = 'card-img';

        imgContainer.append(img);

        const contentArea = document.createElement('div');
        contentArea.className = 'card-body';

        const cat = document.createElement('span');
        cat.className = 'card-category';
        cat.textContent = product.category;

        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = product.title;

        const price = document.createElement('p');
        price.className = 'card-price';
        price.textContent = formatRupiah(product.priceRp);

        const btnFav = document.createElement('button');
        btnFav.className = `btn-fav ${isFav ? 'is-fav' : ''}`;
        btnFav.textContent = isFav ? '★ Dihapus dari Favorit' : '☆ Tambah Favorit';
        btnFav.addEventListener('click', () => toggleFavorite(product.id));

        contentArea.append(cat, title, price, btnFav);
        card.append(imgContainer, contentArea);
        productList.append(card);
    });
}

// Event Listeners
btnRetry.addEventListener('click', () => {
    simulatedEndpoint = API_URL;
    fetchProducts();
});

btnSimulasiError.addEventListener('click', () => {
    simulatedEndpoint = 'https://dummyjson.com/invalid-url-404';
    fetchProducts();
});

btnFilterAll.addEventListener('click', () => {
    currentFilter = 'all';
    btnFilterAll.classList.add('active');
    btnFilterFav.classList.remove('active');
    renderProducts();
});

btnFilterFav.addEventListener('click', () => {
    currentFilter = 'fav';
    btnFilterFav.classList.add('active');
    btnFilterAll.classList.remove('active');
    renderProducts();
});

// TAG [VALIDASI FORM Z=3]: Minimal 1 Checkbox Kategori Dipilih
const preferenceForm = document.querySelector('#preference-form');
const inputNama = document.querySelector('#input-nama');
const errorNama = document.querySelector('#error-nama');
const errorKategori = document.querySelector('#error-kategori');
const formSuccessBox = document.querySelector('#form-success-box');

preferenceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    errorNama.textContent = '';
    errorKategori.textContent = '';
    formSuccessBox.style.display = 'none';

    if (inputNama.value.trim() === '') {
        errorNama.textContent = 'Nama lengkap wajib diisi.';
        isValid = false;
    }

    const selectedCheckboxes = document.querySelectorAll('input[name="kategori_preferensi"]:checked');
    if (selectedCheckboxes.length === 0) {
        errorKategori.textContent = 'Gagal mengirim: Pilih minimal 1 liga/kategori preferensi!';
        isValid = false;
    }

    if (isValid) {
        const kategoriList = Array.from(selectedCheckboxes).map(cb => cb.value).join(', ');
        formSuccessBox.innerHTML = `Terima kasih <strong>${inputNama.value}</strong>! Preferensi jersey (${kategoriList}) berhasil dicatat.`;
        formSuccessBox.style.display = 'block';
        preferenceForm.reset();
    }
});

// Jalankan Inisialisasi
updateFavBadgeCount();
fetchProducts();