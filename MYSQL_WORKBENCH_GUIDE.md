# MySQL Workbench Connection Guide for DS³

## ✅ Step 1: Check MySQL Workbench Connection

1. **Open MySQL Workbench**
2. You should see a connection like:
   - **Connection Name:** Local instance MySQL80 (or similar)
   - **Hostname:** localhost or 127.0.0.1
   - **Port:** 3306
   - **Username:** root

3. **Test Connection:**
   - Click on the connection
   - Enter your MySQL password
   - You should connect successfully

## 🗄️ Step 2: Create Database Using MySQL Workbench

### Option A: Using SQL Script

1. In MySQL Workbench, click **File → Open SQL Script**
2. Navigate to: `C:\Users\Admin\Desktop\CodePlay\DS-Cube-Checking\config\schema.sql`
3. Click the **⚡ Execute** button (or press Ctrl+Shift+Enter)
4. Check the output panel - should show "X rows affected"

### Option B: Manual Creation

1. In MySQL Workbench, open a new SQL tab
2. Copy and paste this:

```sql
CREATE DATABASE IF NOT EXISTS ds3_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ds3_database;
```

3. Click Execute ⚡
4. Then copy the rest from `schema.sql` and execute

## 🔧 Step 3: Configure Backend Connection

1. **Create .env file:**

```powershell
# In PowerShell
cd C:\Users\Admin\Desktop\CodePlay\DS-Cube-Checking
Copy-Item .env.example .env
notepad .env
```

2. **Edit .env file with YOUR MySQL credentials:**

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=ds3_database
DB_PORT=3306
```

**Important:** Replace `YOUR_MYSQL_PASSWORD_HERE` with the password you use in MySQL Workbench!

## 📦 Step 4: Install Node.js Dependencies

```powershell
# Make sure you're in the project directory
cd C:\Users\Admin\Desktop\CodePlay\DS-Cube-Checking

# Install all packages
npm install
```

This will install:
- express (web server)
- mysql2 (MySQL connector)
- cors (cross-origin requests)
- body-parser (parse JSON)
- dotenv (environment variables)

## 🚀 Step 5: Start the Backend Server

```powershell
# Start the server
npm start

# OR for development (auto-restart on changes)
npm run dev
```

**Expected Output:**
```
╔═══════════════════════════════════════╗
║   DS³ Backend Server Started! 🚀     ║
╠═══════════════════════════════════════╣
║   Port: 3000                          ║
║   Environment: development            ║
╚═══════════════════════════════════════╝
✅ MySQL Database connected successfully!
```

## ✅ Step 6: Verify Database in MySQL Workbench

1. In MySQL Workbench, refresh the **Schemas** panel
2. You should see **ds3_database**
3. Expand it to see tables:
   - ✅ users
   - ✅ skills
   - ✅ internships
   - ✅ hackathons
   - ✅ chat_rooms
   - ✅ chat_participants
   - ✅ messages

4. **Check default data:**
```sql
USE ds3_database;
SELECT * FROM users;
```

Should show 5 users: You, Alex, Priya, John, Jamie

## 🧪 Step 7: Test the API

Open your browser or PowerShell:

### Test in Browser:
```
http://localhost:3000/api/health
http://localhost:3000/api/users
http://localhost:3000/api/skills
```

### Test in PowerShell:
```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:3000/api/health"

# Get all users
Invoke-RestMethod -Uri "http://localhost:3000/api/users"

# Create a skill
$body = @{
    user_id = 1
    name = "React"
    note = "Learning hooks"
    progress = 50
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/skills" -Method Post -Body $body -ContentType "application/json"
```

## 🔍 Troubleshooting

### Problem 1: "Cannot connect to MySQL"
**Solution:**
```powershell
# Check if MySQL is running
Get-Service -Name MySQL*

# If stopped, start it
Start-Service -Name MySQL80  # or your MySQL service name
```

### Problem 2: "Access denied for user 'root'"
**Solution:**
- Check your password in `.env` file
- Make sure it matches your MySQL Workbench password
- Try connecting in MySQL Workbench first to verify

### Problem 3: "Database 'ds3_database' does not exist"
**Solution:**
- Run the schema.sql file in MySQL Workbench
- Or manually create: `CREATE DATABASE ds3_database;`

### Problem 4: "Module not found"
**Solution:**
```powershell
npm install
```

### Problem 5: Port 3000 already in use
**Solution:**
- Change PORT in .env to 3001
- Or close the app using port 3000

## 📊 View Data in MySQL Workbench

While your backend is running, you can view/edit data directly:

```sql
-- Use the database
USE ds3_database;

-- View all data
SELECT * FROM users;
SELECT * FROM skills;
SELECT * FROM internships;
SELECT * FROM hackathons;
SELECT * FROM messages;

-- Add test data
INSERT INTO skills (user_id, name, note, progress) 
VALUES (1, 'Node.js', 'Learning backend', 75);

-- Check the data
SELECT * FROM skills;
```

## 🎨 Next Steps

Once backend is running:

1. **Update Frontend** - Modify `script.js` to use API calls instead of localStorage
2. **Test CRUD Operations** - Create, read, update, delete through API
3. **Add Authentication** - Implement user login/signup
4. **Real-time Chat** - Add Socket.io for live messaging

## 📝 Quick Reference

**MySQL Workbench:** Visual database management
**mysql2 package:** Connects Node.js to MySQL
**Backend runs on:** http://localhost:3000
**API endpoints:** http://localhost:3000/api/*

---

**Need Help?** 
- Check console for error messages
- Verify MySQL is running in Services
- Test MySQL Workbench connection first
