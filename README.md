# StudentHub — Student Management System

A responsive CRUD application built with **Next.js App Router, JavaScript, Tailwind CSS, MongoDB Community Server (local), and Mongoose**.

## Features

- Create, list, view, update and delete students
- Student fields: name, email, phone and department
- Duplicate email protection
- Search by name, email, phone or department
- Department filter
- Responsive dashboard and mobile student cards
- Form and API validation
- Local MongoDB connection

## 1. Requirements

- Node.js 20.9 or later (use a current LTS release)
- npm
- MongoDB Community Server
- Optional: MongoDB Compass

## 2. Install MongoDB Community Server on Windows

1. Download the Community Server MSI installer: https://www.mongodb.com/try/download/community
2. Choose Windows and the MSI package.
3. Run the installer and choose **Complete**.
4. Keep **Install MongoDB as a Service** enabled. The default service name is usually `MongoDB`.
5. Install MongoDB Compass if the installer offers it.

Open PowerShell and check the service:

```powershell
Get-Service MongoDB
```

If it is stopped, start it in an Administrator PowerShell:

```powershell
Start-Service MongoDB
```

Check the shell (if MongoDB Shell was installed):

```powershell
mongosh --version
mongosh "mongodb://127.0.0.1:27017"
```

At the `mongosh` prompt, you can create/select the database and collection:

```javascript
use studentDB
db.createCollection("students")
show collections
```

Exit with:

```javascript
exit
```

MongoDB creates the database/collection automatically on the first insert too. You can also open MongoDB Compass and connect with:

```text
mongodb://127.0.0.1:27017
```

Then browse the `studentDB` database and `students` collection after adding the first student in the app.

## 3. Configure the application

In the project root, create a file named `.env.local` (same folder as `package.json`):

```env
MONGODB_URI=mongodb://127.0.0.1:27017/studentDB
```

Do not commit `.env.local` to GitHub. `.gitignore` excludes it.

## 4. Install and run

Open a terminal in this project folder:

```bash
npm install
npm run dev
```

Open http://localhost:3000

Keep the MongoDB Windows service running while using the application. If you change `.env.local`, stop and restart `npm run dev`.

## 5. API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/students` | List all students |
| POST | `/api/students` | Create a student |
| GET | `/api/students/:id` | Get one student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

Example POST JSON:

```json
{
  "name": "Ayesha Rahman",
  "email": "ayesha@example.com",
  "phone": "01700000000",
  "department": "Computer Science"
}
```

## 6. Troubleshooting

### `ECONNREFUSED 127.0.0.1:27017`

MongoDB is not running, or it is listening on another port. In Administrator PowerShell:

```powershell
Get-Service MongoDB
Start-Service MongoDB
```

### `mongosh is not recognized`

MongoDB Shell may not be installed or its `bin` directory is not on PATH. Install MongoDB Shell from https://www.mongodb.com/try/download/shell, then reopen PowerShell. The app itself can still connect without `mongosh` if the MongoDB Server service is running.

### Database is not visible in Compass

Connect to `mongodb://127.0.0.1:27017`, add a student through the app, then refresh Compass. MongoDB may not show a database until it contains data.

### Port 3000 is busy

Run:

```bash
npm run dev -- -p 3001
```

Then open http://localhost:3001.

## Important note

This local database is stored on your own computer. Other people who clone the GitHub repository will need to install and run their own MongoDB server, or configure a database they can access. Do not publish database passwords or private connection strings.
