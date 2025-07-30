# 🎨 Clean Format Telegram Notification

Bot Telegram dengan format pesan yang clean dan modern seperti pada gambar referensi, disesuaikan untuk Jest test coverage.

## 📱 Format Pesan Baru

### **Format Clean (Seperti Gambar)**
```
🟢 Book Catalog App - Daily Test | 6:26AM

BookCatalogApp/automated-testing
Jest Testing | Jest Testing

- Tests = 179
- Passes = 66
- Skip = 61
- Failures = 49
- Duration = 650494ms
- Passes (%) = 36.87

📊 Coverage Summary:
- Statements = 82.27%
- Branches = 72.52%
- Functions = 78.84%
- Lines = 82.30%

🚨 Status: FAILED - 49 test(s) failed
```

### **Format Detailed (Original)**
```
🔴 Book Catalog App | 6:26AM

🔴 Book-Catalog-App
Automated | Test Coverage Report

📊 Test Results:
- Tests = 179
- Passes = 66
- Skip = 61
- Failures = 49
- Duration = 650494ms
- Passes (%) = 36.87

📈 Coverage Results:
- Statements = 82.27% (376/457)
- Branches = 72.52% (161/222)
- Functions = 78.84% (41/52)
- Lines = 82.30% (372/452)

🚨 Status: FAILED - 49 test(s) failed
🌿 Branch: main
⏰ Time: 2025-07-29T12:26:00.000Z
```

## 🚀 Cara Penggunaan

### **1. Format Clean (Recommended)**
```bash
npm run test:coverage        # Clean format (default)
npm run test:coverage:clean  # Explicit clean format
```

### **2. Format Detailed**
```bash
npm run test:coverage:advanced  # Advanced runner with detailed format
```

### **3. Test Format Manual**
```bash
npm run telegram:clean      # Test clean format
npm run telegram:test       # Test original format
```

## 🎯 Status Indicators

| Status | Icon | Kondisi |
|--------|------|---------|
| SUCCESS | 🟢 | Semua test passed |
| FAILED | 🔴 | Ada test yang failed |
| NO TESTS | ⚪ | Tidak ada test ditemukan |

## ⚙️ Konfigurasi Format

### **Menggunakan Clean Format**
```javascript
// Secara default menggunakan clean format
await notifier.sendNotification(testData, coverageData, options);
```

### **Menggunakan Detailed Format**
```javascript
// Untuk format detailed
await notifier.sendDetailedNotification(testData, coverageData, options);
```

### **Custom Format**
```javascript
// Custom message format
const customMessage = notifier.formatCleanMessage(testData, coverageData, {
  projectName: 'Your Project Name',
  branch: 'main',
  author: 'Your Name'
});
```

## 📊 Features Format Clean

✅ **Compact Layout** - Lebih ringkas dan mudah dibaca  
✅ **Status Icons** - Visual indicator yang jelas  
✅ **Time Format** - Format waktu yang user-friendly (6:26AM)  
✅ **Simple Metrics** - Metrics essential tanpa noise  
✅ **Coverage Summary** - Coverage percentage yang clean  
✅ **Auto Status** - Status otomatis berdasarkan hasil test  

## 🔧 Customization

Anda bisa customize format dengan mengubah method `formatCleanMessage` di `TelegramTestNotifier.js`:

```javascript
formatCleanMessage(testData, coverageData, options = {}) {
  // Customize format sesuai kebutuhan
  const message = `${statusIcon} **${projectName}** | ${timeString}`;
  // ... dst
}
```

Bot sekarang mendukung dua format: **Clean** (default) dan **Detailed**, disesuaikan dengan kebutuhan project Anda! 🎉
