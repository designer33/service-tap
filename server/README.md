# Service Knock — Backend

## Setup

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Create your `.env` file:
   ```bash
   cp .env.example .env
   ```
   Then fill in your **MongoDB Atlas URI** and **JWT_SECRET**.

3. Seed the admin user:
   ```bash
   npm run seed
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```
   Server runs on: http://localhost:5000

## API Health Check
```
GET http://localhost:5000/api/health
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong secret for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry (default: 7d) |
| `CLIENT_URL` | Frontend URL for CORS (default: http://localhost:5173) |
