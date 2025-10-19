# DS³ - Discover · Skill · Share · Support

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Overview

**DS³** (DS Cubed) is a modern, interactive web application designed to help friends and communities collaborate on skill development, share internship experiences, discover hackathons, and communicate in real-time. Built with a stunning **neon blue/purple gradient theme** and futuristic design, DS³ provides a comprehensive platform for personal and professional growth tracking.

## ✨ Key Features

### 🧠 **Skills Tracker**
- Add and track personal skills with progress monitoring
- Visual progress indicators (0-100% range slider)
- Add notes and descriptions for each skill
- View detailed skill information
- Delete skills when needed
- Real-time updates with smooth animations

### 💼 **Internships Hub**
- Share internship experiences with the community
- Post details including:
  - Role/Position title
  - Company name
  - Duration of internship
  - Learning notes and tips for others
- Browse all shared internships
- Interactive view and delete functionality

### 🚀 **Hackathons Board**
- Discover and post hackathon opportunities
- Comprehensive hackathon details:
  - Event name
  - Organizer/Company
  - Dates
  - Registration links
  - Theme/Description
- Community-driven hackathon sharing
- Easy access to registration links

### 💬 **Chat System**
- **Group Chat**: Engage in community-wide discussions
- **1-to-1 Chats**: Private conversations with specific friends
- Features:
  - Create new chat contacts dynamically
  - Send and receive messages
  - Timestamp tracking with "time ago" display
  - User identification (customizable sender names)
  - Tab-based interface for easy navigation

## 🎨 Design Highlights

