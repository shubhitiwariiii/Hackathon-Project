<div align="center">


<img width="500" height="500" alt="ChatGPT Image Feb 15, 2026, 01_03_48 PM" src="https://github.com/user-attachments/assets/cf74bec5-735c-4eac-84ab-437c416fb615" />

### Your AI-Powered Smart Notes Engine

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

**Notiq AI** is an intelligent notes engine that understands, organizes, and enhances your knowledge automatically — designed to act as a **second brain** that goes beyond simple storage.

[Problem](#-the-problem) · [Solution](#-the-solution) · [Features](#-key-features) · [Architecture](#-architecture-overview) · [Getting Started](#-getting-started)

</div>

---

## 🚨 The Problem

Traditional note-taking apps are glorified text editors. You write notes, and they sit there — static, disconnected, and forgotten.

- **Search is keyword-based** — you need to remember exact words to find anything
- **No semantic understanding** — the app doesn't know what your notes *mean*
- **Zero context** — creating 100 notes creates 100 isolated documents with no relationships
- **Retrieval is manual** — you are the only search engine, and your memory is limited

> The more notes you take, the harder it becomes to *use* them. Your knowledge base grows, but your ability to leverage it doesn't.

---

## 💡 The Solution

Notiq AI treats notes as **knowledge**, not just text.

Instead of dumping content into a void, Notiq AI builds a foundation for **semantic understanding** — where your notes are processed, contextualized, and made retrievable based on *meaning*, not just keywords.

The architecture is designed from the ground up to support:

- **Intelligent retrieval** — find notes by what they're *about*, not just what they contain
- **Contextual organization** — relationships between notes emerge naturally
- **AI-augmented workflows** — your notes become inputs to an engine that works *for* you

---

## ✨ Key Features

### 📝 Core Notes Engine
- Full **CRUD operations** — create, read, update, and delete notes with instant feedback
- **Real-time search** — filter notes as you type across titles and content
- **Smart stats dashboard** — track total notes, today's activity, and weekly trends at a glance

### 🔐 Authentication & Security
- **JWT-based authentication** — stateless, secure token-based sessions
- **Bcrypt password hashing** — salted hashing for credential security
- **Protected routes** — both server-side middleware and client-side route guards
- **Axios interceptors** — automatic token injection on every API request

### 🎨 User Experience
- **Modern, responsive UI** — clean dashboard design that works across devices
- **Modal-based editing** — inline creation and editing without page navigation
- **Confirmation flows** — delete confirmations to prevent accidental data loss
- **Loading states & error handling** — graceful feedback for every user action

---

## 🏗️ Architecture Overview

Notiq AI follows a clean **MERN layered architecture** with strict separation of concerns. Each layer has a single responsibility and communicates through well-defined interfaces.

```
┌─────────────────────────────────────────────────────────────────────┐
│                       CLIENT  (React + Vite)                        │
│                                                                     │
│   Pages ──→ Components ──→ API Layer (Axios) ──→ Route Guards       │
│     │            │              │                     │              │
│   dashboard    modals       interceptors       ProtectedRoute       │
│   login        search       token injection    isAuthenticated()    │
│   signup       stats                                                │
└────────────────────────────┬────────────────────────────────────────┘
                             │  HTTP/REST (JSON)
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     SERVER  (Express.js + Node)                     │
│                                                                     │
│   Routes ──→ Middleware ──→ Controllers ──→ Models                  │
│     │            │              │              │                     │
│   /api/auth    protect()     authCtrl       User (Mongoose)         │
│   /api/notes   asyncHandler  noteCtrl       Note (Mongoose)         │
└────────────────────────────┬────────────────────────────────────────┘
                             │  Mongoose ODM
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       DATABASE  (MongoDB)                           │
│                                                                     │
│              Users Collection    ◄──►    Notes Collection           │
│             (email, password)         (title, content, userId)      │
└─────────────────────────────────────────────────────────────────────┘
```

**Key design decisions:**
- **Middleware-first authentication** — `protect()` runs before any controller logic, cleanly separating auth from business logic
- **Async error handling** — `asyncHandler` wraps all controllers, eliminating repetitive try-catch blocks
- **Layered client** — API calls are centralized through an Axios instance with interceptors, keeping components clean

---

## 🛠️ Tech Stack

### Backend
| Technology | Role |
|---|---|
| **Node.js** | Runtime — event-driven, non-blocking I/O |
| **Express.js** | Web framework — routing, middleware pipeline |
| **MongoDB** | Document database — flexible schema for notes |
| **Mongoose** | ODM — schema validation, query building |
| **JWT (jsonwebtoken)** | Stateless authentication tokens |
| **Bcrypt.js** | Password hashing with salt rounds |

### Frontend
| Technology | Role |
|---|---|
| **React 18** | Component-based UI with hooks |
| **Vite** | Build tool — fast HMR, ES module bundling |
| **React Router v6** | Declarative client-side routing |
| **Axios** | HTTP client with interceptors |

### Dev Tools
| Technology | Role |
|---|---|
| **Nodemon** | Auto-restart server on file changes |
| **dotenv** | Environment variable management |
| **Git** | Version control |
| **Postman** | API testing and documentation |

---

## ⚙️ How It Works

A note's lifecycle in Notiq AI follows this path:

```
1. USER CREATES NOTE
   └──→ React form captures title + content
        └──→ Axios POST /api/notes (with JWT in header)

2. SERVER PROCESSES REQUEST
   └──→ protect() middleware validates JWT
        └──→ noteController.createNote() executes
             └──→ Mongoose validates schema + saves to MongoDB

3. DATABASE STORES DOCUMENT
   └──→ Note { title, content, userId, timestamps }
        └──→ Indexed by userId for fast per-user queries

4. RESPONSE FLOWS BACK
   └──→ Created note document returned as JSON
        └──→ React state updates → UI re-renders instantly

5. USER RETRIEVES NOTES
   └──→ GET /api/notes → filtered by authenticated userId
        └──→ Client-side search filters results in real-time
```

> **Future:** Steps 2-3 will include AI processing — embedding generation, semantic indexing, and context linking — transforming this pipeline into an intelligent knowledge engine.

---

## 📐 API Design Philosophy

The API is designed around three principles:

1. **RESTful clarity** — resources map to nouns (`/notes`, `/auth`), actions map to HTTP verbs
2. **Consistent responses** — every endpoint returns predictable JSON structures
3. **Auth-first middleware** — protected resources are guarded at the route level, not inside controllers

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate and receive JWT |
| `GET` | `/api/auth/profile` | Get authenticated user profile |

### Notes (all protected)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notes` | List all notes for the authenticated user |
| `POST` | `/api/notes` | Create a new note |
| `PUT` | `/api/notes/:id` | Update an existing note |
| `DELETE` | `/api/notes/:id` | Permanently delete a note |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16+
- **MongoDB** (local instance or [Atlas](https://www.mongodb.com/atlas) cluster)
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/AnubhavGitHub07/notiq-ai.git
cd notiq-ai
```

```bash
# Install server dependencies
cd server
npm install
```

```bash
# Install client dependencies
cd ../client
npm install
```

### Configuration

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notiq-ai
JWT_SECRET=your_jwt_secret_here
```

### Run

```bash
# Terminal 1 — Start the backend
cd server
npm run dev

# Terminal 2 — Start the frontend
cd client
npm run dev
```

| Service | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:5000/api` |

---

## 🔮 Future Scope (V2+ Roadmap)

| Phase | Feature | Description |
|---|---|---|
| **V2** | Semantic Search | Embed notes using vector representations, retrieve by meaning instead of keywords |
| **V2** | AI Summarization | Auto-generate summaries for long-form notes |
| **V2** | Context Linking | Automatically detect and surface related notes |
| **V3** | Knowledge Graph | Visualize relationships between notes as an interactive graph |
| **V3** | Smart Retrieval | Ask natural language questions, get answers sourced from your notes |
| **V3** | Collaborative Notes | Real-time multi-user editing with conflict resolution |
| **V4** | Export & Integrations | PDF/Markdown export, API webhooks, third-party integrations |
| **V4** | Mobile App | React Native client with offline-first architecture |

---

## 🎯 Why This Project Matters

This isn't a tutorial CRUD app. It's an engineering foundation built with production patterns:

- **Layered architecture** — clean separation between routes, middleware, controllers, and models
- **Auth done right** — JWT + bcrypt + protected routes on both client and server
- **Error handling pipeline** — centralized async error handling without try-catch boilerplate
- **API design** — RESTful conventions, consistent response formats, middleware-first auth
- **Client architecture** — centralized API layer with interceptors, route guards, state management via hooks
- **AI-ready infrastructure** — the architecture is designed to integrate embedding pipelines, vector storage, and retrieval-augmented generation without refactoring core systems

> Built to demonstrate that full-stack engineering is more than connecting a form to a database — it's about building systems that are secure, maintainable, and ready to evolve.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### 👨‍💻 Author

**Anubhav**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AnubhavGitHub07)

---

⭐ **Star this repo** if you find it useful — it helps more than you think.

*Engineered with precision. Powered by curiosity.*

</div>
