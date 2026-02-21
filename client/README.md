# LeetCode Clone — Client

This directory contains the frontend of the LeetCode Clone project, built with React and TypeScript. It provides a responsive UI for browsing problems, writing code, running solutions, and tracking user progress.

Live Demo: [https://leetcode-clone-pi-flame.vercel.app/](https://leetcode-clone-pi-flame.vercel.app/)

---

## Folder Structure

```
client/
│
├── public/                 # Static files like index.html
├── src/
│   ├── components/         # React components
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component
│   ├── index.tsx           # Entry point
│   └── styles/             # CSS / SCSS files
└── package.json
```

---

## Tech Stack

- **React** with TypeScript
- **CSS / SCSS**
- **Axios** for API calls
- **Vercel** for deployment

---

## Features

- Browse and filter coding problems
- View problem details, examples, and constraints
- Integrated code editor with syntax highlighting
- Run code and see results in real-time
- User authentication and profile management
- Submission history and status tracking

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
```

### 3. Start Development Server

```bash
npm run dev
```

The app will run at:

```
http://localhost:5173
```

---

## Environment Variables

No environment variables are required for the frontend. All API calls should point to your backend server.

---

## Best Practices

- Component-based architecture for reusability
- Centralized API calls using services
- Responsive design for desktop and mobile
- State management using React Context
- Strict TypeScript typing for safer code

---

## Author

Jay Rathore  
Full Stack Developer