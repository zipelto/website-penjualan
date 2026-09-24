# KawaiiCraft

Website katalog dan pemesanan KawaiiCraft yang sudah dipisahkan menjadi HTML, CSS, JavaScript, dan aset gambar.

## Struktur

```text
kawaiicraft-refactor/
├── index.html
├── produk.html
├── styles.css
├── script.js
├── product-page.js
└── kawaiicraft-logo.png
```

## Menjalankan

Buka `index.html` langsung di browser, atau jalankan folder ini melalui Live Server di VS Code.

Katalog dibatasi ke empat jenis produk:

1. Bingkai Flanel Polos
2. Bingkai Flanel Telinga Kucing
3. Bingkai Flanel Duo (2 slot foto)
4. Bingkai Flanel Kolase 4 Foto (4 slot foto)
5. Poster Anime Ready Stock
6. Paket Kombinasi

Produk ready stock membuka halaman detail tersendiri melalui `produk.html?id=...`.
Produk yang perlu dipersonalisasi tetap langsung membuka halaman custom agar pelanggan dapat mengatur detailnya.

Semua bingkai flanel berharga **Rp15.000**. Bingkai Polos dan Telinga Kucing memiliki satu slot foto, Bingkai Flanel Duo memiliki dua slot foto, sedangkan Bingkai Flanel Kolase memiliki empat slot foto. Website menampilkan preview desain bingkai, sedangkan foto asli dikirim melalui WhatsApp saat checkout.
