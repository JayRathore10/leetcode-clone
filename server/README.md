# LeetCode Clone — Server

This directory contains the backend API for the LeetCode Clone project.

The server is responsible for:

- User authentication and authorization (JWT-based)
- Problem management
- Code submissions
- User progress and statistics
- Middleware handling and validation

The backend is built using Node.js, Express.js, and MongoDB.

---

## Folder Structure

```
server/
│
├── src/
│   ├── config/            # Database and application configuration
│   ├── controllers/       # Business logic and request handlers
│   ├── middlewares/       # Authentication and error handling
│   ├── models/            # Mongoose models (User, Problem, Submission)
│   ├── routes/            # API route definitions
│   ├── utils/             # Helper and utility functions
│   ├── app.js             # Express app configuration
│   └── server.js          # Application entry point
│
├── .env                   # Environment variables
├── .gitignore
├── package.json
└── README.md
```



---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)

---

## Installation and Setup

### 1. Navigate to the server directory

```bash
cd server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables file

Create a `.env` file in the root of the server directory and add:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Run the server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will run at:

```
http://localhost:3000
```

---

# Authentication API

Base Route: `/api/auth`

All authentication routes are defined in:

```
src/routes/auth.route.ts
```

---

## 1. Register User

**POST** `/api/auth/register`

### Request Body

```json
{
  "username": "Jay_Rathore11",
  "name": "Jay Rathore",
  "email": "jayrathore8815@gmail.com",
  "password": "Jay9575Rathore"
}
```

### Success Response (201)

```json
{
  "success": true,
  "message": "User Registered Successfully",
  "user": {
    "_id": "69986d1a94d18a4af37102a2",
    "username": "Jay_Rathore11",
    "name": "Jay Rathore",
    "email": "jayrathore8815@gmail.com",
    "password": "$2b$10$hashedPassword",
    "role": "user",
    "profilePic": "default.jpg",
    "createdAt": "2026-02-20T14:18:02.535Z",
    "updatedAt": "2026-02-20T14:18:02.535Z",
    "__v": 0
  }
}
```

### Error Responses

**400 — Validation Error**

```json
{
  "success": false,
  "error": {
    "fieldName": {
      "_errors": ["Validation message"]
    }
  }
}
```

**400 — User Already Exists**

```json
{
  "success": false,
  "message": "User Already Exists"
}
```

---

## 2. Login User

**POST** `/api/auth/login`

### Request Body

```json
{
  "email": "jayrathore88155@gmail.com",
  "password": "password123"
}
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Login successfully",
  "user": {
    "_id": "6978bfac5ba09e71d7453352",
    "username": "Jay_Rathore1",
    "name": "Jay Rathore",
    "email": "jayrathore88155@gmail.com",
    "password": "$2b$10$hashedPassword",
    "role": "user",
    "profilePic": "1770375732550-53458247.jpg",
    "createdAt": "2026-01-27T13:37:48.010Z",
    "updatedAt": "2026-02-06T11:02:12.611Z",
    "__v": 0
  }
}
```

### Error Responses

**404 — User Not Found**

```json
{
  "success": false,
  "message": "User Not found"
}
```

**400 — Invalid Password**

```json
{
  "success": false,
  "message": "Password is invalid"
}
```

**400 — Validation Error**

```json
{
  "success": false,
  "error": {
    "fieldName": {
      "_errors": ["Validation message"]
    }
  }
}
```

---

## 3. Logout User (Protected Route)

**POST** `/api/auth/logout`

Middleware: `isUserLoggedIn`

This route requires a valid authentication cookie (`token`).

### Success Response (200)

```json
{
  "success": true,
  "message": "Log out successfully"
}
```

### Error Response

**401 — Token Not Found**

```json
{
  "success": false,
  "message": "Token not Found"
}
```

---

## 4. Get Current User

**GET** `/api/auth/me`

Requires Authorization header:

```
Authorization: Bearer <token>
```

### Success Response (200)

```json
{
  "success": true,
  "user": {
    "_id": "6978bfac5ba09e71d7453352",
    "username": "Jay_Rathore1",
    "name": "Jay Rathore",
    "email": "jayrathore88155@gmail.com",
    "role": "user",
    "profilePic": "1770375732550-53458247.jpg",
    "createdAt": "2026-01-27T13:37:48.010Z",
    "updatedAt": "2026-02-06T11:02:12.611Z",
    "__v": 0
  }
}
```

### Error Responses

**401 — No Token**

```json
{
  "message": "No Token"
}
```

**401 — User Not Found**

```json
{
  "message": "User not found"
}
```

---

# Authentication Middleware

## isUserLoggedIn

- Reads JWT from cookies
- Verifies token
- Attaches user to `req.user`
- Blocks access if token is missing or invalid

### Possible Errors

**401 — Token Not Found**

```json
{
  "success": false,
  "message": "Token not Found"
}
```

**401 — User not found**

```json
{
  "success": false,
  "message": "User not found"
}
```

---

## isAdminLoggedIn

- Reads JWT from cookies
- Verifies token
- Checks if `role === "admin"`
- Blocks non-admin users

### 403 — Not Admin

```json
{
  "success": false,
  "message": "You are not admin"
}
```

---

# Questions API

Base Route: `/api/questions`

All question routes are defined in:

```
src/routes/question.route.ts
```

---

## 1. Add Question (Admin Protected)

**POST** `/api/questions/add`

### Request Body

```json
{
  "title": "Two Sum",
  "description": "Given an array...",
  "difficulty": "Easy",
  "tags": ["array", "hashmap"],
  "constraints": "1 <= nums.length <= 10^4",
  "example": "Input: nums = [2,7,11,15], target = 9"
}
```

### Success Response (201)

```json
{
  "success": true,
  "message": "New Question Created",
  "data": {
    "newQuestion": {
      "_id": "q1",
      "title": "Two Sum",
      "description": "Given an array...",
      "difficulty": "Easy",
      "tags": ["array", "hashmap"],
      "constraints": "1 <= nums.length <= 10^4",
      "example": "Input: nums = [2,7,11,15], target = 9",
      "createdAt": "2026-02-20T14:18:02.535Z",
      "updatedAt": "2026-02-20T14:18:02.535Z"
    }
  }
}
```

### Error Responses

**400 — Validation Error**

```json
{
  "error": {
    "fieldName": {
      "_errors": ["Validation message"]
    }
  }
}
```

**400 — Creation Failed**

```json
{
  "success": false,
  "message": "New Question is not created"
}
```

---

## 2. Delete Question (Admin Protected)

**DELETE** `/api/questions/delete/:questionId`

### Success Response (200)

```json
{
  "success": true,
  "message": "Question delete successfully"
}
```

### Error Responses

**404 — Missing Question Id**

```json
{
  "success": false,
  "message": "Enter the question Id"
}
```

**404 — Question Not Found**

```json
{
  "success": false,
  "message": "Question Not found"
}
```

---

## 3. Get All Questions (Public)

**GET** `/api/questions/all`

### Success Response (200)

```json
{
  "success": true,
  "message": "These are all questions",
  "questions": [
    {
      "_id": "q1",
      "title": "Two Sum",
      "difficulty": "Easy"
    },
    {
      "_id": "q2",
      "title": "Add Two Numbers",
      "difficulty": "Medium"
    }
  ]
}
```

### Error Response (404)

```json
{
  "success": false,
  "message": "There is no question in database"
}
```

---

## 4. Get Single Question (Public)

**GET** `/api/questions/:id`

### Success Response (200)

```json
{
  "success": true,
  "message": "This is Question",
  "question": {
    "_id": "q1",
    "title": "Two Sum",
    "description": "Given an array...",
    "difficulty": "Easy",
    "tags": ["array", "hashmap"],
    "constraints": "1 <= nums.length <= 10^4",
    "example": "Input: nums = [2,7,11,15], target = 9"
  }
}
```

### Error Response (404)

```json
{
  "success": false,
  "message": "Question not found"
}
```

---

## 5. Run Code (User Protected)

**POST** `/api/questions/run`

### Request Body

```json
{
  "questionId": "q1",
  "code": "function twoSum(nums, target) {...}",
  "language": "javascript"
}
```

### Success Response (200)

```json
{
  "success": true,
  "result": [
    { "test": 1, "status": "Passed" },
    { "test": 2, "status": "Passed" }
  ]
}
```

### Error Responses

**400 — Missing Fields**

```json
{
  "success": false,
  "message": "Code, language or questionId is not mentioned"
}
```

**404 — Test Cases Not Found**

```json
{
  "success": false,
  "message": "Not Test Case found"
}
```

**Compilation / Runtime / TLE / MLE**

```json
{
  "success": false,
  "status": "WA",
  "failedTest": 1,
  "errorType": "Compilation Error",
  "message": "Error message here"
}
```

---

## 6. Submit Code (User Protected)

**POST** `/api/questions/submit`

### Request Body

```json
{
  "questionId": "q1",
  "code": "function twoSum(nums, target) {...}",
  "language": "javascript"
}
```

### Success Response (200)

```json
{
  "success": true,
  "status": "Accepted",
  "totalTest": 5
}
```

### Error Responses

**404 — Missing Fields**

```json
{
  "success": false,
  "message": "questionId, code, or language is not mentioned"
}
```

**404 — Test Cases Not Present**

```json
{
  "success": false,
  "message": "Test Cases are not present"
}
```

**Wrong Answer**

```json
{
  "status": "WA",
  "failedTest": 2,
  "expected": "3",
  "actual": "4",
  "totalTest": 5
}
```

---

## 7. Total Questions (Public)

**GET** `/api/questions/total`

### Success Response (200)

```json
{
  "success": true,
  "message": "Total Number of Questions",
  "totalQuestion": 10
}
```

### Error Response (400)

```json
{
  "success": false,
  "message": "There are no questions in database"
}
```
---

# Submissions API

Base Route: `/api/submissions`

All submission routes are defined in:

```
src/routes/submission.route.ts
```

All routes are **User Protected** via `isUserLoggedIn` middleware.

---

## 1. Add Submission

**POST** `/api/submissions`

### Request Body

```json
{
  "questionId": "q1",
  "title": "Two Sum",
  "code": "function twoSum(nums, target) {...}",
  "language": "javascript",
  "status": "Accepted"
}
```

### Success Response (201)

```json
{
  "success": true,
  "message": "New Submission Created",
  "submission": {
    "_id": "s1",
    "userId": "u1",
    "questionId": "q1",
    "title": "Two Sum",
    "code": "function twoSum(nums, target) {...}",
    "language": "javascript",
    "status": "Accepted",
    "createdAt": "2026-02-20T15:00:00.000Z",
    "updatedAt": "2026-02-20T15:00:00.000Z"
  }
}
```

### Error Responses

**400 — Validation Error**

```json
{
  "success": false,
  "error": {
    "fieldName": {
      "_errors": ["Validation message"]
    }
  }
}
```

**400 — Submission Creation Failed**

```json
{
  "success": false,
  "message": "Error in creating Submission"
}
```

---

## 2. Get All User Submissions

**GET** `/api/submissions`

### Success Response (200)

```json
{
  "success": true,
  "message": "User's All Submissions",
  "submissions": [
    {
      "_id": "s1",
      "questionId": {
        "_id": "q1",
        "title": "Two Sum",
        "difficulty": "Easy"
      },
      "title": "Two Sum",
      "code": "function twoSum(nums, target) {...}",
      "language": "javascript",
      "status": "Accepted",
      "createdAt": "2026-02-20T15:00:00.000Z"
    },
    {
      "_id": "s2",
      "questionId": {
        "_id": "q2",
        "title": "Add Two Numbers",
        "difficulty": "Medium"
      },
      "title": "Add Two Numbers",
      "code": "...",
      "language": "javascript",
      "status": "Accepted",
      "createdAt": "2026-02-20T14:55:00.000Z"
    }
  ]
}
```

### No Submissions Response (200)

```json
{
  "success": false,
  "message": "User don't have any submissions"
}
```

---

## 3. Get Submission Detail

**GET** `/api/submissions/:id`

### Success Response (200)

```json
{
  "success": true,
  "message": "Submission",
  "submission": {
    "_id": "s1",
    "userId": "u1",
    "questionId": {
      "_id": "q1",
      "title": "Two Sum",
      "difficulty": "Easy"
    },
    "title": "Two Sum",
    "code": "function twoSum(nums, target) {...}",
    "language": "javascript",
    "status": "Accepted",
    "createdAt": "2026-02-20T15:00:00.000Z",
    "updatedAt": "2026-02-20T15:00:00.000Z"
  }
}
```

### Error Response (404)

```json
{
  "success": false,
  "message": "Submission not found"
}
```

---

## Environment Variables

| Variable   | Description                               |
|------------|-------------------------------------------|
| PORT       | Server port                               |
| MONGO_URI  | MongoDB connection string                 |
| JWT_SECRET | Secret key used for JWT authentication    |

---

## Best Practices

- Centralized error handling
- Async/await for asynchronous operations
- JWT-based authentication middleware
- MVC architecture
- RESTful API design principles
- Environment-based configuration

---

## Author

Jay Rathore  
Full Stack Developer