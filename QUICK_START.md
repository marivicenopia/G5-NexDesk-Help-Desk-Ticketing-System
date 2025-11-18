# Quick Start - Knowledge Base Integration

## 🚀 Quick Start Commands

### 1. Start C# Backend
```powershell
# In Visual Studio:
# 1. Open ReactCsharp_Basecode/ASI.Basecode.sln
# 2. Set ASI.Basecode.WebApp as startup project
# 3. Press F5 or click Run button
# Backend runs on: https://localhost:5001
```

### 2. Start React Frontend
```powershell
cd C:\Alliance\G5-NexDesk-Help-Desk-Ticketing-System
npm run dev
# Frontend runs on: http://localhost:5173
```

## ✅ Pre-Flight Checklist

Before testing, verify:

- [ ] SQL Server is running (`SQL Server (SQLEXPRESS)` service)
- [ ] Database `nexdesk_db` exists
- [ ] Tables `knowledge_categories` and `articlesdb` exist
- [ ] Categories are seeded (check SSMS: `SELECT * FROM knowledge_categories;`)
- [ ] C# backend connection string in `appsettings.json` is correct
- [ ] C# backend builds without errors
- [ ] React app builds without errors

## 🧪 Quick Test

1. **Open browser**: `http://localhost:5173`
2. **Navigate to**: Knowledge Base page
3. **Expected**: Categories load from database
4. **Test Add**: Click "Add Article" → Fill form → Submit
5. **Verify**: New article appears in category
6. **Check DB**: Open SSMS → Check `articlesdb` table

## 🔧 Common Issues

| Issue | Quick Fix |
|-------|-----------|
| CORS Error | Check backend CORS config includes your React port |
| SSL Error | Click "Advanced" → "Proceed to localhost" in browser |
| 404 Error | Verify backend is running on `https://localhost:5001` |
| Empty List | Check database has categories and articles |
| Delete Not Working | Verify user role is "Admin" in database |

## 📝 API Endpoints

All Knowledge Base endpoints:
- `GET /api/KnowledgeBase/GetCategories` - Get all categories with articles
- `GET /api/KnowledgeBase/GetArticle/{id}` - Get article details
- `POST /api/KnowledgeBase/AddArticle` - Create new article
- `DELETE /api/KnowledgeBase/DeleteArticle/{id}` - Delete article (admin only)

## 🎯 What's Working

✅ Categories load from database  
✅ Articles grouped by category  
✅ Add Article creates DB record  
✅ View Article shows full content  
✅ Delete Article (admin only, not COMPLETED)  
✅ All calls go to C# backend

## ⚠️ Known Limitations

- Edit Article: Update endpoint not yet implemented in C# backend
- Authentication: May need to implement proper auth for production

