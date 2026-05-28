# 💰 MoneyFlowID Bot

![MoneyFlow Banner](https://images.unsplash.com/photo-1579621970563-430f63602e8e?w=1200&h=300&fit=crop)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Made with Node.js](https://img.shields.io/badge/Made%20with-Node.js-green?logo=node.js)](https://nodejs.org)
[![Telegram Bot](https://img.shields.io/badge/Telegram-Bot%20API-blue?logo=telegram)](https://core.telegram.org/bots/api)
[![Google Sheets](https://img.shields.io/badge/Google-Sheets%20API-4285F4?logo=google)](https://developers.google.com/sheets)
[![Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-9c27b0)](https://aistudio.google.com)

> **Bot Telegram untuk manajemen keuangan pribadi yang cerdas, dengan AI & Google Sheets**

Bot all-in-one untuk tracking income, expenses, dan memberikan insights keuangan secara real-time. Terintegrasi dengan **Gemini AI** untuk parsing transaksi natural language dan **Google Sheets** untuk visualisasi data yang rapi.

---

## ✨ Fitur Utama

### 📊 **Pencatatan Transaksi Lengkap**
- 💰 **Income (Pemasukan)** — Dari berbagai sumber (Gaji, Freelance, Laba Dagang, Investasi, dll)
- 💸 **Spending (Pengeluaran)** — Per kategori detail (Makan/Minum, Transport, Belanja, Pulsa, Service, Kesehatan, Hiburan, Pendidikan, dll)
- ↔️ **Transfer Antar Akun** — Mudah pindah saldo antar rekening/e-wallet tanpa mengurangi total
- 📅 **Bayar Tagihan (Bills)** — Tracking bulanan (Netflix, YouTube Premium, Spotify, Internet, dll)
- 💳 **Utang** — Catat pinjaman yang kami terima + tracking pelunasan
- 💼 **Piutang** — Catat pinjaman yang kami berikan + tracking penerimaan
- 🎯 **Sinking Fund** — Atur dana darurat & target tabungan khusus

### 🤖 **AI-Powered Features**
- **Natural Language Transaction Parser** — Cukup chat "Bayar makan di warteg 15rb" → bot otomatis parsing dan catat!
- **AI Financial Insight** — Gemini AI memberikan analisis & rekomendasi berdasarkan pola spending Anda
- **Smart Category Matching** — AI membantu menebak kategori transaksi secara otomatis

### 📊 **Laporan & Analytics**
- 📈 **Monthly Report** — Ringkasan income, expenses, net, savings rate, utang, piutang
- 📋 **Category Breakdown** — Lihat pengeluaran per kategori dalam sebulan
- 💳 **Account Balance** — Check saldo real-time semua akun/dompet
- 📉 **Spending Trends** — Grafik visualisasi di spreadsheet
- 💰 **Financial Health Check** — Status keuangan bulan ini dari AI

### 💾 **Google Sheets Integration**
- **Auto-generated Monthly Sheet** — Sheet baru dibuat otomatis tiap bulan (contoh: "May 2026")
- **Professional Layout** — Tersistem dengan Dashboard, Transaksi, Bills, Utang, Piutang, Ringkasan
- **Real-time Sync** — Semua data langsung tersimpan di Sheets
- **Easy Sharing** — Export laporan & bagikan dengan mudah

### ⚙️ **Manajemen Akun & Pengaturan**
- 🏦 **Multiple Accounts** — Support berbagai bank, e-wallet, & cash (BCA, BRI, Gopay, OVO, ShopeePay, etc)
- 🎯 **Budget Setting** — Atur budget per kategori & track pengeluaran vs budget
- 🌐 **Bilingual Support** — Bahasa Indonesia & English, bisa ganti kapan saja
- 👥 **Multi-user** — Setiap pengguna punya data, akun, & budget terpisah
- 🔄 **Flexible Setup** — Customize income sources, spending categories, akun, & bills sesuai kebutuhan



---

## 📋 Struktur Sheet Bulanan

Setiap bulan, bot secara otomatis membuat 1 sheet baru dengan nama bulan (contoh: "May 2026") dan layout profesional:

### **Bagian Kiri (Dashboard & Setup)**
| Kategori | Keterangan |
|----------|-----------|
| **Monthly Statement** | Ringkasan total income, expenses, net, savings rate |
| **Transaction Methods** | Saldo real-time tiap akun/dompet |
| **Bills** | List tagihan bulanan yang harus dibayar |
| **Sinking Fund** | Dana darurat & target tabungan |
| **Spendings** | Total pengeluaran per kategori + progress budget |
| **Cicilan/Utang** | Daftar utang beserta status pelunasan |
| **Piutang** | Daftar piutang beserta status penerimaan |

### **Bagian Kanan (Transaction Log - Kolom H-N)**
Tabel lengkap semua transaksi dengan kolom:
- **Date** — Tanggal transaksi
- **Transaction** — Deskripsi transaksi
- **Amount** — Nominal dalam Rupiah
- **Cashflow** — Tipe (Income/Expense/Bills/Utang/Piutang/etc)
- **Category** — Kategori transaksi
- **Dari Account** — Akun sumber
- **Ke Account** — Akun tujuan

---

## 🎯 Cara Kerja Bot

### **Menu Utama (7 Pilihan)**
```
💰 Pemasukan     →  Catat income dari berbagai sumber
💸 Pengeluaran   →  Catat spending per kategori
↔️  Transfer      →  Pindah uang antar akun
📋 Lainnya       →  Bills, Utang, Piutang, Sinking Fund
📊 Laporan       →  Monthly Report, Category Analysis, AI Insight
💳 Saldo         →  Lihat saldo semua akun
📈 Atur Budget   →  Set budget per kategori & lihat progress
🤖 AI Chat       →  Chat natural language untuk catat transaksi
⚙️  Pengaturan    →  Customize akun, kategori, sumber income, bahasa
```

### **Contoh Penggunaan (AI Chat Feature)**
User bisa langsung chat transaksi dengan bahasa natural:
- *"Bayar makan di warteg 15rb dari BCA"* → Bot parse & catat spending
- *"Transfer 100rb dari Gopay ke BCA"* → Bot handle transfer
- *"Gaji 5 juta masuk ke BRI hari ini"* → Bot catat income

---

## 🚀 Cara Setup

### 1. Prasyarat
- [Node.js](https://nodejs.org) v18+ terinstall
- Akun Google (untuk Google Sheets API)
- Akun Telegram
- Gemini API Key (gratis di [Google AI Studio](https://aistudio.google.com))

### 2. Clone & Install

```bash
cd C:\Users\Ikhsanh\Downloads\bot\MoneyFlowIDBot
npm install
```

### 3. Buat Telegram Bot

1. Chat ke [@BotFather](https://t.me/BotFather) di Telegram
2. Kirim `/newbot`
3. Ikuti instruksi, catat **Bot Token**

### 4. Buat Google Service Account

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Buat project baru (atau pilih yang sudah ada)
3. Aktifkan **Google Sheets API**:
   - APIs & Services → Library → "Google Sheets API" → Enable
4. Buat Service Account:
   - APIs & Services → Credentials → Create Credentials → Service Account
   - Isi nama, klik Create & Continue
5. Download JSON key:
   - Klik service account yang baru dibuat
   - Tab "Keys" → Add Key → JSON
   - File JSON akan terdownload
6. **Salin file JSON** ke: `credentials/google-credentials.json`
7. **Catat email** service account (contoh: `bot@project.iam.gserviceaccount.com`)

### 5. Setup Google Spreadsheet

1. Buat spreadsheet baru di [Google Sheets](https://sheets.google.com)
2. **Share spreadsheet** ke email service account dengan akses **Editor**:
   - Klik Share → paste email service account → pilih Editor
3. **Catat Spreadsheet ID** dari URL:
   ```
   https://docs.google.com/spreadsheets/d/[INI_SPREADSHEET_ID]/edit
   ```

### 6. Konfigurasi .env

```bash
copy .env.example .env
```

Edit file `.env`:

```env
# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Google AI (Gemini)
GEMINI_API_KEY=your_gemini_api_key_here

# Google Credentials
GOOGLE_CREDENTIALS_PATH=./credentials/google-credentials.json

# Timezone (untuk cron jobs)
TIMEZONE=Asia/Jakarta
```

### 7. Jalankan Bot

```bash
node index.js
```

Output yang diharapkan:
```
🚀 MoneyFlowID Bot starting...
✅ Bot @YourBotName berjalan!
```

### 8. Setup via Telegram

1. Buka Telegram, cari bot kamu
2. Kirim `/start`
3. Pilih bahasa (ID/EN)
4. Masukkan Spreadsheet ID
5. Setup sumber income, akun, kategori, tagihan
6. Selesai! Sheet bulan ini otomatis terbuat 🎉

## 📱 Cara Penggunaan

### Menu Utama
- **💰 Pemasukan** — Catat income
- **💸 Pengeluaran** — Catat spending
- **↔️ Transfer** — Pindah saldo antar akun
- **📋 Lainnya** — Bills, Piutang, Utang
- **📊 Laporan** — Berbagai laporan keuangan
- **💳 Saldo** — Cek saldo semua akun
- **🤖 AI Chat** — Chat dengan Gemini AI
- **⚙️ Pengaturan** — Ubah setting

### AI Chat
Ketik transaksi dengan bahasa natural:
- `"beli makan 25rb dari Gopay"`
- `"gajian 5jt masuk BCA"`
- `"transfer 100rb dari SeaBank ke Gopay"`
- `"gimana keuangan saya bulan ini?"`

## 📂 Struktur Folder

```
MoneyFlowIDBot/
├── index.js                 # Entry point + routing
├── .env                     # Konfigurasi sensitif (tidak di-commit)
├── .env.example             # Template .env
├── config/
│   └── defaults.js          # Daftar default (akun, kategori, dll)
├── handlers/
│   ├── menu.js              # Semua keyboard builder
│   ├── start.js             # Onboarding & /start
│   ├── setup.js             # Flow setup keuangan
│   ├── transaction.js       # Catat transaksi
│   └── report.js            # Laporan & AI
├── locales/
│   ├── id.js                # Bahasa Indonesia
│   ├── en.js                # English
│   └── index.js             # Locale loader
├── middleware/
│   └── session.js           # State management
├── services/
│   ├── sheets.js            # Google Sheets API + monthly template
│   ├── userStore.js         # User data management (JSON)
│   └── gemini.js            # Gemini AI integration
├── credentials/
│   └── google-credentials.json  # Service account key (JANGAN di-commit!)
└── data/
    └── {userId}.json        # Data per user
```

## ⚙️ Tipe Cashflow & Alur Transaksi

| Tipe | Keterangan | Dari → Ke | Contoh |
|------|-----------|-----------|--------|
| **Income** | Pemasukan dari sumber | → Akun | Gaji masuk ke BCA |
| **Spending** | Pengeluaran kategori | Akun → | Beli makan dari Gopay |
| **Transfer** | Pindah antar akun | Akun → Akun | Pindah dari BCA ke Gopay |
| **Bills** | Bayar tagihan bulanan | Akun → | Bayar Netflix dari BCA |
| **Piutang Baru** | Beri pinjaman ke orang | Akun → | Pinjami teman 500rb |
| **Pelunasan Piutang** | Terima balik pinjaman | → Akun | Teman bayar 500rb |
| **Utang Baru** | Pinjam dari orang | → Akun | Pinjam dari ortu 2jt |
| **Pelunasan Utang** | Bayar utang ke orang | Akun → | Bayar utang ortu 500rb |
| **Sinking Fund** | Tabungan tujuan | Akun → | Tabung untuk liburan |
| **Financial Goals** | Target keuangan | Akun → | Alokasi untuk investasi |

---

## 🏠 Menjalankan di Home Server (Lokal)

Untuk menjalankan terus-menerus di mini PC / home server:

### Windows (Task Scheduler)
1. Buka Task Scheduler
2. Create Basic Task → name: "MoneyFlowID Bot"
3. Trigger: At startup
4. Action: Start a program
   - Program: `node`
   - Arguments: `index.js`
   - Start in: `C:\Users\Ikhsanh\Downloads\bot\MoneyFlowIDBot`

### Menggunakan PM2 (Rekomendasi)
```bash
npm install -g pm2
pm2 start index.js --name "moneyflow-bot"
pm2 save
pm2 startup
```

Bot akan otomatis restart jika crash dan saat server reboot.

### Linux (Systemd Service)

Buat file `/etc/systemd/system/moneyflowid-bot.service`:

```ini
[Unit]
Description=MoneyFlowID Telegram Bot
After=network.target

[Service]
Type=simple
User=<your-username>
WorkingDirectory=/home/your-user/MoneyFlowIDBot
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Jalankan:
```bash
sudo systemctl daemon-reload
sudo systemctl enable moneyflowid-bot
sudo systemctl start moneyflowid-bot
```

---

## 🛠️ Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| **Bot Framework** | node-telegram-bot-api |
| **AI / NLP** | Google Gemini 3.5 Flash |
| **Database** | Google Sheets (via googleapis) |
| **Runtime** | Node.js 18+ |
| **Local Storage** | JSON files |
| **Task Scheduler** | node-cron |
| **Environment** | dotenv |

---

## 📖 Dokumentasi API

### User Data Structure
```javascript
{
  userId: "string",
  name: "string",
  username: "string",
  lang: "id" | "en",
  spreadsheetId: "string",
  setupComplete: boolean,
  setupStep: "string",
  incomeSources: [{ name, emoji, active }],
  accounts: [{ name, emoji, type, initialBalance, balance }],
  spendingCategories: [{ name, emoji }],
  bills: [{ name, emoji, amount, dueDay }]
}
```

### Transaction Types
```
- income              (Pemasukan)
- expense             (Pengeluaran)
- bills               (Tagihan)
- savings             (Tabungan/Investasi)
- transfer            (Transfer antar akun)
- utang               (Utang baru)
- pelunasan_utang     (Bayar utang)
- piutang             (Piutang baru)
- pelunasan_piutang   (Terima piutang)
```

---

## 🐛 Troubleshooting

### Bot tidak merespons
- ✅ Cek apakah TELEGRAM_BOT_TOKEN sudah benar di `.env`
- ✅ Cek koneksi internet
- ✅ Buka console dan lihat error messages

### Error: "Spreadsheet not found"
- ✅ Pastikan Spreadsheet ID sudah benar
- ✅ Pastikan service account email sudah di-share dengan akses **Editor**
- ✅ Buka spreadsheet manual untuk memverifikasi akses

### Error: "Invalid API key"
- ✅ Cek GEMINI_API_KEY di `.env`
- ✅ Pastikan API key masih aktif di [Google AI Studio](https://aistudio.google.com)
- ✅ Cek quota Gemini API di [Google Cloud Console](https://console.cloud.google.com)

### Transaksi tidak tercatat
- ✅ Cek apakah setup sudah complete (`/settings` → Setup Check)
- ✅ Lihat console untuk error logs
- ✅ Pastikan sheet bulan ini sudah terbuat otomatis
- ✅ Coba catat transaksi lagi dengan format yang jelas

---

## 💡 Tips & Best Practices

### 1. **Catat Transaksi Segera**
Catat pengeluaran sesegera mungkin agar data akurat & memory tetap fresh.

### 2. **Gunakan AI Chat**
Format natural language jauh lebih cepat daripada menu → dropdown → input.

### 3. **Review Laporan Rutin**
Cek progress budget & spending pattern setiap minggu untuk early warning.

### 4. **Set Budget Realistis**
Budget yang ketat malah membuat frustasi. Gunakan data historis untuk estimate.

### 5. **Backup Spreadsheet**
Download spreadsheet sebagai backup setiap bulannya.

---

## 📞 Support & Feedback

- 🐛 **Found a bug?** Buat issue di repository
- 💡 **Punya ide fitur?** Diskusikan di Discussions
- 💬 **Ada pertanyaan?** Tanya di bot dengan `/help`

---

## 📄 Lisensi

MIT License — Bebas digunakan, dimodifikasi, dan didistribusikan dengan mencantumkan kredit original.

---

## 👨‍💻 Author

**MoneyFlowID Bot** — Personal Finance Tracking Bot made with ❤️

Created by: [@ikhsanh](https://github.com/ikhsanh)  
Powered by: Node.js • Google Sheets • Gemini AI • Telegram

---

**Happy Budgeting! 💰✨**
