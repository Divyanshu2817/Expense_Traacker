# 💎 AuraFinance — MERN Expense Tracker & Personal Finance App

<div align="center">

![AuraFinance Banner](https://img.shields.io/badge/AuraFinance-Next--Gen%20Finance%20App-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0yMSAxOFY3YTIgMiAwIDAgMC0yLTJINWEyIDIgMCAwIDAtMiAydjExIi8+PC9zdmc+)

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-ES%20Modules-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4-FF6384?style=flat-square&logo=chartdotjs)](https://www.chartjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

**A full-stack personal finance tracker built with the MERN stack, featuring AI financial health scoring, subscription leak detection, and stunning glassmorphism UI.**

[Live Demo](#-running-the-app) · [Features](#-features) · [API Docs](#-api-endpoints) · [Tech Stack](#%EF%B8%8F-tech-stack)

</div>

---

## 📸 Screenshots

| Dashboard | Charts & Analytics |
|---|---|
| KPI cards with income/expense metrics | Interactive Doughnut, Bar & Line charts via Chart.js |

| AI Financial Coach | Subscription Radar |
|---|---|
| 0–100 Health Score + What-If Simulator | Subscription leak detection & annual cost analysis |

---

## ✨ Features

### 💰 Core Finance Management
- **Add Income & Expenses** — Simplified forms per type (Income: Amount + Category + Date only)
- **Transaction History** — Filterable and searchable log with category tags
- **Real-Time KPI Dashboard** — Live Total Income, Total Expenses, Net Balance, and Savings Rate
- **Indian Rupee (₹)** — All values formatted with `en-IN` locale

### 📊 Data Visualization (Chart.js)
- **Doughnut Chart** — Spending breakdown by category with ₹ tooltips
- **Bar Chart** — Monthly Income vs. Expense comparison
- **Line Chart** — Cash flow spending trajectory over time

### 🧠 AI Financial Coach *(Unique)*
- **0–100 Health Score** — Weighted scoring across 4 pillars:
  | Pillar | Weight |
  |---|---|
  | Savings Rate | 35 pts |
  | Budget Compliance | 35 pts |
  | Fixed Obligation Burden | 15 pts |
  | Discretionary Velocity | 15 pts |
- **Tier Badges** — Platinum / Gold / Silver / Needs Focus
- **Smart AI Recommendations** — Auto-generated insights based on spending patterns
- **"What-If" Scenario Simulator** — Interactive sliders to project monthly/annual liquidity gains

### 📡 Subscription Radar *(Unique)*
- Auto-detects recurring charges and subscription services
- Calculates total **monthly drain** and **annual commitment**
- Flags **High-Cost Leak Risks** (> ₹500/month)
- Estimates potential audit savings

### 🏆 Savings Goal Tracker
- Create custom savings milestones (Travel, Emergency Fund, Gadgets, etc.)
- Progress meters with percentage bars
- Quick deposit actions (+₹1,000 / +₹5,000 buttons)
- **Confetti celebration** 🎉 when a goal is 100% funded

### 💼 Budget Manager
- Set monthly spending caps per category
- Configurable alert threshold (e.g., warn at 80%)
- Color-coded progress bars: Green (Healthy) → Yellow (Warning) → Red (Over Budget)

### 🔐 User Authentication
- Register with Name, Email, and Password
- Secure Login with session persisted in `localStorage`
- User-scoped data — transactions, budgets, and goals are tied to logged-in user

### 🔧 Resilient Architecture
- **MongoDB Fallback**: If MongoDB is offline, the app automatically switches to an in-memory JSON file store with zero downtime

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, Lucide React Icons, Canvas Confetti |
| **Charts** | Chart.js 4, react-chartjs-2 |
| **Backend** | Node.js (ESM), Express 4 |
| **Database** | MongoDB with Mongoose ODM |
| **Fallback DB** | In-memory JSON file store (`data_fallback.json`) |
| **Styling** | Vanilla CSS (Glassmorphism, dark mode, custom design system) |
| **Fonts** | Inter + Outfit (Google Fonts) |
| **Auth** | Header-based user scoping (`x-user-id`) |

---

## 📁 Project Structure

```
expense/
│
├── server/                          # Express + Node.js Backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection with auto fallback
│   ├── controllers/
│   │   ├── analyticsController.js   # Summary, Health Score, Subscription Radar
│   │   ├── authController.js        # Login & Registration
│   │   ├── budgetController.js      # Budget CRUD
│   │   ├── goalController.js        # Goals CRUD
│   │   └── transactionController.js # Transaction CRUD
│   ├── models/
│   │   ├── Budget.js                # Mongoose Budget schema
│   │   ├── Goal.js                  # Mongoose Goal schema
│   │   ├── Transaction.js           # Mongoose Transaction schema
│   │   └── User.js                  # Mongoose User schema
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── goalRoutes.js
│   │   └── transactionRoutes.js
│   ├── utils/
│   │   └── store.js                 # In-memory fallback store engine
│   ├── data_fallback.json           # Auto-generated persistent JSON store
│   ├── package.json
│   └── server.js                    # Express app entry point
│
└── client/                          # React + Vite Frontend
    ├── src/
    │   ├── components/
    │   │   ├── AuthModal.jsx         # Login & Register modal
    │   │   ├── BudgetManager.jsx     # Budget setup & progress meters
    │   │   ├── Dashboard.jsx         # KPI cards & recent activity
    │   │   ├── ExpenseFormModal.jsx  # Add Income / Expense form
    │   │   ├── FinancialCoach.jsx    # AI score + What-If simulator
    │   │   ├── GoalTracker.jsx       # Savings goals & milestones
    │   │   ├── Navbar.jsx            # Navigation & user controls
    │   │   ├── SubscriptionRadar.jsx # Subscription leak detector
    │   │   ├── TransactionList.jsx   # Filterable transaction log
    │   │   └── VisualCharts.jsx      # Chart.js data visualizations
    │   ├── services/
    │   │   └── api.js               # Fetch API client with auth headers
    │   ├── styles/
    │   │   └── main.css             # Glassmorphism design system
    │   ├── App.jsx                  # Root app layout & state management
    │   └── main.jsx                 # React DOM entry point
    ├── index.html
    ├── vite.config.js               # Vite config with /api proxy to port 5000
    └── package.json
```

---

## 🚀 Running the App

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ installed
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (optional — app works without it)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
```

```bash
# Install backend dependencies
cd server
npm install
```

```bash
# Install frontend dependencies
cd ../client
npm install
```

### 2. Start Backend Server

```bash
cd server
npm start
```

> 🚀 Backend running at `http://localhost:5000`  
> If MongoDB is not running, the app auto-switches to the JSON fallback engine.

### 3. Start Frontend Dev Server

```bash
cd client
npm run dev
```

> 🌐 Frontend running at `http://localhost:3000`

---

## 🌍 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login with email & password |
| `GET` | `/api/auth/me` | Get current user session |

### Transactions
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/transactions` | Get all transactions (with filters: category, type, search, date range) |
| `POST` | `/api/transactions` | Create a new transaction |
| `PUT` | `/api/transactions/:id` | Update a transaction |
| `DELETE` | `/api/transactions/:id` | Delete a transaction |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/summary` | Income, expense, balance, chart data |
| `GET` | `/api/analytics/health` | AI financial health score & insights |
| `GET` | `/api/analytics/subscriptions` | Subscription radar analysis |
| `POST` | `/api/analytics/reset` | Reset to default sample dataset |

### Budgets
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/budgets` | Get all budgets |
| `POST` | `/api/budgets` | Create or update a budget |
| `DELETE` | `/api/budgets/:id` | Delete a budget |

### Goals
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/goals` | Get all savings goals |
| `POST` | `/api/goals` | Create a new goal |
| `PUT` | `/api/goals/:id/progress` | Update a goal's current amount |
| `DELETE` | `/api/goals/:id` | Delete a goal |

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health status check |

---

## 📊 Financial Health Score — How It Works

```
Score (0–100) = Savings Score + Budget Score + Fixed Burden Score + Discretionary Score

┌────────────────────────────┬────────────┬────────────────────────────┐
│ Component                  │ Max Points │ Criteria                   │
├────────────────────────────┼────────────┼────────────────────────────┤
│ Savings Rate               │ 35         │ ≥30% income saved = 35 pts │
│ Budget Compliance          │ 35         │ -10 pts per over-budget cat │
│ Fixed Obligation Burden    │ 15         │ Recurring % of income       │
│ Discretionary Velocity     │ 15         │ Dining Out % of expense     │
└────────────────────────────┴────────────┴────────────────────────────┘

Tier Badges:
  💎 Financial Platinum  →  85–100
  🥇 Financial Gold      →  70–84
  🥈 Financial Silver    →  50–69
  📉 Needs Focus         →  0–49
```

---

## 🔑 Environment Variables (Optional)

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/expense_tracker
```

---

## 🎯 Quick Demo Login

You can use the built-in demo credentials for instant access:

| Field | Value |
|---|---|
| Email | `demo@aurafinance.com` |
| Password | `password123` |

Or use the **Reset Sample Data** button (↺) in the Navbar to restore the default Indian Rupee-based dataset.

---

## 👨‍💻 Built With

- **React 18** — Component-based UI
- **Express.js** — RESTful API server
- **MongoDB + Mongoose** — Document database with schemas
- **Chart.js + react-chartjs-2** — Data visualization
- **Lucide React** — Icon library
- **Canvas Confetti** — Goal achievement celebrations
- **Google Fonts (Inter + Outfit)** — Premium typography
- **Vanilla CSS (Glassmorphism)** — Custom dark-mode design system

---

<div align="center">

Made with 💜 using the MERN Stack · Chart.js · Glassmorphism UI

</div>
