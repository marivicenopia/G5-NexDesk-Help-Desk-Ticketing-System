# Knowledge Base Integration - Testing Guide

## Prerequisites

1. **Database Setup** ✅
   - Database `nexdesk_db` created
   - Tables: `knowledge_categories`, `articlesdb` (with `CategoryId` and `Status` columns)
   - Categories seeded: CAT_IT, CAT_DEV, CAT_GEN

2. **C# Backend** ✅
   - Backend code pushed to `RANCES` branch
   - Repositories, Services, Controllers implemented
   - CORS configured for React app

3. **React Frontend** ✅
   - All Knowledge Base components updated to use C# API
   - API config points to `https://localhost:5001`

## Step 1: Start the C# Backend

1. Open Visual Studio
2. Open the solution: `ReactCsharp_Basecode/ASI.Basecode.sln`
3. Verify `appsettings.json` has correct connection string:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=nexdesk_db;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
   }
   ```
4. Set `ASI.Basecode.WebApp` as startup project
5. Click the green **Run** button (or press F5)
6. Backend should start on:
   - `https://localhost:5001` (HTTPS)
   - `http://localhost:5000` (HTTP)

## Step 2: Start the React Frontend

1. Open terminal/PowerShell in the React project folder:
   ```powershell
   cd C:\Alliance\G5-NexDesk-Help-Desk-Ticketing-System
   ```

2. Install dependencies (if not done):
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   npm run dev
   ```
   (or `npm start` if that's your script)

4. Frontend should start on `http://localhost:5173` (or port shown in terminal)

## Step 3: Handle SSL Certificate (If Needed)

If you see SSL certificate errors when calling `https://localhost:5001`:

**Option 1: Trust the certificate in browser**
- Click "Advanced" → "Proceed to localhost" (Chrome/Edge)
- Or add exception in Firefox

**Option 2: Use HTTP instead (for development only)**
- Change `API_CONFIG.BASE_URL` in `src/config/api.ts` to `"http://localhost:5000"`

## Step 4: Test Knowledge Base Features

### Test 1: View Categories (Main Screen)
1. Navigate to Knowledge Base page (Admin or User)
2. **Expected**: Categories should load with article counts
3. **Check**: Categories display correctly (IT, Coding & Dev, General)
4. **Check**: Article count shows for each category

### Test 2: Add Article
1. Click "Add Article" button
2. Fill in the form:
   - Title: "Test Article"
   - Category: Select from dropdown (should show categories from database)
   - Author: "Your Name"
   - Content: "This is a test article"
3. Click "SUBMIT"
4. **Expected**: Success message, redirects to Knowledge Base
5. **Check**: New article appears in the correct category

### Test 3: View Article
1. Click on any article title
2. **Expected**: Article details page opens
3. **Check**: Title, author, content, and category display correctly

### Test 4: Delete Article (Admin Only)
1. Go to Knowledge Base main screen
2. Hover over an article (not COMPLETED status)
3. Click the delete icon (trash)
4. **Expected**: Confirmation dialog appears
5. Click "OK"
6. **Expected**: Article deleted, list refreshes
7. **Test**: Try deleting a COMPLETED article - delete button should be disabled

### Test 5: Delete Article (Manage Page)
1. Navigate to "Manage" / "Delete Article" page
2. **Expected**: Table shows all articles with status
3. **Check**: COMPLETED articles have disabled delete button
4. **Check**: Other articles can be deleted

## Step 5: Verify Database

1. Open SQL Server Management Studio (SSMS)
2. Connect to `localhost\SQLEXPRESS`
3. Expand `nexdesk_db` → Tables
4. Right-click `articlesdb` → "Select Top 1000 Rows"
5. **Check**: New articles appear in database
6. **Check**: `CategoryId` matches selected category
7. **Check**: `Status` is set to "ACTIVE" for new articles

## Troubleshooting

### Issue: CORS Error
**Error**: `Access to fetch at 'https://localhost:5001/...' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution**: 
- Check C# backend `Startup.DI.cs` has CORS configured:
  ```csharp
  .WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:8080")
  ```
- Make sure backend is running
- Restart backend after CORS changes

### Issue: 404 Not Found
**Error**: `404` when calling API endpoints

**Solution**:
- Verify backend is running on `https://localhost:5001`
- Check controller has `[Route("api/[controller]/[action]")]`
- Verify endpoint URL matches: `https://localhost:5001/api/KnowledgeBase/GetCategories`

### Issue: SSL Certificate Error
**Error**: `NET::ERR_CERT_AUTHORITY_INVALID` or similar

**Solution**:
- Click "Advanced" → "Proceed to localhost" in browser
- Or use HTTP: Change `BASE_URL` to `"http://localhost:5000"`

### Issue: Database Connection Error
**Error**: Backend won't start, connection string error

**Solution**:
- Verify SQL Server is running (check Services)
- Update `appsettings.json` with correct server name
- Check database `nexdesk_db` exists in SSMS

### Issue: Empty Categories List
**Error**: Categories load but show 0 articles

**Solution**:
- Check `knowledge_categories` table has data:
  ```sql
  SELECT * FROM knowledge_categories;
  ```
- Verify categories were seeded correctly
- Check `articlesdb` table has articles with matching `CategoryId`

### Issue: Delete Not Working
**Error**: Delete button doesn't work or shows error

**Solution**:
- Verify user role is "Admin" (check in database `dbUser` table)
- Check article status is not "COMPLETED"
- Check browser console for error messages
- Verify `withCredentials: true` is set in axios delete call

## Success Criteria

✅ Categories load from database  
✅ Articles display grouped by category  
✅ Add Article creates new record in database  
✅ View Article shows full content  
✅ Delete Article removes from database (admin only)  
✅ COMPLETED articles cannot be deleted  
✅ All API calls go to C# backend (not mock server)

## Next Steps After Testing

1. If all tests pass: Integration complete! ✅
2. If issues found: Check error messages and troubleshoot
3. Document any additional features needed
4. Prepare for defense presentation

