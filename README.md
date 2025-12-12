# NEU Bistro - Food Ordering Application

A Software as a Service (SaaS) food ordering application built with **React**, **Node.js**, **Express**, and **Prisma (PostgreSQL)**.  
This project allows users to browse a menu, register/login, add items to a cart, and place orders. Authentication is implemented using token cookies.

---

## 🚀 Live Demo

- **Frontend (Client):** [https://final-project-chendong-1wnlpxktt-chendong-yus-projects.vercel.app]
- **Backend (API):** https://final-project-chendong.onrender.com  
- **Database:** Hosted on Render (PostgreSQL)

---

## 📁 Project Structure
```
root/
├── client/ # React frontend (Vite + Tailwind CSS)
├── api/ # Node.js backend (Express + Prisma)
└── accessibility_reports/ # Lighthouse accessibility audit reports
```
---

## 🛠️ Setup & Installation (Local Development)
- **Prerequisites**

```
Node.js (v18+)

NPM
```

### 1. Backend Setup (API)

- **Navigate to the api folder**:
```
cd api
```

- **Install dependencies**:
```
npm install
```

- **Setup Database (SQLite for local)**:

- **Create a .env file in the api folder with the following content**:

- **Run migrations and seed data**:
```
npx prisma migrate reset --force
```

- **Start the server**:
```
node index.js
```

- Server runs on **http://localhost:3000**

### 2. Frontend Setup (Client)

- **Navigate to the client folder**:
```
cd client
```

- **Install dependencies**:
```
npm install
```

- **Start the development server**:
```
npm run dev
```

- **App runs on **http://localhost:5173**

## ✅ Testing

- **To run the client-side unit tests (using Vitest and React Testing Library)**:
```
cd client
npm test
```

## ♿ Accessibility

**Accessibility reports** (Lighthouse scores) can be found in the **accessibility_reports** folder.

- **Target**: Score of 80+ on key pages (**Home**, **Menu**, **Login**).

## 📝 Features

- **Authentication**: User registration and login with secure HTTP-only cookies.

- **Menu**: Browse items with categories and images (External API integration for recommendations).

- **Cart**: Add/remove items and calculate totals.

- **Orders**: View order history and status.

- **Admin**: Add new custom menu items and soft-delete items (Admin access **admin@neu.edu** only).

## 🛡️ Security

- **Password Hashing**: Passwords are hashed using bcryptjs before storage.

- **Secure Authentication**: Authentication state is managed via secure, HTTP-only cookies (SameSite=None, Secure=true in production).

- **Access Control**: Protected API routes verify JWT tokens; admin-only actions are restricted.

- **CORS**: Cross-Origin Resource Sharing is strictly configured to allow requests only from the deployed frontend.

---
## 📜 License

This project was created as a final project for **Northeastern University**.

---
