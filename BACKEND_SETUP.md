# DS³ Backend Setup Guide

This guide will help you set up the MySQL backend for the DS³ application.

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** or **yarn** package manager

## 🚀 Installation Steps

### 1. Install MySQL

**Windows:**
```powershell
# Download MySQL installer from https://dev.mysql.com/downloads/installer/
# Run the installer and follow the setup wizard
# Remember your root password!
```

**Or use XAMPP/WAMP:**
- Download XAMPP: https://www.apachefriends.org/
- Install and start MySQL from XAMPP Control Panel

### 2. Install Node.js Dependencies

```powershell
# Navigate to project directory
cd C:\Users\Admin\Desktop\CodePlay\DS-Cube-Checking

# Install all dependencies
npm install
```

### 3. Configure Environment Variables

```powershell
# Copy the example environment file
Copy-Item .env.example .env

# Edit .env file with your MySQL credentials
notepad .env
```

Update `.env` with your MySQL settings:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=ds3_database
DB_PORT=3306
PORT=3000
```

### 4. Set Up Database

#### Option A: Using MySQL Command Line

```powershell
# Login to MySQL
mysql -u root -p

# Run the schema file
source C:/Users/Admin/Desktop/CodePlay/DS-Cube-Checking/config/schema.sql

# Or copy-paste the SQL commands from schema.sql
```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Go to File → Open SQL Script
4. Select `config/schema.sql`
5. Click Execute (⚡ icon)

#### Option C: Using phpMyAdmin (if using XAMPP)

1. Open http://localhost/phpmyadmin
2. Click "Import" tab
3. Choose file: `config/schema.sql`
4. Click "Go"

### 5. Verify Database Setup

```powershell
# Login to MySQL
mysql -u root -p

# Check database and tables
USE ds3_database;
SHOW TABLES;

# Should show:
# - users
# - skills
# - internships
# - hackathons
# - chat_rooms
# - chat_participants
# - messages
```

### 6. Start the Server

```powershell
# Production mode
npm start

# Development mode (auto-restart on changes)
npm run dev
```

You should see:
```
╔═══════════════════════════════════════╗
║   DS³ Backend Server Started! 🚀     ║
╠═══════════════════════════════════════╣
║   Port: 3000                          ║
║   Environment: development            ║
╚═══════════════════════════════════════╝
✅ MySQL Database connected successfully!
```

### 7. Test the API

Open your browser or use Postman:

**Health Check:**
```
http://localhost:3000/api/health
```

**Get All Skills:**
```
http://localhost:3000/api/skills
```

## 📡 API Endpoints

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/:id` - Get single skill
- `POST /api/skills` - Create new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Internships
- `GET /api/internships` - Get all internships
- `GET /api/internships/:id` - Get single internship
- `POST /api/internships` - Create new internship
- `PUT /api/internships/:id` - Update internship
- `DELETE /api/internships/:id` - Delete internship

### Hackathons
- `GET /api/hackathons` - Get all hackathons
- `GET /api/hackathons/:id` - Get single hackathon
- `POST /api/hackathons` - Create new hackathon
- `PUT /api/hackathons/:id` - Update hackathon
- `DELETE /api/hackathons/:id` - Delete hackathon

### Chat
- `GET /api/chats/rooms` - Get all chat rooms
- `GET /api/chats/rooms/:roomId/messages` - Get messages from room
- `POST /api/chats/rooms/:roomId/messages` - Send message
- `POST /api/chats/rooms` - Create chat room
- `POST /api/chats/rooms/one-to-one` - Create/get 1-to-1 chat

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/username/:username` - Get user by username
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🧪 Testing API with Postman/cURL

### Create a Skill (POST)
```powershell
curl -X POST http://localhost:3000/api/skills `
-H "Content-Type: application/json" `
-d '{\"user_id\": 1, \"name\": \"React\", \"note\": \"Learning hooks\", \"progress\": 50}'
```

### Get All Skills (GET)
```powershell
curl http://localhost:3000/api/skills
```

### Create Internship (POST)
```powershell
curl -X POST http://localhost:3000/api/internships `
-H "Content-Type: application/json" `
-d '{\"user_id\": 1, \"role\": \"Frontend Developer\", \"company\": \"Google\", \"duration\": \"Jun-Aug 2025\", \"note\": \"Great experience\"}'
```

## 🔧 Troubleshooting

### Error: Cannot connect to MySQL
```
Solution:
1. Check if MySQL service is running
2. Verify credentials in .env file
3. Check MySQL port (default: 3306)
4. Ensure firewall allows MySQL connection
```

### Error: Database not found
```
Solution:
1. Run the schema.sql file
2. Verify database name in .env matches schema
3. Check MySQL user has permissions
```

### Error: Port 3000 already in use
```
Solution:
1. Change PORT in .env file to another port (e.g., 3001)
2. Or stop the process using port 3000
```

### Error: Module not found
```
Solution:
npm install
```

## 📁 Project Structure

```
DS-Cube-Checking/
├── config/
│   ├── database.js       # MySQL connection pool
│   └── schema.sql        # Database schema
├── routes/
│   ├── skills.js         # Skills API routes
│   ├── internships.js    # Internships API routes
│   ├── hackathons.js     # Hackathons API routes
│   ├── chats.js          # Chat API routes
│   └── users.js          # Users API routes
├── server.js             # Main Express server
├── package.json          # Dependencies
├── .env                  # Environment variables (create this)
└── .env.example          # Environment template
```

## 🔐 Security Notes

- Never commit `.env` file to git
- Change default passwords in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Implement proper authentication (JWT) for production use

## 🚀 Next Steps

1. **Update Frontend:** Modify `script.js` to use API instead of localStorage
2. **Add Authentication:** Implement JWT-based user authentication
3. **Real-time Chat:** Add Socket.io for live messaging
4. **Deploy:** Host on services like Heroku, AWS, or DigitalOcean

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MySQL2 Package](https://www.npmjs.com/package/mysql2)
- [REST API Best Practices](https://restfulapi.net/)

---

**Need Help?** Check the console logs for detailed error messages!
