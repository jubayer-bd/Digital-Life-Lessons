# Digital Life Lessons

## Project Overview

Digital Life Lessons is a full-stack EdTech (LMS-style) web application built using the MERN stack. The platform allows users to explore life-improvement lessons, save favorites, and access premium content. Instructors can add and manage lessons, while admins control overall platform moderation.

The application is fully responsive, role-based, and implemented as a Single Page Application (SPA).

---

## Live Links

- Client: https://digital-life-lessons-web.netlify.app/
- Server: https://life-lessons-server-side.vercel.app/

---

## Features

### General Features

- Single Page Application (SPA) using React Router
- Fully responsive UI for mobile, tablet, and desktop
- Dynamic page titles
- Loading spinner for API calls
- Toast notifications for all success and error messages

### Authentication

- Email & Password login and registration
- Google social authentication
- Persistent login on page reload
- Password validation during registration

### Lessons

- Browse all lessons
- Filter lessons by category
- View lesson details
- Favorite and unfavorite lessons
- Premium-only lesson restriction

### Premium System

- Premium status checking
- Premium badge for premium users
- Conditional access based on subscription

### User Dashboard

- View profile information
- View favorite lessons
- Manage personal data

### Instructor Dashboard

- Add new lessons
- Update lessons
- Delete lessons
- View own created lessons

### Admin Dashboard

- Manage all users
- Control user roles (admin, instructor, user)
- Moderate lesson content

---

## Technology Stack

### Frontend

- React
- React Router DOM
- Tailwind CSS
- TanStack React Query
- Axios
- Framer Motion
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Firebase Admin SDK

---

## NPM Packages Used

- react-router-dom
- @tanstack/react-query
- axios
- firebase
- react-hot-toast
- framer-motion
- lucide-react

---

## 📂 Project Structure

```txt
digital-life-lessons/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── Firebase/
│   ├── layouts/
│   ├── pages/
│   ├── route/
│   └── main.jsx
└── README.md
