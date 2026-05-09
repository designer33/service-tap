# Service Knock 🏷️

A hyper-local service booking platform connecting customers with trusted home service professionals.

---

## Project Structure

```
service-tap/
├── server/     # Node.js + Express backend (API)
└── client/     # React + Vite frontend
```

---

## Quick Start

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Fill in your MONGODB_URI and JWT_SECRET in .env
npm run seed      # Creates initial admin user
npm run dev       # Starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev       # Starts on http://localhost:5173
```

---

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS    |
| Backend    | Node.js + Express.js              |
| Database   | MongoDB Atlas (Cloud)             |
| Auth       | JWT + bcrypt                      |

---

## Key Features

- ✅ JWT authentication with role-based access (Customer / Worker / Admin)
- ✅ Full booking lifecycle (pending → assigned → accepted → completed)
- ✅ Admin dashboard — assign workers, set prices, manage bookings
- ✅ Worker dashboard — accept/reject jobs, toggle availability
- ✅ Customer dashboard — book services, track status, leave reviews
- ✅ Mobile-first responsive design
- ✅ MongoDB Atlas cloud database

---

## API Base URL

```
http://localhost:5000/api
```

Health check: `GET /api/health`
