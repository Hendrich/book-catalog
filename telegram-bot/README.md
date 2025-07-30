# 🤖 Telegram Bot untuk Jest Test Coverage Notifications

Bot Telegram yang mengirim notifikasi hasil test coverage dari Jest dengan format yang clean dan modern.

## 📱 Format Pesan

### **Clean Format (Default)**
```
🟢 Book Catalog App | 7:45PM

BookCatalogApp
Automated | Test Coverage Report

- Tests = 337
- Passes = 337
- Skip = 0
- Failures = 0
- Duration = 4521ms
- Passes (%) = 100.00

📊 Coverage Summary:
- Statements = 82.27%
- Branches = 72.52%
- Functions = 78.84%
- Lines = 82.30%

✅ Status: SUCCESS - All tests passed
```

## 🚀 Quick Start

### 1. Setup Bot Telegram
1. Chat dengan `@BotFather` di Telegram
2. Buat bot baru: `/newbot`
3. Copy token yang diberikan
4. Kirim pesan ke bot untuk mendapat chat ID

### 2. Environment Setup
Tambahkan ke file `.env`:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
GIT_BRANCH=main
GIT_AUTHOR=Your Name
```

### 3. Test & Run
```bash
# Test koneksi bot
npm run telegram:diagnose

# Run tests dengan notifikasi
npm run test:coverage
```

## 📋 Available Commands

### **Test Coverage Commands**
```bash
npm run test:coverage        # Clean format (recommended)
npm run test:coverage:clean  # Clean format explicit
npm run test:coverage:advanced # Advanced parsing
npm run test:coverage:simple # Quick execution
```

### **Telegram Commands**
```bash
npm run telegram:test       # Test bot connection
npm run telegram:clean      # Test clean format
npm run telegram:send       # Send manual notification
npm run telegram:diagnose   # Full system check
```

### **Utility Commands**
```bash
node telegram-bot/count-tests.js    # Count actual tests
node telegram-bot/diagnose.js       # System diagnostics
```

## 🎯 Status Indicators

| Emoji | Status | Kondisi |
|-------|--------|---------|
| 🟢 | SUCCESS | Semua test passed |
| 🔴 | FAILED | Ada test yang failed |
| ⚪ | NO TESTS | Tidak ada test ditemukan |

## 📊 Features

✅ **Real Test Count** - Parsing akurat dari Jest output (337 tests detected)  
✅ **Clean Format** - Format pesan yang modern dan readable  
✅ **Auto Status** - Status emoji otomatis berdasarkan hasil  
✅ **Coverage Integration** - Data coverage real dari Jest  
✅ **Multiple Fallbacks** - Parsing dengan multiple strategies  
✅ **Environment Config** - Konfigurasi via environment variables  
✅ **Comprehensive Testing** - Tools untuk debugging dan testing  

## 🔧 Troubleshooting

### Bot tidak mengirim pesan
```bash
npm run telegram:diagnose  # Run full diagnostic
```

Common solutions:
- Check environment variables di `.env`
- Pastikan bot sudah di-start (`/start` di Telegram)
- Verify internet connection

### Test count undefined
- File sudah include parsing dengan multiple strategies
- Fallback ke file analysis jika Jest parsing gagal
- Hardcoded fallback untuk emergency cases

### Coverage tidak muncul
```bash
npm run test:coverage  # Generate coverage first
```

## 📁 File Structure

```
telegram-bot/
├── TelegramTestNotifier.js      # Main bot class
├── test-notification.js        # Connection tester
├── send-notification.js        # Manual sender
├── count-tests.js              # Test counter
├── diagnose.js                 # Diagnostic tool
├── jest-clean-notification.js  # Jest integration
├── test-clean-format.js        # Format tester
└── CLEAN_FORMAT_GUIDE.md       # Format documentation
```

## 🎨 Customization

### Change Project Name
Edit `.env`:
```env
GIT_AUTHOR=Your Project Name
```

### Custom Message Format
Edit `formatCleanMessage` method in `TelegramTestNotifier.js`

### Different Format
Use `sendDetailedNotification()` for verbose format

## 📖 API Reference

### TelegramTestNotifier Class

```javascript
const notifier = new TelegramTestNotifier();

// Send clean format
await notifier.sendNotification(testData, coverageData, options);

// Send detailed format  
await notifier.sendDetailedNotification(testData, coverageData, options);

// Test connection
await notifier.testConnection();
```

### Data Formats

```javascript
// Test Data
const testData = {
  total: 337,
  passed: 335, 
  failed: 2,
  skipped: 0,
  duration: 4521,
  hasErrors: false
};

// Coverage Data
const coverageData = {
  statements: { pct: 82.27, covered: 376, total: 457 },
  branches: { pct: 72.52, covered: 161, total: 222 },
  functions: { pct: 78.84, covered: 41, total: 52 },
  lines: { pct: 82.30, covered: 372, total: 452 }
};
```

Bot siap digunakan dan akan memberikan notifikasi yang informatif setiap kali test dijalankan! 🚀
