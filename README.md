# 🌐 ElectionOS Infinity

> **Autonomous Swarm Intelligence for Civic Education**

A modern, AI-powered civic education platform built with React and powered by Google Gemini. ElectionOS Infinity helps citizens understand elections, voting systems, and democratic processes through interactive AI tools.

**Live Demo:** https://electionos-626471357617.us-central1.run.app

---

## ✨ Features

### 🤖 AI Tutor
An intelligent conversational agent powered by Gemini 2.0 Flash. Ask anything about elections, voting rights, the US Constitution, or global democratic systems. Every response follows a structured format:
- 📌 Brief Overview
- 🔍 Detailed Deep Dive
- 💡 Key Takeaways

Includes a local knowledge base fallback for offline/rate-limited scenarios.

### 🏆 Quiz Arena
Dynamically generated civic knowledge quizzes using AI. Features:
- 10 unique questions per session
- Multiple difficulty levels (easy, medium, hard)
- Topic-based generation (Electoral Systems, US Constitution, Voting Rights, etc.)
- XP rewards for correct answers
- Detailed explanations for every answer

### ⚡ Election Simulator
Run realistic "what-if" election scenarios powered by AI. Input any scenario and get:
- Probability-weighted outcomes
- Key influencing factors
- In-depth analysis
- Confidence score

### 🌍 3D Globe
An interactive 3D globe built with Three.js and react-globe.gl to visually explore global elections and democratic data around the world.

### 📊 Dashboard
Personalized mission control showing:
- XP earned and quiz stats
- AI query count and average response latency
- Quick launch to all features
- Intelligence Swarm status panel

### 👤 Profile
User profile with stats tracking, XP progression, and session history.

---

## 🧠 AI Agent Architecture

The platform uses a multi-agent swarm system orchestrated through a single store:

| Agent | Role |
|---|---|
| Master Orchestrator | Routes queries to the right agent |
| Teacher Agent | Handles general civic education Q&A |
| Quiz Agent | Generates structured quiz questions |
| Fact-Checker | Validates information accuracy |
| Simulator | Runs election scenario modeling |
| Safety Guardian | Ensures neutral, unbiased responses |

All agents use **Gemini 2.0 Flash** via the Google Generative Language API with exponential backoff retry logic for rate limiting.

---

## 🔐 Authentication

- Google OAuth via Firebase Authentication
- Email/Password sign up and sign in
- Demo access mode (no account required)
- Session timeout with 5-minute countdown
- Persistent sessions via `browserLocalPersistence`

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8 |
| Routing | React Router DOM v7 |
| State Management | Zustand |
| AI | Google Gemini 2.0 Flash |
| Auth & DB | Firebase (Auth + Firestore) |
| 3D Rendering | Three.js, @react-three/fiber, react-globe.gl |
| Animations | Framer Motion |
| Charts | Recharts |
| HTTP | Axios with axios-retry |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Containerization | Docker + Nginx |
| Deployment | Google Cloud Run |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/eganesh12/ELECTIONOS-INFINITY.git
cd ELECTIONOS-INFINITY
npm install
npm run dev
```

App runs at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

---

## 🐳 Docker

Build and run locally with Docker:

```bash
docker build -t electionos .
docker run -p 8080:8080 electionos
```

The app will be available at `http://localhost:8080`

---

## ☁️ Deployment (Google Cloud Run)

```bash
gcloud run deploy electionos \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --project YOUR_PROJECT_ID
```

---

## 📁 Project Structure

```
electionos/
├── src/
│   ├── pages/
│   │   ├── AuthPage.jsx        # Login / Sign up with Google OAuth
│   │   ├── DashboardPage.jsx   # Main mission control dashboard
│   │   ├── TutorPage.jsx       # AI chat tutor
│   │   ├── QuizPage.jsx        # Quiz arena
│   │   ├── SimulatorPage.jsx   # Election scenario simulator
│   │   ├── GlobePage.jsx       # Interactive 3D globe
│   │   └── ProfilePage.jsx     # User profile & stats
│   ├── components/
│   │   ├── Layout.jsx          # App shell with sidebar
│   │   └── Sidebar.jsx         # Navigation sidebar
│   ├── store/
│   │   ├── agentStore.js       # AI agent logic & state
│   │   └── authStore.js        # Firebase auth state
│   ├── firebase.js             # Firebase configuration
│   └── App.jsx                 # Routes & auth guard
├── Dockerfile                  # Multi-stage Docker build
├── nginx.conf                  # Nginx config for SPA routing
└── vite.config.js              # Vite build config
```

---

## 🌐 Environment

Firebase config is embedded in `src/firebase.js`. For production, move sensitive keys to environment variables using Vite's `import.meta.env`.

---

## 📄 License

MIT
