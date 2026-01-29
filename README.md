<div align="center">

# 📝 Notes Management Application

### A Production-Grade Full-Stack MERN Application

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

*A secure, scalable notes management solution built to demonstrate real-world MERN application architecture and system design fundamentals.*

[Features](#-features) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [API Reference](#-api-reference) • [Contributing](#-contributing)

</div>

---

## 🎯 Overview

This project is a **production-style full-stack Notes Management application** designed to showcase best practices in modern web development. It features secure authentication, RESTful API design, and a clean, responsive user interface—all while emphasizing scalability and maintainability.

> **Learning Objective:** Understand real-world MERN application flow, authentication patterns, and system design fundamentals.

---

## ✨ Features

### Core Functionality
- 📝 **Create, Read, Update, Delete** — Full CRUD operations for notes
- 🔍 **Search & Filter** — Quickly find notes with powerful search capabilities
- 🏷️ **Categorization** — Organize notes with tags and categories
- 📌 **Pin Important Notes** — Keep critical notes at the top

### Security & Authentication
- 🔐 **JWT Authentication** — Secure token-based user authentication
- 🛡️ **Password Hashing** — Bcrypt encryption for user credentials
- 🚪 **Protected Routes** — Middleware-based route protection
- 🔄 **Session Management** — Secure session handling with refresh tokens

### User Experience
- 📱 **Responsive Design** — Seamless experience across all devices
- 🌙 **Dark/Light Mode** — Theme switching for user preference
- ⚡ **Real-time Updates** — Instant feedback on all operations
- 🎨 **Modern UI** — Clean, intuitive interface

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React.js** | UI Component Library |
| **React Router** | Client-side Routing |
| **Axios** | HTTP Client |
| **Context API** | State Management |
| **CSS Modules** | Scoped Styling |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime Environment |
| **Express.js** | Web Framework |
| **MongoDB** | NoSQL Database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication Tokens |
| **Bcrypt** | Password Hashing |

### DevOps & Tools
| Technology | Purpose |
|------------|---------|
| **Git** | Version Control |
| **Postman** | API Testing |
| **dotenv** | Environment Variables |
| **Nodemon** | Development Server |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Components │  │   Context   │  │      React Router       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP/HTTPS (Axios)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Express.js)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Routes    │──│ Controllers │──│      Middleware         │  │
│  └─────────────┘  └─────────────┘  │  (Auth, Validation)     │  │
│                                    └─────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (MongoDB)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │    Users    │  │    Notes    │  │       Sessions          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Project-1/
├── client/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── context/           # React Context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service functions
│   │   ├── utils/             # Utility functions
│   │   ├── styles/            # CSS modules & global styles
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── config/                # Configuration files
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   ├── models/                # Mongoose models
│   ├── routes/                # API routes
│   ├── utils/                 # Utility functions
│   ├── server.js              # Entry point
│   └── package.json
│
├── .env.example               # Environment variables template
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas cluster)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnubhavGitHub07/Project-1.git
   cd Project-1
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/notes-app

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d

   # Client URL (for CORS)
   CLIENT_URL=http://localhost:3000
   ```

5. **Run the application**

   **Development mode (run both servers concurrently):**
   ```bash
   # From root directory
   npm run dev
   ```

   **Or run separately:**
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev

   # Terminal 2 - Frontend
   cd client && npm start
   ```

6. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api`

---

## 📡 API Reference

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user |
| `POST` | `/api/auth/logout` | Logout user |
| `GET` | `/api/auth/me` | Get current user |

### Notes Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notes` | Get all notes for user |
| `GET` | `/api/notes/:id` | Get single note |
| `POST` | `/api/notes` | Create new note |
| `PUT` | `/api/notes/:id` | Update note |
| `DELETE` | `/api/notes/:id` | Delete note |
| `PATCH` | `/api/notes/:id/pin` | Toggle pin status |

### Request & Response Examples

<details>
<summary><b>Create Note</b></summary>

**Request:**
```json
POST /api/notes
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Meeting Notes",
  "content": "Discuss project timeline and deliverables",
  "tags": ["work", "important"],
  "isPinned": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123def456",
    "title": "Meeting Notes",
    "content": "Discuss project timeline and deliverables",
    "tags": ["work", "important"],
    "isPinned": false,
    "user": "64user789",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```
</details>

---

## 🔐 Security Best Practices

This application implements several security measures:

- ✅ **Password Hashing** — Using bcrypt with salt rounds
- ✅ **JWT Tokens** — Secure, httpOnly cookies
- ✅ **Input Validation** — Server-side validation for all inputs
- ✅ **Rate Limiting** — Protection against brute force attacks
- ✅ **CORS Configuration** — Restricted cross-origin requests
- ✅ **Helmet.js** — HTTP security headers
- ✅ **Data Sanitization** — Prevention of NoSQL injection

---

## 🧪 Testing

```bash
# Run backend tests
cd server && npm test

# Run frontend tests
cd client && npm test

# Run with coverage
npm run test:coverage
```

---

## 📈 Future Enhancements

- [ ] Rich text editor for notes
- [ ] Collaborative notes (real-time editing)
- [ ] Note sharing via public links
- [ ] File attachments
- [ ] Export notes (PDF, Markdown)
- [ ] Note versioning & history
- [ ] Mobile application (React Native)
- [ ] OAuth integration (Google, GitHub)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Anubhav**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AnubhavGitHub07)

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

*Built with ❤️ using the MERN Stack*

</div>