### Visual Theme
- **Neon Cyberpunk Aesthetic**: Electric blue (#18b0ff) and neon purple (#9b4cff)
- **Glassmorphism Effects**: Translucent cards with subtle backdrop blur
- **Gradient Backgrounds**: Multi-layered radial and linear gradients
- **Smooth Animations**: Fade-in effects, hover transformations, and flash notifications
- **Custom Font**: "Orbitron" - Modern, futuristic typography

### UI/UX Features
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Interactive Cards**: Hover effects with elevation and glow
- **Glass Morphism**: Semi-transparent elements with inner shadows
- **Phone Mockup View**: Desktop presentation with phone-like interface (820px height)
- **Progress Rings**: Circular gradient progress indicators for skills
- **Tab Navigation**: Smooth switching between chat modes

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup with modern structure
- **CSS3**: Advanced styling with custom properties, gradients, and animations
- **Vanilla JavaScript**: Pure JS - no frameworks required
- **LocalStorage API**: Client-side data persistence

### Architecture
- **Single Page Application (SPA)** style with multiple HTML pages
- **Data-driven**: All content managed through localStorage
- **Event-driven**: Dynamic rendering based on user actions
- **Modular JavaScript**: Separate initialization functions for each page

## 📁 Project Structure

```
DS-Cube-Checking/
├── index.html          # Landing page with navigation cards
├── skills.html         # Skills tracking interface
├── internships.html    # Internship sharing platform
├── hackathons.html     # Hackathon discovery board
├── chat.html           # Group & 1-to-1 chat system
├── style.css           # Complete styling with neon theme
├── script.js           # All functionality and localStorage management
└── README.md           # This file
```

## 🚀 Getting Started

### Installation

1. **Clone or download** this repository
2. **No build process required** - pure HTML/CSS/JS
3. **No dependencies** - runs directly in the browser

### Running the Application

Simply open `index.html` in any modern web browser:

```bash
# Option 1: Direct file opening
# Navigate to the folder and double-click index.html

# Option 2: Using a local server (recommended)
# Python 3
python -m http.server 8000

# Then visit: http://localhost:8000
```

### Browser Compatibility

- ✅ Chrome/Edge (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Opera (v76+)

## 💾 Data Storage

### LocalStorage Keys
The application uses the following localStorage keys:

| Key | Description | Structure |
|-----|-------------|-----------|
| `ds3_skills` | User skills with progress | Array of objects |
| `ds3_internships` | Shared internship experiences | Array of objects |
| `ds3_hackathons` | Posted hackathon events | Array of objects |
| `ds3_chats` | Group & 1-to-1 messages | Object with arrays |

### Data Structure Examples

**Skills:**
```json
{
  "id": 1729350000000,
  "name": "React",
  "note": "Learning hooks and components",
  "progress": 65,
  "created": "2025-10-19T12:00:00.000Z"
}
```

**Chat:**
```json
{
  "group": [
    {"sender": "You", "msg": "Hello!", "time": "2025-10-19T12:00:00.000Z"}
  ],
  "oneToOne": {
    "Alice": [
      {"from": "You", "to": "Alice", "msg": "Hi!", "time": "2025-10-19T12:00:00.000Z"}
    ]
  },
  "users": ["Alex", "Priya", "John", "Jamie"]
}
```

## 🎯 Use Cases

- **Students**: Track academic skills and find internships
- **Developers**: Share hackathon opportunities and collaborate
- **Learning Communities**: Monitor group progress and communicate
- **Friend Groups**: Stay connected and share opportunities
- **Professional Networks**: Exchange experiences and resources

## 🌟 Features in Detail

### Skills Page
- **Add Skills**: Quick form with name, notes, and progress slider
- **Track Progress**: 0-100% visual slider with real-time value display
- **Manage Skills**: View details, update, or delete entries
- **Visual Feedback**: Flash animations on additions

### Internships Page
- **Share Experiences**: Post role, company, duration, and learnings
- **Browse Posts**: See all shared internships in reverse chronological order
- **Detailed Views**: Modal alerts showing full internship details
- **Community Learning**: Learn from others' experiences

### Hackathons Page
- **Post Events**: Share hackathon name, organizer, dates, links, and descriptions
- **Registration Links**: Direct access to hackathon registration
- **Event Discovery**: Browse all upcoming and ongoing events
- **Rich Details**: Full theme and description support

### Chat Page
- **Dual Mode**: Switch between group and 1-to-1 chats
- **Dynamic Contacts**: Create new 1-to-1 conversations on the fly
- **Message History**: Persistent chat logs with timestamps
- **User Selection**: Dropdown to choose chat partners
- **Real-time Feel**: Immediate message display with smooth scrolling

## 🎨 Customization

### Changing Theme Colors
Edit `:root` variables in `style.css`:

```css
:root {
  --neon-blue: #18b0ff;     /* Primary accent */
  --neon-purple: #9b4cff;   /* Secondary accent */
  --bg-a: #05060c;          /* Dark background */
  --bg-b: #071426;          /* Navy background */
}
```

### Adding New Features
The modular structure makes it easy to extend:

1. Add new HTML page
2. Create initialization function in `script.js`
3. Add localStorage key and data structure
4. Link from `index.html` with a new card

## 🔒 Privacy & Security

- **100% Client-Side**: All data stored locally in browser
- **No Server Required**: No data transmission to external servers
- **User Control**: Complete ownership of data
- **Clear Data**: Clear browser localStorage to reset

## 👨‍💻 Developer Info

**Designed by**: Deeksha Raj  
**Repository**: DS-Cube-Checking  
**Version**: 1.0.0  
**Date**: October 2025

## 📝 License

© 2025 DS³ - All Rights Reserved

## 🤝 Contributing

This is a learning/demo project. Feel free to:
- Fork and modify
- Use as a template for your own projects
- Learn from the code structure
- Suggest improvements

## 🐛 Known Limitations

- Data is browser-specific (not synced across devices)
- No user authentication system
- LocalStorage has 5-10MB limit
- No real-time synchronization between users
- Chat system is local simulation (not real messaging)

## 🎓 Learning Outcomes

This project demonstrates:
- Pure JavaScript DOM manipulation
- LocalStorage CRUD operations
- Responsive CSS with modern features
- Event-driven programming
- Modular code organization
- User interface design principles
- Data persistence without a backend

## 📞 Support

For questions or issues:
1. Check the code comments in `script.js`
2. Review localStorage in browser DevTools
3. Inspect console for any errors
4. Refer to this README for architecture details

---

**Happy Learning & Collaborating with DS³!** 🚀✨
