# 📊 AttendSalary - Employee & Payroll Management System

![AttendSalary](client/public/favicon.svg) <!-- Replace with a wide banner image if you have one later! -->

**AttendSalary** is a modern, responsive, and full-stack HR and Payroll Management System built on the MERN stack. Designed with a mobile-first approach, it simplifies tracking employee attendance, managing salaries, handling advances, and generating detailed reports.

*Live Demo:* [https://ranjitkumar.raorajan.pro](https://ranjitkumar.raorajan.pro)

---

## ✨ Features

- **👥 Employee Management:** Add, edit, and remove employee details (Department, Role, Base Salary).
- **📅 Attendance Tracking:** Mark daily attendance with statuses (Present, Absent, Leave, Late) and track overtime.
- **💰 Salary & Payroll:** Auto-calculate gross salary, deduct unpaid absences, track advances, and finalize monthly payouts.
- **💵 Advance Payments:** Handle short-term salary advances and log them.
- **📱 Fully Responsive:** Carefully crafted mobile-first UI mapping every feature properly to any screen size.
- **📊 Interactive Dashboard:** Overview statistics, recent activities, and pending actions at a glance.

---

## 🛠️ Tech Stack

**Frontend:**
- [React (v19)](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) for modern, responsive styling
- React Router DOM for flexible routing

**Backend:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) / Mongoose (Cloud Atlas database)

**Deployment & DevOps:**
- **Docker & Docker Compose:** Containerized microservices (Frontend mapped via Nginx, Backend via Node)
- **Nginx:** Reverse Proxy & static file serving
- **Certbot / Let's Encrypt:** Automated Free SSL Certificates

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
- Git

### 2. Clone the repository
```bash
git clone https://github.com/raorajan/employee-salary-management.git
cd employee-salary-management
```

### 3. Setup the Backend
Navigate to the server directory:
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0...
```
Start the backend server:
```bash
npm run dev
```

### 4. Setup the Frontend
Open a new terminal and navigate to the client directory:
```bash
cd client
npm install
```
*(Optional)* Create a `.env` file in the `client` directory if your backend runs on a different port:
```env
VITE_API_URL=http://localhost:4000/api
```
Start the frontend development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🐳 Deployment (Docker)

To deploy the application securely on a cloud Linux server (e.g., Ubuntu on AWS/E2E/DigitalOcean):

1. **Clone & Setup Env:**
   ```bash
   git clone https://github.com/raorajan/employee-salary-management.git AttendSalary
   cd AttendSalary
   echo "PORT=4000\nMONGODB_URI=your_mongo_uri" > server/.env
   ```
2. **Launch with Docker Compose:**
   ```bash
   sudo docker compose up -d --build
   ```
   *The frontend will map to port `8080`, and it securely reverse-proxies API calls directly to the Docker backend.*
3. **Configure Nginx & SSL (Host Level):**
   * Map your domain to your server's IP via an A-Record.
   * Forward domain traffic from `80` onto local port `8080`.
   * Secure with Free Let's Encrypt SSL using `certbot`.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/raorajan/employee-salary-management/issues).

## 📄 License
This project is [MIT](LICENSE) licensed.
