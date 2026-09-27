# LeetCode Clone

A full-stack coding platform inspired by LeetCode that enables users to practice data structures and algorithms problems in an interactive environment. The application provides problem browsing, code editing, execution, and result evaluation within a modern web interface.

**Live Demo:** https://leetcode-clone-pi-flame.vercel.app/

---

## Demo Video

You can watch the complete working demonstration below:

[Watch Demo Video](./assets/videos/demo.mkv)

---

## Screenshots

### Home Page
- **Dark Mode:** ![Home Page Dark](./assets/screenshots/home-page-dark.png)
- **Light Mode:** ![Home Page Light](./assets/screenshots/home-page-light.png)

### Login Page
- **Dark Mode:** ![Login Dark](./assets/screenshots/login-dark.png)
- **Light Mode:** ![Login Light](./assets/screenshots/login-light.png)

### Sign Up Page
- **Dark Mode:** ![Sign Up Dark](./assets/screenshots/sign-up-dark.png)
- **Light Mode:** ![Sign Up Light](./assets/screenshots/sign-up-light.png)

### Problem List
- **Dark Mode:** ![Problem List Dark](./assets/screenshots/problem-list-dark.png)
- **Light Mode:** ![Problem List Light](./assets/screenshots/problem-list-light.png)

### Problem Detail View 1
- **Dark Mode:** ![Problem Detail 1 Dark](./assets/screenshots/problem-detail1-dark.png)
- **Light Mode:** ![Problem Detail 1 Light](./assets/screenshots/problem-detail1-light.png)

### Problem Detail View 2
- **Dark Mode:** ![Problem Detail 2 Dark](./assets/screenshots/problem-detail2-dark.png)
- **Light Mode:** ![Problem Detail 2 Light](./assets/screenshots/problem-detail2-light.png)

### Discussion
- **Dark Mode:** ![Discussion Dark](./assets/screenshots/discussion-dark.png)
- **Light Mode:** ![Discussion Light](./assets/screenshots/discussion-light.png)

### Contest
- **Dark Mode:** ![Contest Dark](./assets/screenshots/contest-dark.png)
- **Light Mode:** ![Contest Light](./assets/screenshots/contest-light.png)

### Leaderboard
- **Dark Mode:** ![Leaderboard Dark](./assets/screenshots/leaderboard-dark.png)
- **Light Mode:** ![Leaderboard Light](./assets/screenshots/leaderboard-light.png)

### User Profile
- **Dark Mode:** ![Profile Dark](./assets/screenshots/profile-dark.png)
- **Light Mode:** ![Profile Light](./assets/screenshots/profile-light.png)

---

## Overview

This project replicates the core functionality of an online coding judge. Users can browse problems, write solutions in an integrated code editor, and execute their code to verify correctness. The platform is designed with clean architecture, scalability, and maintainability in mind.

---

## Features

- Structured problem listing and detailed problem pages  
- Integrated code editor with syntax highlighting  
- Code execution and output evaluation  
- User authentication and session management  
- RESTful API architecture  
- Responsive user interface  

---

## Tech Stack

### Frontend
- React
- TypeScript
- CSS

### Backend
- Node.js
- Express

### Additional Tools
- REST APIs  
- Online code execution service integration  
- Vercel (Frontend deployment)  

---

## Project Structure

```
leetcode-clone/
│
├── client/                  
├── server/                  
├── assets/
│   ├── screenshots/
│   └── videos/
└── README.md
```

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/JayRathore10/leetcode-clone.git
cd leetcode-clone
```

### 2. Install Dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server` directory and configure:

```
PORT=5000
MONGO_URI=your_database_connection_string
GEMINI_API_KEY=your_gemini_api_service_key
COOKIE_SECRET=your_cookie_secret
SALT_ROUND=your_hashing_salt_round
JWT_SECRET=your_jwt_secret
FRONTEND=your_frontend_url
VITE_BACKEND_URL=your_backend_url
```

Modify values according to your environment configuration.

### 4. Run the Application

Start backend:

```bash
cd server
npm run dev
```

Start frontend:

```bash
cd client
npm start
```

---

## Deployment

- Frontend deployed on Vercel  
- Backend can be deployed on Render, Railway, or any Node.js-supported hosting platform  

---

## Future Improvements

- Submission history tracking  
- User performance statistics dashboard  
- Difficulty filters and tagging system  
- Discussion section per problem  
- Admin panel for managing problems  

---

## Contributing

Contributions are welcome.

1. Fork the repository  
2. Create a feature branch  
3. Commit your changes  
4. Open a pull request with a clear description  

---

## License

This project is open-source and intended for educational and portfolio purposes.
