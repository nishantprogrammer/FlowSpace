FLOWSPACE — EDITORIAL TEAM TASK MANAGER
Assessment submission for Ethara AI.

Flowspace is a premium, handcrafted task management application designed for modern teams. Built with a focus on deep work, it uses an editorial, distraction-free aesthetic with harsh borders, no rounded pills, and dynamic glassmorphism elements.

Live URL: [Insert deployed URL]
GitHub: https://github.com/nishantprogrammer/FlowSpace.git
Demo Video: [Insert video link]

========================================
STACK
========================================
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express.js + MongoDB (Mongoose)
- Auth: JWT + bcrypt
- Deploy: Railway / Vercel

========================================
ARCHITECTURE
========================================
Model -> Controller -> Route (MCR pattern)
- Separation of Concerns: Keeps data shape, business logic, and HTTP routing in separate files.
- Scalability: Controllers stay testable. Routes stay declarative. Models stay clean.
- Middleware: Robust JWT verification (protect), Role-Based Access Control (adminGuard), and a global error handler.

========================================
CORE FEATURES
========================================
- Secure Authentication: Signup/Login with robust JWT handling, role-based access control (Admin/Member), and a "Show Password" eye toggle.
- Project & Team Management: Admins can create projects, instantly search/add new team members via a dynamic suggestion UI, and securely remove inactive members.
- Dual View Task Management:
  * Kanban Board: A fluid visual representation of task states.
  * Structured List: A sleek data table view for bulk management.
- Smart Reassignment Flow: If a user is removed from a project, their previously assigned tasks instantly flag themselves in red with a "Needs Reassignment" UI indicator. Admins can click this to instantly trigger a reassignment workflow.
- Dynamic Dashboard: Real-time statistics tracking total tasks, in-progress tasks, tasks due today, and dynamically detected overdue tasks.
- Premium UI: Handcrafted CSS, dark mode optimized styling, smooth hover states, and minimal borders.

========================================
RUN LOCALLY
========================================

1. Backend Setup:
cd Backend
npm install
npm run dev (Runs on port 5000)
* Ensure you create a .env file with MONGODB_URI, JWT_SECRET, and CLIENT_URL.

2. Frontend Setup:
cd Frontend
npm install
npm run dev (Runs on port 5173)
* Ensure you create a .env file with VITE_API_URL=http://localhost:5000.

========================================
DEMO ACCESS
========================================
Admin Account: admin@flowspace.dev / Demo1234!
Member Account: member@flowspace.dev / Demo1234!
