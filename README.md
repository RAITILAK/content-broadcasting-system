# Content Broadcasting System

A backend system that allows teachers to upload subject-based content, principals to approve it, and students to access live content via public API with automatic rotation.

## 🚀 Live API
**Base URL:** `https://content-broadcasting-system-production-322d.up.railway.app`

## 📖 API Documentation
Interactive Swagger docs:  
👉 `https://content-broadcasting-system-production-322d.up.railway.app/api-docs`


## Tech Stack

- Node.js + Express
- MySQL + Sequelize ORM
- JWT Authentication
- bcrypt password hashing
- Multer (file uploads)
- Swagger UI (API docs)

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd content-broadcasting-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=content_broadcasting
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
MAX_FILE_SIZE=10485760
```

### 4. Create MySQL database
```sql
CREATE DATABASE content_broadcasting;
```

### 5. Start the server
```bash
npm run dev
```
Tables are auto-created via Sequelize sync on startup.

## API Documentation

Swagger UI: `http://localhost:3000/api-docs`

## Default Test Users

Register users via `POST /api/auth/register` with role `principal` or `teacher`.

## API Overview

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login, get JWT |
| POST | /api/content/upload | Teacher | Upload content |
| GET | /api/content/my | Teacher | View own content |
| GET | /api/content/:id | Teacher/Principal | Get content by ID |
| GET | /api/approval/pending | Principal | View pending content |
| GET | /api/approval/all | Principal | View all content |
| PATCH | /api/approval/:id/approve | Principal | Approve content |
| PATCH | /api/approval/:id/reject | Principal | Reject with reason |
| GET | /content/live/:teacherId | Public | Get live content |
| GET | /content/live/:teacherId?subject=maths | Public | Filter by subject |

## Content Lifecycle

uploaded → pending → approved → live (if within time window)
→ rejected (with reason)

## Scheduling Logic

- Each subject has independent rotation
- Content rotates based on `rotation_duration` (minutes)
- System uses current timestamp % total cycle duration to determine active content
- Content only shows if within `start_time` and `end_time` window
- Loops continuously

## Edge Cases Handled

- No approved content → returns "No content available"
- Approved but outside time window → returns "No content available"  
- Invalid teacher ID → returns 400
- Invalid subject → returns "No content available"
- Rejected content never exposed on public API

## Assumptions

- Teachers set their own scheduling window (start_time / end_time)
- Without start_time and end_time, content is never shown publicly
- Each teacher has independent content slots per subject
- File storage is local (`/uploads` folder)
