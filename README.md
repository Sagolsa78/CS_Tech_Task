# 🚀 Admin Dashboard Project

A modern **Admin Dashboard** built with **React**, **TailwindCSS**, and **Axios**, featuring authentication, agent management, CSV upload & distribution, and assignments tracking. The project is designed with a clean UI, role-based navigation, and API integration.

---

## 📌 Features

- 🔐 **Authentication System**
  - User **signup** and **signin** with secure API calls
  - Redirects unauthorized users to the signin page
  - Session management using JWT tokens  

- 👥 **Agent Management**
  - Add new agents with **name, email, mobile number, and password**
  - Fetch and display agents from backend API
  - Refresh and manage existing agents

- 📤 **Upload & Distribute**
  - Upload CSV files containing data (e.g., FirstName, LastName, etc.)
  - Distribute lists among available agents automatically

- 📋 **Assignments View**
  - View distributed assignments
  - Track agent-related tasks

- 🎨 **Modern Dashboard UI**
  - Sidebar-based navigation with icons (Agents, Upload, Assignments)
  - Responsive layout (desktop + mobile support)
  - Clean TailwindCSS styling with hover effects, transitions, and alerts

---

## 🛠️ Tech Stack

- **Frontend**: React (with React Router DOM, Hooks)  
- **Styling**: TailwindCSS  
- **Icons**: [Lucide React](https://lucide.dev/)  
- **HTTP Client**: Axios  
- **Backend**: Node.js / Express.js (API assumed at `http://localhost:5000`)  
- **Database**: MongoDB (via backend)  

---

## 📂 Project Structure

project-root/
│── src/
│ ├── components/
│ │ ├── AgentManager.tsx # Manage agents UI + CRUD
│ │ ├── UploadAndDistribute.tsx # CSV Upload & Distribution
│ │ ├── AssignmentView.tsx # Assignments view
│ │ ├── LoginForm.tsx # Signin form
│ │ ├── Signup.tsx # Signup form
│ │
│ ├── lib/
│ │ ├── Auth-comtext.tsx # Auth provider (login, register, logout)
│ │ ├── Local-db.tsx # Local storage helpers
│ │
│ ├── pages/
│ │ ├── DashboardShell.tsx # Main dashboard container
│ │ ├── Signin.tsx # Signin page
│ │ ├── Signup.tsx # Signup page
│
│── package.json
│── tailwind.config.js
│── README.md



---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/admin-dashboard.git
cd admin-dashboard


npm install



npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
 


 @tailwind base;
@tailwind components;
@tailwind utilities;


npm run dev




The app will run on:
👉 http://localhost:5173 (if using Vite)
👉 or http://localhost:3000 (if using CRA)

5. Backend Setup (Required)

The app expects a backend running at:

http://localhost:5000/api/v1




Endpoints used:

POST /auth/register → Register new users

POST /auth/login → Login existing users

GET /agents → Fetch agents list

POST /agents → Add new agent

POST /upload → Upload CSV and distribute

🔑 Environment Variables

Create a .env file in the root:

VITE_API_URL=http://localhost:5000/api/v1