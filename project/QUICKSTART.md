# FLYXO - Quick Start Guide

This guide will help you get FLYXO up and running in minutes.

## Prerequisites

- Node.js (v14+)
- MySQL (v5.7+)

## Quick Setup

### 1. Create Database

```sql
CREATE DATABASE flyxo_db;
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=flyxo_db
JWT_SECRET=mysecretkey123
NODE_ENV=development
```

Start backend:
```bash
npm start
```

### 3. Seed Sample Data (Optional)

In a new terminal:
```bash
cd backend
npm run seed
```

This creates:
- Admin account: admin@flyxo.com / admin123
- Test user: user@test.com / user123
- 6 sample movies

### 4. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 5. Access Application

- Frontend: http://localhost:5173
- Backend GraphQL: http://localhost:5000/graphql

## First Steps

1. Login as admin (admin@flyxo.com / admin123)
2. Go to Admin Panel
3. Create shows for the sample movies
4. Logout and test booking as regular user

## Default Accounts

After running seed:

**Admin**
- Email: admin@flyxo.com
- Password: admin123

**Regular User**
- Email: user@test.com
- Password: user123

## Common Issues

**Database connection failed**
- Verify MySQL is running
- Check credentials in .env

**Port already in use**
- Change PORT in backend .env
- Update VITE_API_URL in frontend .env

**Real-time not working**
- Ensure both backend and frontend are running
- Check browser console for errors

## Next Steps

See [README.md](README.md) for complete documentation.
