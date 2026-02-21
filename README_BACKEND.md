# AttendSalary Backend

Node.js + Express + MongoDB backend for the AttendSalary app.

## Setup

1. **Install dependencies**
   ```bash
   cd server && npm install
   ```

2. **Environment**
   - Copy/update `server/.env` with your MongoDB URI
   - Default: `mongodb+srv://rajan:kumar@cluster0.vvtoxbl.mongodb.net/flipkart?retryWrites=true&w=majority`
   - To use a different database, change the database name in the URI (e.g., `attendsalary` instead of `flipkart`)

3. **Run server**
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:4000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employees | List all employees |
| POST | /api/employees | Create employee |
| DELETE | /api/employees/:id | Remove employee |
| GET | /api/attendance | List attendance (query: employeeId, date, month) |
| POST | /api/attendance/mark | Mark attendance |
| GET | /api/salary | List salary records (query: month) |
| POST | /api/salary/process | Process payroll |
| GET | /api/advances | List advances |
| POST | /api/advances | Create advance |
| GET | /api/activity | List activity log |

## Credentials

- **MongoDB**: Uses the connection string in `.env`
- **Database**: `flipkart` (change in MONGODB_URI if needed)
- No auth required for API (add JWT if needed for production)
