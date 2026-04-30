# Flowspace — Editorial Team Task Manager

Assessment submission for Ethara AI. 

Flowspace is a premium, handcrafted task management application designed for modern teams. Built with a focus on deep work, it uses an editorial, distraction-free aesthetic with harsh borders, no rounded pills, and dynamic glassmorphism elements.

Live URL: [Railway URL here]
GitHub: https://github.com/nishantprogrammer/FlowSpace.git

## 🛠️ Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express.js + MongoDB (Mongoose)
- **Auth:** JWT + bcrypt
- **Deploy:** Railway / Vercel

## 🏛️ Architecture
**Model → Controller → Route (MCR pattern)**
- **Separation of Concerns:** Keeps data shape, business logic, and HTTP routing in separate files. 
- **Scalability:** Controllers stay testable. Routes stay declarative. Models stay clean.
- **Middleware:** Robust JWT verification (`protect`), Role-Based Access Control (`adminGuard`), and a global error handler.

## ✨ Core Features
- **Secure Authentication:** Signup/Login with robust JWT handling, role-based access control (Admin/Member), and a slick "Show Password" eye toggle.
- **Project & Team Management:** Admins can create projects, instantly search/add new team members via a dynamic suggestion UI, and securely remove inactive members.
- **Dual View Task Management:** 
  - **Kanban Board:** A fluid visual representation of task states.
  - **Structured List:** A sleek data table view for bulk management.
- **Smart Reassignment Flow:** If a user is removed from a project, their previously assigned tasks instantly flag themselves in red with a **"Needs Reassignment"** UI indicator. Admins can click this to instantly pop open a reassignment workflow.
- **Dynamic Dashboard:** Real-time statistics tracking total tasks, in-progress tasks, tasks due today, and dynamically detected overdue tasks.
- **Premium UI:** Handcrafted CSS, dark mode optimized styling, smooth hover states, and minimal borders.

## 🚀 Run Locally

### 1. Backend Setup
```bash
cd Backend
npm install
# Create a .env file and add MONGODB_URI + JWT_SECRET + CLIENT_URL (e.g., http://localhost:5173)
npm run dev # Runs on port 5000
```

### 2. Frontend Setup
```bash
cd Frontend
npm install
# Create a .env file and set VITE_API_URL=http://localhost:5000
npm run dev # Runs on port 5173
```

## 🔒 Deployment Configured
This repository is pre-configured for instant deployment. 
- **CORS:** The backend dynamically accepts incoming origins (perfect for Vercel/Netlify previews and Railway deployments) while strictly enforcing credentials.
- **Protected Routes:** All database operations are secured via Express middlewares, preventing unauthorized API calls.

## 🧪 Demo Access
Visit the live URL and click "Use demo account"
- **Admin:** admin@flowspace.dev / Demo1234!
- **Member:** member@flowspace.dev / Demo1234!
