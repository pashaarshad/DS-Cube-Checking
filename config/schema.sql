-- DS³ Database Schema
-- MySQL Database Structure

-- Create database
CREATE DATABASE IF NOT EXISTS ds3_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ds3_database;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) UNIQUE,
  display_name VARCHAR(100),
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  note TEXT,
  progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Internships table
CREATE TABLE IF NOT EXISTS internships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  role VARCHAR(150) NOT NULL,
  company VARCHAR(150) NOT NULL,
  duration VARCHAR(100),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_company (company),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hackathons table
CREATE TABLE IF NOT EXISTS hackathons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  organizer VARCHAR(150),
  dates VARCHAR(100),
  link VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_name (name),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chat rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  type ENUM('group', 'one_to_one') DEFAULT 'group',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chat participants table (for tracking who's in which chat)
CREATE TABLE IF NOT EXISTS chat_participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_room_user (room_id, user_id),
  INDEX idx_room_id (room_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  sender_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_room_id (room_id),
  INDEX idx_sender_id (sender_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default users
INSERT INTO users (username, display_name) VALUES
  ('You', 'You'),
  ('Alex', 'Alex'),
  ('Priya', 'Priya'),
  ('John', 'John'),
  ('Jamie', 'Jamie')
ON DUPLICATE KEY UPDATE username=username;

-- Create default group chat room
INSERT INTO chat_rooms (name, type) VALUES
  ('General Group Chat', 'group')
ON DUPLICATE KEY UPDATE name=name;

-- Add all users to group chat
INSERT INTO chat_participants (room_id, user_id)
SELECT 1, id FROM users
ON DUPLICATE KEY UPDATE room_id=room_id;

-- Sample data for testing (optional)
-- Uncomment below to add sample data

/*
-- Sample skills
INSERT INTO skills (user_id, name, note, progress) VALUES
  (1, 'React', 'Learning hooks and components', 65),
  (1, 'Node.js', 'Building REST APIs', 80),
  (2, 'Python', 'Data science and ML', 75);

-- Sample internships
INSERT INTO internships (user_id, role, company, duration, note) VALUES
  (1, 'Frontend Developer Intern', 'Google', 'Jun - Aug 2025', 'Great learning experience'),
  (2, 'Data Science Intern', 'Microsoft', 'Jul - Sep 2025', 'Worked on ML models');

-- Sample hackathons
INSERT INTO hackathons (user_id, name, organizer, dates, link, description) VALUES
  (1, 'HackTheNorth 2025', 'Waterloo University', 'Sep 15-17', 'https://hackthenorth.com', 'Canada largest hackathon'),
  (3, 'MLH Localhost', 'Major League Hacking', 'Oct 1-3', 'https://mlh.io', 'Beginner-friendly workshop series');
*/

-- Show tables
SHOW TABLES;

-- Show table structures
DESCRIBE users;
DESCRIBE skills;
DESCRIBE internships;
DESCRIBE hackathons;
DESCRIBE chat_rooms;
DESCRIBE chat_participants;
DESCRIBE messages;
