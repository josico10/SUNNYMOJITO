# SUNNY MOJITO — React Web (User & Admin)

Website SUNNY MOJITO berbasis **React + Vite**, dibuat dari desain Figma di `Peminjaman_Alat.zip`.
Terdiri dari dua bagian:

| Bagian | Alamat | Isi |
| --- | --- | --- |
| **User** (website publik) | `/` | Hero, About, Products, Ingredients, Why choose us, Gallery, Contact, Footer |
| **Admin** (workspace) | `/admin` | Login, Dashboard, Products (CRUD), Product editor, Gallery, Contacts, Settings, Admin Profile |

## Menjalankan

```bash
npm install
npm run dev        # buka http://localhost:5173
npm run build      # hasil build ada di folder dist/
npm run preview    # coba hasil build
```

Butuh Node.js 18 atau lebih baru.

## Login admin (data contoh)

- Alamat: `http://localhost:5173/admin/login` (atau tautan **Admin login** di footer website)
- Username: `alex.morgan`
- Password: `Sunshine#2026`

Username dan password bisa diganti di halaman **Admin Profile**.

## Cara kerja data

Proyek ini **tanpa backend**: semua data (produk, galeri, kontak, pengaturan, akun admin) disimpan di
`localStorage` browser, dimulai dari data contoh di `src/data/seed.js`. Perubahan di admin langsung
tampil di website publik pada browser yang sama.

- Produk berstatus **Active** tampil di website, **Inactive** hanya tersimpan di admin.
- Foto yang diunggah diperkecil otomatis (maks. 1400 px) agar muat di penyimpanan browser.
- Tombol **Order Now** membuka WhatsApp memakai nomor dari halaman Contacts.
- Statistik pengunjung di Dashboard adalah data contoh (`stats` di `seed.js`).
- Untuk mengosongkan data: hapus key `sunny-mojito:data:v1` di DevTools → Application → Local Storage.

Untuk produksi, ganti fungsi di `src/context/AppContext.jsx` dengan pemanggilan API ke backend
(misalnya Express) dan simpan akun admin dengan password ter-hash di server. Login di proyek ini
hanya untuk demo, bukan pengamanan sungguhan.

## Struktur

```
public/images/            foto produk, galeri, dan hero
src/
  App.jsx                 daftar route (user + admin)
  context/AppContext.jsx  state, penyimpanan lokal, login/logout
  data/seed.js            data contoh
  lib/                    helper format & pemrosesan gambar
  components/             Icon, Logo, Modal, Toast, StatusPill
  pages/site/             website publik (SiteLayout, HomePage)
  pages/admin/            semua halaman admin
  styles/                 base.css, site.css, admin.css
```
