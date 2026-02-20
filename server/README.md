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

## API Response Format

It is recommended to document API responses in text (JSON format) rather than using screenshots.

### Reasons:

- Easier to copy and test
- Searchable within GitHub
- Version controlled
- Easier to maintain and update
- Screenshots can quickly become outdated

---

## Example API Responses

### Authentication — Login

**POST** `/api/auth/login`

Request:

```json
{
  "email": "jayrathore88155@gmail.com",
  "password": "password123"
}
```

Success Response:

```json
{
    "success": true,
    "message": "Login successfully",
    "user": {
      "_id": "6978bfac5ba09e71d7453352",
      "username": "Jay_Rathore1",
      "name": "Jay Rathore",
      "email": "jayrathore88155@gmail.com",
      "password": "$2b$10$uSbBndmE6vnEu2yVWbUsTuDdS1PWMltcbRgdM53qFSCx0pMLGGI.6",
      "role": "user",
      "profilePic": "1770375732550-53458247.jpg",
      "createdAt": "2026-01-27T13:37:48.010Z",
      "updatedAt": "2026-02-06T11:02:12.611Z",
      "__v": 0
    }
}
```

Error Response:

```json
{
  "success": false,
  "message": "Password is invalid"
}
```

---

### Get All Problems

**GET** `/api/problems`

Response:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "p1",
      "title": "Two Sum",
      "difficulty": "Easy"
    },
    {
      "_id": "p2",
      "title": "Add Two Numbers",
      "difficulty": "Medium"
    }
  ]
}
```

---

### Submit Solution

**POST** `/api/submissions`

Request:

```json
{
  "problemId": "p1",
  "code": "function twoSum() { ... }",
  "language": "javascript"
}
```

Response:

```json
{
  "success": true,
  "status": "Accepted",
  "executionTime": "32ms"
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