# 🚨 Quick Fix Guide - API Connection Issues

## ⚡ **Immediate Solutions**

### **Issue 1: 429 Rate Limit Error**

```bash
# Stop server
Ctrl+C

# Restart server (resets rate limits)
npm run dev

# Wait 1 minute before testing again
```

### **Issue 2: Frontend not sending data correctly**

#### **Check Browser Console:**

1. Open browser Dev Tools (F12)
2. Go to Network tab
3. Try login again
4. Check request payload:

**✅ Correct Payload:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**❌ Incorrect Payload:**

```json
{
  "username": "user@example.com", // Wrong field name
  "password": "password123"
}
```

### **Issue 3: Mixed URL Problems**

#### **For Local Testing:**

1. **Frontend Config**: Update `frontend/js/config.js`

```javascript
const API_BASE_URL = "http://localhost:3000"; // Local
```

2. **Postman Collection**: Use `BASE_URL_LOCAL`

```
http://localhost:3000
```

#### **For Production Testing:**

1. **Frontend Config**: Update `frontend/js/config.js`

```javascript
const API_BASE_URL = "https://book-catalog-app-z8p8.onrender.com"; // Production
```

2. **Postman Collection**: Use `BASE_URL_PRODUCTION`

```
https://book-catalog-app-z8p8.onrender.com
```

---

## 🔧 **Step-by-Step Debug Process**

### **Step 1: Verify Server Status**

```bash
# Health check
curl http://localhost:3000/health

# Expected response:
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2025-07-06T...",
  "version": "1.0.0",
  "nodeEnv": "development"
}
```

### **Step 2: Test Registration (New User)**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"password123"}'
```

### **Step 3: Test Login**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"password123"}'
```

### **Step 4: Test with Token**

```bash
# Copy token from login response, then:
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎯 **Common Fixes**

### **Fix 1: Rate Limit Reset**

```bash
# Method 1: Restart server
npm run dev

# Method 2: Wait for window to expire (15 minutes)

# Method 3: Use different IP/browser
```

### **Fix 2: Clear Browser Cache**

```bash
# Chrome/Edge
Ctrl+Shift+R

# Firefox
Ctrl+F5

# Or manually clear cache in Dev Tools
```

### **Fix 3: Check Environment Variables**

```bash
# Verify .env file exists
ls -la .env

# Check critical variables
echo $SUPABASE_URL
echo $JWT_SECRET
```

### **Fix 4: Frontend Form Debugging**

**Add to `frontend/script.js` temporarily:**

```javascript
// Before API call, add logging:
console.log("Login data being sent:", {
  email: username,
  password: password,
});

// Check if values are correct
console.log("Username field value:", document.getElementById("username").value);
console.log("Password field value:", document.getElementById("password").value);
```

---

## 📋 **Verification Checklist**

### **Backend Checklist:**

- [ ] Server running on port 3000
- [ ] Health endpoint responds: `http://localhost:3000/health`
- [ ] Database connection working
- [ ] Environment variables loaded
- [ ] Rate limits not exceeded

### **Frontend Checklist:**

- [ ] Form fields have correct values
- [ ] API base URL points to correct server
- [ ] Content-Type header is `application/json`
- [ ] Request payload contains `email` and `password`
- [ ] No JavaScript errors in console

### **Network Checklist:**

- [ ] No CORS errors
- [ ] Request reaches server (check server logs)
- [ ] Response received by frontend
- [ ] Token stored properly after login

---

## 🆘 **Emergency Reset**

If nothing works, try this complete reset:

```bash
# 1. Stop all processes
Ctrl+C

# 2. Clear browser cache completely
# Chrome: Settings > Privacy > Clear browsing data

# 3. Delete node_modules and reinstall
rm -rf node_modules
npm install

# 4. Restart server
npm run dev

# 5. Try with fresh browser tab/incognito mode
```

---

## 📞 **Still Having Issues?**

### **Collect Debug Information:**

1. Server logs output
2. Browser console errors
3. Network tab request/response
4. Environment variable status
5. Node.js and npm versions

### **Test with Provided Script:**

```bash
node test-api.js local
```

This script will test all endpoints and show exactly where the problem is!

---

**💡 Most issues are caused by rate limiting or incorrect request format. The debug script will identify the exact problem!**
