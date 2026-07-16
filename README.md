<div align="center">
<h1 align="center">⛓️‍💥 NEXUS ⛓️‍💥</h1>
### The Ultimate Club Management Ecosystem for AIT Pune

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Frontend](https://img.shields.io/badge/React-18-blue.svg?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Explore the Platform](#-getting-started) • [Ecosystem](#-ecosystem) • [Feature Set](#-features)

</div>

---

## 🔒 Overview

**NEXUS** is not just another dashboard—it's the absolute central nervous system for all student organizations at the Army Institute of Technology, Pune. Built for speed, scale, and modern aesthetics, it unifies the fragmented club ecosystem into a single, seamless, high-performance platform.

## ✨ Ecosystem

The NEXUS infrastructure is split into discrete, highly-optimized components to ensure maximum velocity and maintainability:

| Module | Description | Repository |
|-----------|-------------|------------|
| **NEXUS Frontend** | The core visual application for end-users, built with React + Vite. | [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Jitesh-Yadav01/NEXUS) |
| **NEXUS Backend API** | Robust, scalable Express.js REST API powering the entire system. | [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MyTricks-code/sync-backend-api) |

## 🚀 Getting Started

Initialize the frontend environment to experience NEXUS locally..

First, clone and install dependencies:

```bash
git clone https://github.com/Jitesh-Yadav01/NEXUS.git
cd NEXUS/frontend
npm install
```

Configure your environment variables:

```ini
# Create a .env file in the frontend/ root directory
VITE_API_URL=http://localhost:4000
```

Ignite the development server:

```bash
npm run dev
```

> **Note**: For the full experience, ensure the [Backend API](https://github.com/MyTricks-code/sync-backend-api) is also running simultaneously.

## 🔑 Authentication

Applicants (students) **must sign in via Google OAuth**. Email/password
registration and login are intentionally disabled. The code for these flows
is preserved as comments and can be re-enabled if needed:

| File | What is commented out |
|------|-----------------------|
| `frontend/src/pages/Auth/Login.jsx` | Email/password form (inputs + submit) |
| `frontend/src/pages/Auth/SignUp.jsx` | Registration form (name/email/password/year + submit) |
| `frontend/src/pages/Auth/VerifyAccount.jsx` | Full OTP verification page (route removed) |
| `frontend/src/context/AuthContext.jsx` | `login`, `signUp`, `sendVerifyOtp`, `verifyAccount` implementations |
| `frontend/src/Routes/PublicRoutes.jsx` | `/verify-account` route |
| `sync-backend/routes/authRoutes.js` | `POST /register /login /verify-otp /verify-account /forget-password /verify-forget-otp` |
| `sync-backend/controllers/userController.js` | `createUser`, `loginUser`, `sendVerifyOtp`, `verifyAccount`, `sendForgetPasswordOtp`, `verifyForgotPasswordOtp` |

---

## 🛠️ Features

- ⚡️ **Hyper-Responsive Design**: Instantly adapts from ultra-wide monitors to the absolute smallest mobile devices without breaking a sweat.
- **Sleek, Dark Aesthetics**: A beautiful, meticulously crafted dark-mode-first UI that feels premium and immersive.
- 👥 **Contextual Role Access**: Intelligently renders distinct dashboards depending on whether the user is a Core Member, Tech Executive, or regular attendee.
- 🗓️ **Infinite Event Tracking**: Never miss a beat. Track past activities, upcoming hackathons, and exclusive technical sessions.
- 🏫 **Unified Club Hub**: Deep integrations and dedicated spaces for OSS, GDG AIT Pune, CP Club, and more.

## 🧱 Architecture Layout

```text
NEXUS/
└── frontend/
    ├── src/
    │   ├── assets/       # Visual media & theme assets
    │   ├── components/   # Reusable UI primitives
    │   ├── pages/        # High-level route views
    │   ├── sections/     # Complex page layouts
    │   └── context/      # Global state (Auth, Theme)
    └── public/           # Raw static assets
```

---

<div align="center">
  <sub>Forged with ❤️ by GDG AIT Pune.</sub>
</div>
