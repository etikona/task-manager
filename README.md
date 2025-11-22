# 🚀 Smart Task Manager

**Live Demo:**  
🔗 https://task-manager-dcew.vercel.app/

A modern, intelligent, and fully interactive **task, team, and project management system** built using **Next.js, TypeScript, Redux Toolkit, TailwindCSS, and Framer Motion**.  
This application helps users manage teams, assign tasks, distribute workloads, and use **smart auto-balancing algorithms** to improve productivity.

---

## 🌟 Features

### 🔐 Authentication

- User Registration
- User Login
- Protected routes

---

### 👥 Team Management

- Create teams
- Add members (name, role, capacity)
- See workload & capacity indicators
- Overload warnings
- Update/delete team members

---

### 📁 Project Management

- Create projects
- Assign project to a team
- Update or delete projects
- View project list per team

---

### ✅ Task Management

- Create tasks with:
  - Title
  - Description
  - Priority
  - Status
  - Assigned Member
- Edit tasks
- Delete tasks
- Filter by project, member, or status

---

### 🤖 Intelligent Task Assignment

#### **Auto-Assign**

Automatically selects the member with the **lowest current load**.

#### **Smart Reassignment (Automation)**

Automatically:

- Detects overloaded team members
- Reassigns tasks to others
- Keeps high-priority tasks untouched
- Balances load respecting capacity
- Logs every reassignment

---

### 📊 Dashboard

Displays:

- Total teams
- Total projects
- Total tasks
- Workload distribution
- Activity logs
- “Reassign Tasks” smart button

---

### 📝 Activity Logs

Automatically logs:

- Task created/updated/deleted
- Project created/updated/deleted
- Team created/updated/deleted
- Member added/updated/deleted
- Task reassigned

---

### 🎨 Modern UI & UX

Powered by:

- Tailwind CSS
- Framer Motion animations
- ShadCN UI components
- Fully responsive
- Custom Navbar & Footer

---

## 🛠️ Tech Stack

| Category         | Technology                        |
| ---------------- | --------------------------------- |
| Framework        | **Next.js 14 (App Router)**       |
| Language         | **TypeScript**                    |
| State Management | **Redux Toolkit + Redux Persist** |
| UI               | **TailwindCSS**, **ShadCN UI**    |
| Animations       | **Framer Motion**                 |
| Deployment       | **Vercel**                        |
| Storage          | **LocalStorage (Redux Persist)**  |

---

```bash
git clone https://github.com/your-repo-url.git
cd smart-task-manager

2️⃣ Install dependencies
npm install

3️⃣ Run development server
npm run dev

4️⃣ Build for production
npm run build
npm start

🧠 Smart Reassignment Logic (How It Works)

Identify all team members

Check each member’s task count vs capacity

Detect overloaded members

Move low/medium priority tasks

Keep high-priority tasks untouched

Log all reassignments

Ensure no member exceeds capacity

🧪 Testing Checklist

 Create a team

 Add members

 Create a project & assign team

 Create tasks

 Overload a member

 Use Reassign Tasks

 Verify activity logs

 Refresh page (persistence check)

🚀 Deployment

Deployed using Vercel.

🔗 https://task-manager-dcew.vercel.app/
```
