# VAULT — Finance Dashboard

A clean, interactive personal finance dashboard built with React + Vite. Designed to help users track transactions, visualise spending patterns, and understand their financial health — all in a dark, metallic UI with smooth animations and thoughtful UX touches.

---

## Live Demo / Repository

https://zorvyn-finance-dashboard-tek-6-fepm.vercel.app/

---

## Screenshots

<img width="1916" height="916" alt="image" src="https://github.com/user-attachments/assets/7a9c8452-cd4d-4ee6-983a-cfa42c51f645" />
<img width="1920" height="900" alt="image" src="https://github.com/user-attachments/assets/9ef59d44-34bd-4e37-ab5e-6cbb85068682" />
<img width="1907" height="907" alt="image" src="https://github.com/user-attachments/assets/7e12b22c-30d9-42da-a11b-4fab292a2e04" />
<img width="1911" height="547" alt="image" src="https://github.com/user-attachments/assets/54018397-e545-4636-b76d-4c01b38bf2ae" />





## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v3 + custom CSS design system |
| Charts | Recharts |
| Animations | Framer Motion |
| State | React Context + useReducer |
| Persistence | localStorage (`vault_v2` key) |
| Fonts | Outfit (body) · Space Mono (data/labels) |

---

## Features

### Dashboard Overview
- Animated balance hero card with a 3D spinning vault coin
- Count-up number animations on all financial metrics
- 3D tilt effect on metric cards (mouse-tracking)
- 6-month income vs. expenses area chart (step style, Recharts)
- Interactive donut chart with hover-reveal percentage labels

### Transactions
- Full transaction ledger with date, merchant, category, type, and amount
- Search by merchant or category name
- Filter by type (All / Income / Expense)
- Sort by date (newest/oldest) or amount (high/low)
- Animated row enter/exit transitions (Framer Motion layout)
- Anomaly detection — transactions 2× above their category average are flagged with a warning badge
- One-click delete with a 5-second undo toast

### Role-Based UI (Frontend Simulation)
- **Admin** — can add and delete transactions; all controls active
- **Viewer** — read-only; add/delete buttons disabled; a persistent read-only badge is shown
- Role can be switched instantly via the toggle in the Overview header or the Settings page
- Role is persisted to localStorage so it survives page refreshes

### Insights & Intelligence
- Custom SVG donut chart — spending breakdown by category
- Budget utilisation rings — animated SVG progress circles per category
- Savings rate progress bar
- Month-over-month expense delta (%)
- Daily burn rate and projected monthly spend
- Anomaly count (transactions significantly above category average)
- "Vault Insight" — a contextual tip generated from the current financial state

### Analytics View
- Full-width 6-month chart combined with the complete insights panel

### Settings
- Role toggle with distinct Admin / Viewer styling
- Export transactions as **JSON** or **CSV** (client-side file download)
- Reload mock data or wipe the vault entirely

### Optional Enhancements Implemented
- Dark mode only (intentional design — obsidian/gunmetal palette)
- Data persistence via localStorage
- Export to CSV and JSON
- Framer Motion animations throughout (page transitions, modal spring, row enter/exit, budget rings)
- Keyboard shortcuts: `N` → new entry · `/` → focus search · `Esc` → close modal
- Undo delete with animated progress-bar toast
- Empty state with floating "VAULT EMPTY" prompt and mock data initialiser
- Mobile responsive with slide-in sidebar and hamburger toggle

---

## Project Structure

