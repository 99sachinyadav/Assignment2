# Task Management App Backend - Internship Assignment

 

Welcome to my assignment for the Backend Developer Internship. I have built an API using Node.js and Express. I have used two databases (PostgreSQL for the users table and MongoDB for the tasks) to show I know how to work with both. It also has a basic login system and catches bad inputs.

---
### Demo Video
<a href="https://youtu.be/xJAk4De2lYU" target="_blank"><img src="https://img.youtube.com/vi/xJAk4De2lYU/maxresdefault.jpg" alt="Demo Video" width="560" /></a>

##  Setup and Installation

### Prerequisites
- Node.js (v16+ recommended)
- PostgreSQL (Cloud URL Neon)
- MongoDB (Cloud URL Atlas)

### 1. Clone & Install Dependencies
First, clone the repository and navigate into the `backend` folder where the project lives.
```bash
cd backend
npm install
```

### 2. Database Setup

You **do not need to run MongoDB or PostgreSQL locally** to test this project. I have already hosted and connected both databases to cloud providers securely:
- **PostgreSQL**: Hosted directly on **Neon**.
- **MongoDB**: Hosted directly on **MongoDB Atlas**.

Just in case you want to see how I built it or connect your own local Postgres database later, here is the exact SQL query I used to build my users table:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Environment Variables
Create a `.env` file in the root of the `backend` directory and add your connection strings and secrets:
```env
PORT=5000
POSTGRES_URI=postgresql://neondb_owner:npg_caWS1oV0bgXN@ep-misty-mouse-an9ur7rr-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require
MONGO_URI=mongodb+srv://sy7841846_db_user:NMQ3kVOqlqAnULEH@cluster0.phn7c8e.mongodb.net
JWT_SECRET=myJWTSECRETFORINTERN
```

### 4. Running the Application
I have used ES module syntax in this project (configured in `package.json`). To start the hot-reloading development server:
```bash
npm run server
```
*You should see output indicating that MongoDB and PostgreSQL are successfully connected.*

---

##  Architecture & Design Decisions

Here are some simple design choices I made to keep the code clean:

1. **Two Databases**: I used **PostgreSQL** for user logins because it's good for basic standard tables, and **MongoDB** for tasks because NoSQL makes it easier to change fields later. I run my queries directly via the `pg` pool.
2. **ES Modules (`import`/`export`)**: I used the modern `import` style everywhere instead of older CommonJS `require` just to stay up to date.
3. **Clean Folders**: I split up my logic into `controllers` and `routes` so my main `index.js` file doesn't get huge and messy.
4. **Error Handling**: Instead of using the express `next` thing inside controllers, I just catch the errors right on the spot and use `res.status().json()`. I still kept a global handler at the end just in case an unknown crash happens.
5. **DNS Fix**: I added a quick Node DNS fix at the top of `index.js` (pointing to `1.1.1.1`) to stop my computer from throwing a connection error when linking up to MongoDB locally.

### Folder Structure
I structured the folders by separating concerns into independent layers:
```text
/backend
├── /config        # Database connection configuration (Postgres/Mongo)
├── /controller    # Core application logic and database interactions
├── /middleware    # JWT validation, global Error handling, 404 handler
├── /models        # Mongoose Schemas & Postgres query wrappers
├── /routes        # Express router files mapping URLs to controllers
├── /validator     # Joi validation schemas for robust input checking
├── index.js       # Express Application Entry Point
└── package.json   # Dependencies and Scripts
```

---

##  API Documentation & Postman Guide

### Authentication Overview
All `/api/tasks/*` routes require a Bearer token.
**Header:** `Authorization: Bearer <your_jwt_token>`

### 1. User Authentication

#### A. Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response** (201 Created): Returns the generated JWT token alongside user info.

#### B. Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response** (200 OK): Returns the JWT token for accessing protected routes.

#### C. Get Profile
- **URL**: `/api/auth/profile`
- **Method**: `GET`
- **Header**: `Authorization: Bearer <Token>`
- **Response** (200 OK): Confirms the logged-in user profile.

---

### 2. Task Management (Protected Routes)

#### A. Create Task
- **URL**: `/api/tasks/createTask`
- **Method**: `POST`
- **Header**: `Authorization: Bearer <Token>`
- **Body**:
  ```json
  {
    "title": "Buy Groceries",
    "description": "Milk, eggs, and bread",
    "dueDate": "2026-05-01T10:00:00.000Z",
    "status": "pending"
  }
  ```
- **Response** (201 Created): Saves to MongoDB bound securely to the logged in `userId`.

#### B. Get All Tasks
- **URL**: `/api/tasks/getTasks`
- **Method**: `GET`
- **Header**: `Authorization: Bearer <Token>`
- **Response** (200 OK): Returns an array of tasks **only** belonging to the logged-in user.

#### C. Get Single Task
- **URL**: `/api/tasks/getTasks/:id`
- **Method**: `GET`
- **Header**: `Authorization: Bearer <Token>`
- **Response** (200 OK): Returns the specific task.

#### D. Update Task
- **URL**: `/api/tasks/updateTask/:id`
- **Method**: `PUT`
- **Header**: `Authorization: Bearer <Token>`
- **Body** (Optional Fields):
  ```json
  {
    "status": "completed"
  }
  ```
- **Response** (200 OK): Returns the updated Task object.

#### E. Delete Task
- **URL**: `/api/tasks/deleteTask/:id`
- **Method**: `DELETE`
- **Header**: `Authorization: Bearer <Token>`
- **Response** (200 OK): `{ "message": "Task removed successfully" }`

---

##  Testing Criteria & Validations Addressed

Here is how I proved I met all the assignment requirements on my machine:

1. **The Setup Process:** Running `npm run server` hooks up everything nicely and prints that the DBs are running.
2. **User Registration & Login:** You can create an account and log in. The password gets safely scrambled with `bcrypt` before hitting Postgres, and you get a real JWT token back.
3. **Task CRUD for Authenticated User:** I tested that I can successfully run Create, View, Update, and Delete on my own tasks safely.
4. **Isolating Cross-User Contamination:** 
   - I tested logging in as User A, and passing an ID for a task that belongs to User B. The code correctly blocks me with a `403 Forbidden` message because I made the controllers manually check if `task.userId` matches the token.
5. **Data Validation and Error Handling:**
   - If you try to create a task leaving out the title or description, it stops you immediately with a `400 Bad Request`.
   - If you hit a URL that doesn't exist, it falls safely into my custom `404 Not Found` script.
   - If you forget to pass your `Bearer` token in Postman, you get a quick `401 Unauthorized`.
