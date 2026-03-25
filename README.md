# Personal Finance Tagging System

A mobile-first personal expense tracker that supports multi-tagging (e.g. `#food #fun`) with local persistence and tag-based analytics.

## Features

### Transaction Entry & Management
- Add transactions with:
  - **Title**
  - **Amount** (positive numbers only)
  - **Date** (defaults to today)
  - **Tags** (required, multiple allowed)
- Tag input is **space-separated**.
  - Auto-adds `#` if missing
  - Case-insensitive (stored lowercase)
  - Deduplicated
  - Ignores stop-words: `and`, `ve`, `ile`  
    Example: `work and fun` → `#work #fun`
- Edit transactions in a native **`<dialog>` modal**
- Delete transactions with a **confirmation dialog**

### Transaction History
- Chronological list (most recent first)
- **Total Spent** shown at the top
- Tag filter via URL query:
  - `/history?tag=%23food`
- Clear filter control

### Spending Summary & Analytics (Dashboard)
- Total spent per tag
- Percentage of total spending per tag
- Click a tag to open History filtered by that tag

### Data Persistence
- Stored in `localStorage` under the key:
  - `pfts.transactions.v1`

## Tech Stack
- React + Vite (JavaScript)
- React Router
- Vitest + React Testing Library

## Getting Started
```bash
npm install
npm run dev

Open the URL Vite prints (usually http://localhost:5173).


Scripts
npm run dev — start dev server

npm run build — production build

npm run preview — preview production build

npm run lint — lint

npm run test:run — run tests once

Notes
Currency formatting uses tr-TR / TRY.
