# 🤖 Telegram Bot CI/CD Integration Setup

## 📋 Overview

File CI/CD telah diupdate untuk mengirim notifikasi hasil test ke Telegram channel setelah GitHub Actions selesai running.

## 🔐 Required GitHub Secrets

Anda perlu menambahkan secrets berikut di GitHub repository settings:

### **Telegram Bot Secrets**
```
TELEGRAM_BOT_TOKEN    = Bot token dari @BotFather
TELEGRAM_CHAT_ID      = Chat ID channel/group tujuan
```

### **Existing Secrets (if not set)**
```
SONAR_TOKEN          = SonarCloud token
SONAR_PROJECT_KEY    = SonarCloud project key  
SONAR_ORGANIZATION   = SonarCloud organization
PAT                  = Personal Access Token for Docker/Snyk
```

## 🚀 How to Setup GitHub Secrets

### **1. Go to Repository Settings**
```
GitHub Repository → Settings → Secrets and variables → Actions
```

### **2. Add New Repository Secrets**
Click "New repository secret" dan tambahkan:

**TELEGRAM_BOT_TOKEN**
```
Value: Bot token dari @BotFather (contoh: 7234567890:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw)
```

**TELEGRAM_CHAT_ID**
```
Value: Chat ID channel/group (contoh: -1001234567890)
```

## 📱 How to Get Telegram Credentials

### **1. Create Bot Token**
```bash
1. Chat dengan @BotFather di Telegram
2. Send /newbot
3. Follow instructions
4. Copy bot token yang diberikan
```

### **2. Get Chat ID**
```bash
1. Add bot ke channel/group
2. Send message di channel
3. Visit: https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
4. Look for "chat":{"id": -1001234567890}
5. Copy chat ID (include minus sign)
```

## 🔄 CI/CD Flow

### **Updated Pipeline Steps:**
```yaml
1. Checkout code
2. Setup Node.js
3. Install dependencies  
4. Run tests with coverage          ← Updated
5. Send Test Results to Telegram    ← NEW STEP
6. SonarCloud Scan
7. Snyk Security Scan
8. Build & Push Docker
```

### **Telegram Notification Triggers:**
- ✅ **Always runs** - regardless of test success/failure
- 📊 **Includes coverage** - full test metrics
- 🔗 **GitHub context** - branch, author, commit info
- 📱 **Clean format** - matches current bot format

## 📄 Environment Variables Passed

```yaml
TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
GIT_BRANCH: ${{ github.ref_name }}
GIT_AUTHOR: ${{ github.actor }}
GIT_COMMIT: ${{ github.sha }}
GITHUB_REPOSITORY: ${{ github.repository }}
GITHUB_RUN_ID: ${{ github.run_id }}
GITHUB_SERVER_URL: ${{ github.server_url }}
```

## 🎯 Expected Telegram Message

```
🟢 Book Catalog App - CI/CD Test | 2:30PM

Book Catalog App
GitHub Actions | Jest Testing

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

🔗 GitHub Action: https://github.com/owner/repo/actions/runs/123456
📝 Commit: abc1234 by github-user
🌿 Branch: main
```

## ⚠️ Troubleshooting

### **If notification not sent:**
1. Check secrets are properly set
2. Verify bot token is valid
3. Ensure bot is added to channel
4. Check bot has send message permission
5. Verify chat ID format (include minus for groups)

### **Test locally first:**
```bash
# Set environment variables in .env
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHAT_ID=your_chat_id

# Run notification script
npm run telegram:test
```

## ✅ Next Steps

1. **Add secrets** to GitHub repository
2. **Push changes** to trigger CI/CD
3. **Check Telegram** for notification
4. **Verify format** matches expectations

**Your CI/CD pipeline will now automatically notify Telegram channel after every test run!** 🎉
