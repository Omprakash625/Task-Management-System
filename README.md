# Task Management System

A full-stack task management application that allows users to register, log in, and perform complete CRUD operations on their personal tasks. Built with modern web technologies for a seamless user experience.

🔗 **Live Demo:** [task-management-system-coral-xi.vercel.app](https://task-management-system-coral-xi.vercel.app)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## ✨ Features

### User Management
- 🔐 **User Registration** - Create new accounts with secure authentication
- 🔑 **User Login** - Secure login with JWT-based authentication
- 👤 **User Profile** - Manage personal information and preferences

### Task Management
- ✅ **Create Tasks** - Add new tasks with title, description, and details
- 📖 **View Tasks** - Display all tasks in an organized interface
- ✏️ **Edit Tasks** - Update task information and status
- 🗑️ **Delete Tasks** - Remove completed or unwanted tasks
- 🏷️ **Task Status** - Mark tasks as completed or pending
- 🔍 **Filter & Sort** - Organize tasks by status, priority, or date

### Additional Features
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI/UX** - Clean and intuitive user interface
- ⚡ **Real-time Updates** - Instant feedback on all operations
- 🔒 **Secure** - Protected routes and data encryption

## 🛠️ Tech Stack

### Frontend
- **Framework:** React/Next.js with TypeScript
- **Styling:** CSS Modules / Tailwind CSS / Styled Components
- **State Management:** React Context API / Redux
- **HTTP Client:** Axios / Fetch API
- **Routing:** React Router / Next.js Router

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js with TypeScript
- **Database:** MongoDB / PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Joi / Zod
- **API:** RESTful API

### DevOps & Tools
- **Version Control:** Git & GitHub
- **Deployment:** Vercel (Frontend & Backend)
- **Package Manager:** npm / yarn
- **Code Quality:** ESLint, Prettier

## 📁 Project Structure

```
Task-Management-System/
├── frontend/                 # Frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   ├── utils/           # Utility functions
│   │   ├── styles/          # CSS/styling files
│   │   └── types/           # TypeScript type definitions
│   ├── public/              # Static assets
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                  # Backend application
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript type definitions
|   |   |__server.ts         # server file
│   ├── package.json
│   └── tsconfig.json
│
├── LICENSE
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16.x or higher)
- **npm** or **yarn**
- **MongoDB** (if using MongoDB) or **PostgreSQL** (if using PostgreSQL)
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Omprakash625/Task-Management-System.git
cd Task-Management-System
```

2. **Install Backend Dependencies**

```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**

```bash
cd ../frontend
npm install
```

### Running the Application

#### Development Mode

1. **Start the Backend Server**

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000` (or your configured port)

2. **Start the Frontend Application**

```bash
cd frontend
npm run dev
```

The frontend application will start on `http://localhost:3000` (or your configured port)

#### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Contact

**Omprakash Patel**

- GitHub: [@Omprakash625](https://github.com/Omprakash625)
- Project Link: [https://github.com/Omprakash625/Task-Management-System](https://github.com/Omprakash625/Task-Management-System)
- Live Demo: [https://task-management-system-coral-xi.vercel.app](https://task-management-system-coral-xi.vercel.app)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped improve this project
- Inspired by modern task management applications
- Built with love and TypeScript

---

**⭐ If you find this project useful, please consider giving it a star!**