```
zorvyn/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.cjs
├── eslint.config.js
└── src/
    ├── main.jsx                  # Entry point
    ├── App.jsx                   # Root — wraps app in FinanceProvider
    ├── index.css                 # Global design system (CSS vars, glass cards, buttons, etc.)
    ├── App.css                   # Template remnants (unused in production)
    ├── context/
    │   └── FinanceContext.jsx    # Global state via useReducer + localStorage sync
    ├── data/
    │   └── mockData.js           # 24 seed transactions, category list, budgets, chart data
    ├── hooks/
    │   ├── useFinance.js         # Derived state: filtering, sorting, summary calculations
    │   ├── useCountUp.js         # RAF-based number animation hook
    │   └── useKeyboardShortcuts.js  # Global keyboard listener (N / / / Esc)
    ├── utils/
    │   └── exportUtils.js        # JSON and CSV file download helpers
    ├── pages/
    │   └── Dashboard.jsx         # Main page — view routing, layout, top bar
    └── components/
        ├── Sidebar.jsx           # Fixed left nav with mobile overlay
        ├── MetricCard.jsx        # 3D tilt summary card
        ├── VaultCoin.jsx         # 3D CSS spinning coin
        ├── AreaChartComponent.jsx # Recharts area chart with custom tooltip
        ├── InsightsPanel.jsx     # Donut chart, budget rings, intelligence stats
        ├── TransactionTable.jsx  # Ledger with search, filter, sort, delete
        ├── AddTransactionModal.jsx # Spring-animated modal for new entries
        ├── UndoToast.jsx         # Timed undo notification with progress bar
        └── Icons.jsx             # Zero-dependency SVG icon library (20+ icons)
```

---

## Setup & Installation

**Prerequisites:** Node.js 18+

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd zorvyn

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## State Management Approach

State is managed with a single `useReducer` in `FinanceContext.jsx`, exposed via React Context. The reducer handles:

| Action | Effect |
|---|---|
| `INITIALIZE` | Load the 24 seed transactions |
| `LOAD_STATE` | Restore from localStorage on mount |
| `ADD_TRANSACTION` | Prepend new entry |
| `DELETE_TRANSACTION` | Remove entry; push to undo stack (max 10) |
| `UNDO_DELETE` | Splice restored entry back at original index |
| `CLEAR_UNDO` | Clear undo stack after toast expires |
| `SET_ROLE` | Switch between admin and viewer |
| `RESET` | Wipe all transactions |

The `useFinance` hook consumes the context and derives all computed values (filtered list, category totals, budget utilisation, anomalies, monthly deltas) via `useMemo` — so expensive calculations only re-run when `transactions` changes.

UI state (active view, modal open, mobile sidebar) lives locally in `Dashboard.jsx` with `useState`, keeping global state minimal and focused on data.

---

## Design Decisions

**Metallic dark theme** — The entire palette is built around gunmetal, chrome, and obsidian tones using CSS custom properties. This gives the dashboard a premium, data-terminal aesthetic that suits a financial product.

**Space Mono for data, Outfit for prose** — Monospace fonts on numbers and labels improve scanability in financial tables. Outfit provides warmth in headings and descriptions.

**Custom SVG icon library** — Rather than shipping a full icon package, `Icons.jsx` defines 20+ geometric SVG icons inline. Zero extra bundle weight, fully themeable via `currentColor`.

**Undo over confirmation dialogs** — Deleting a transaction shows a 5-second undo toast instead of asking "are you sure?". This is faster and less disruptive, and is standard in modern productivity UIs.

**Anomaly detection** — Transactions more than 2× the average for their category are flagged. This gives the Intelligence view a practical signal without needing a backend.

---

## Assumptions Made

- All monetary values are in Indian Rupees (INR). `en-IN` locale formatting is used throughout.
- The 6-month area chart uses static seed data (`MONTHLY_CHART_DATA`) to show historical trends, since the mock transactions only span ~3 months.
- Budgets are fixed per category in `mockData.js`. In a real app these would be user-configurable.
- Role switching is client-side only — no authentication is implemented, as specified in the brief.

---

## Assignment Criteria Coverage

| Criterion | Implementation |
|---|---|
| Dashboard Overview | Balance hero, metric cards, area chart, donut chart |
| Transactions Section | Ledger with search, filter by type, sort by date/amount |
| Role-Based UI | Admin (full access) / Viewer (read-only), toggle in header and settings |
| Insights Section | Top expense, MoM delta, savings rate, daily burn, projected spend, contextual tip |
| State Management | Context + useReducer + useMemo derived state + localStorage persistence |
| UI/UX | Dark design system, mobile responsive, empty/no-result states, keyboard shortcuts |
| Optional — Export | JSON and CSV download |
| Optional — Animations | Framer Motion throughout — modal, rows, cards, budget rings, page transitions |
| Optional — Persistence | localStorage sync on every state change |
