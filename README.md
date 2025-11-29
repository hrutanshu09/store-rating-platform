# 🏪 Store Rating Platform

*A modern full-stack web application with role-based dashboards, secure authentication, and dynamic rating & review features.*

![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.x-blue.svg)
![JWT](https://img.shields.io/badge/Auth-JWT-orange.svg)

---

## 🚀 Overview

The **Store Rating Platform** enables users to discover stores, rate them, and write reviews.
Store owners get insights, and admins manage users, stores, and ratings.
This project features **secure JWT authentication**, **role-based access**, and a **modern React UI**.

---

## 🧩 Features

### 🔐 Authentication & Security

* JWT-based authentication
* Bcrypt password hashing
* Client + server validation
* **Form rules:**

  * Name: 20–60 characters
  * Password: 8–16 chars, 1 uppercase, 1 special character
  * Address: max 400 chars
  * Email: must be valid

---

### 👤 User Features

* Browse and search stores
* Rate stores (1–5 stars)
* Write/update reviews
* View reviews in modal
* Clean and responsive UI

---

### 🏪 Store Owner Features

* View dashboard
* See customer feedback
* Store rating insights
* Recent raters list

---

### 🛠️ Admin Features

* Admin dashboard
* Manage users (CRUD)
* Manage stores (CRUD)
* Sorting + filtering
* Pagination
* Review viewer modal
* Owner assignment

---

## 🏗️ System Architecture

```
┌───────────────┐    ┌────────────────┐    ┌────────────────┐
│ React Frontend │───▶│ Express API    │───▶│ MySQL Database │
│ (Axios, Hooks) │    │ (JWT, bcrypt)  │    │ (SQL schema)   │
└───────────────┘    └────────────────┘    └────────────────┘
```
---
### Prerequisites
```bash
Node.js >= 18.0.0
npm >= 8.0.0
```

---

## ⚙️ Tech Stack

### Frontend

* React 18
* React Router
* Axios
* Responsive CSS
* Protected routes

### Backend

* Node.js + Express
* JWT Authentication
* MySQL
* Bcrypt
* REST API

---

---

## 📦 Installation

### 1️⃣ Clone
```bash
git clone <repository-url>
cd store-rating-system
````

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=store_rating_db
JWT_SECRET=your_secret_key
```

Start backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

---

## 💽 Database Setup

You already have a `.sql` file included.

### **Import using MySQL Workbench**

```
Server → Data Import → Import From Self-Contained File
```

### OR via Terminal:

```bash
mysql -u root -p store_rating_db < store_rating_platform.sql
```

This imports:

* Pre-made Admin
* Pre-made Owner
* Pre-made User
* Sample stores
* Sample ratings

---

## 🔑 Login Credentials

### 👑 Admin

```
Email: admin@example.com
Password: Admin@123
```

### 🏪 Store Owner

```
Email: ocean@gmail.com
Password: Owner@123
```

### 👤 User

```
Email: test@gmail.com
Password: User@123
```

---

## 🔧 API Overview

### Auth APIs

```
POST /auth/signup
POST /auth/login
```

### User APIs

```
GET /stores
POST /ratings
PUT /ratings/:storeId
GET /ratings/:storeId
```

### Owner APIs

```
GET /stores/owner/dashboard
GET /ratings/:storeId
```

### Admin APIs

```
GET /admin/users
POST /admin/users
GET /admin/stores
POST /admin/stores
```

---

## 🗄️ Database Structure (MySQL)

### Users Table

```
id | name | email | password | address | role | created_at
```

### Stores Table

```
id | name | email | address | owner_id | created_at
```

### Ratings Table

```
id | user_id | store_id | rating | review | created_at
```

---

## 🎨 UI/UX Highlights

* Clean modern layout
* Centered authentication cards
* Glass-style UI elements
* Animated navigation bar
* Review modal centered
* Proper spacing and alignment
* Mobile-responsive

---

## 🛡️ Security Highlights

* Hashed passwords
* Validated inputs
* SQL injection safe queries
* JWT-secured private routes
* Admin-only protected endpoints

---

## 🧪 Quality & Best Practices

* Separation of concerns
* Modular folder structure
* Reusable components
* Consistent API design
* Clean error messages

---

## 📦 Production Considerations

* Environment variables
* Separate dev/prod DB
* CORS configuration
* Token expiration handling
* Optimized SQL queries
* Secure password rules

---

## 📜 Conclusion

This project offers a **complete rating ecosystem** with proper roles, dashboards, authentication, and security.
It is simple enough for learning but structured enough for real deployment.

---

```
```
