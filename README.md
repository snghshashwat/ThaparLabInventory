# Smart Lab Inventory System

Secure full-stack lab inventory and transaction system with Google OAuth whitelist access, role-based authorization, barcode scanning, and live dashboards.

## Tech Stack

- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: Google OAuth 2.0 + JWT in httpOnly cookies
- Deployment: Vercel (frontend) + Render (backend)

## Folder Structure

```text
Thapar Lab Inventory/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── render.yaml
├── frontend/
│   ├── public/
│   │   └── college-campus.jpg
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
└── README.md
```

## Access Control

### Admin (full access)

- ssingh14_be23@thapar.edu

### Viewer (dashboard only)

- doaa@thapar.edu
- dosa@thapar.edu

Any non-whitelisted email is denied.

## Backend Environment Variables

Create backend/.env:

```bash
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-lab-inventory
JWT_SECRET=replace_with_long_random_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
FRONTEND_URL=http://localhost:5173
```

## Frontend Environment Variables

Create frontend/.env:

```bash
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

## Run Locally

### 1. Start backend

```bash
cd backend
npm install
npm run dev
```

### Optional: Seed mock data

```bash
cd backend
npm run seed:mock
```

This inserts 4 labs (Electronics, Robotics, Embedded Systems, IoT) with sample components and recent transactions.

### 2. Start frontend

```bash
cd frontend
npm install
npm run dev
```

## API Routes

### Auth

- POST /api/auth/google
- GET /api/auth/me
- POST /api/auth/logout

### Dashboard (admin + viewer)

- GET /api/dashboard?lab=Electronics

### Components (admin only)

- GET /api/components?lab=Electronics
- POST /api/components
- PUT /api/components/:id
- DELETE /api/components/:id

### Transactions (admin only)

- GET /api/transactions?lab=Electronics&limit=30
- POST /api/transactions

## Security Middleware Implemented

- Helmet with CSP
- Strict CORS (single frontend origin)
- express-rate-limit
- express-validator request validation
- xss-clean input sanitization
- express-mongo-sanitize
- JWT authentication in httpOnly cookies
- Centralized error handling with safe responses
- Action logging for auth, component changes, and transactions

## Deployment

### Backend on Render

1. Push this repository to GitHub.
2. Create a Render Web Service pointing to backend.
3. Build command: npm install
4. Start command: npm start
5. Set all backend environment variables.
6. Set FRONTEND_URL to your Vercel app URL.

### Frontend on Vercel

1. Import repository in Vercel and set root to frontend.
2. Build command: npm run build
3. Output directory: dist
4. Set VITE_API_URL to Render URL + /api
5. Set VITE_GOOGLE_CLIENT_ID to your Google OAuth client id.

## Important Production Notes

- Add authorized JavaScript origins and redirect URIs in Google Cloud Console for both localhost and deployed domains.
- Keep JWT_SECRET long and random.
- Use HTTPS in production (required for secure cookies with SameSite=None).
- For camera scanning support, use HTTPS on the frontend domain.
