# Product Requirements Document (PRD): Playmaker Project

## 1. Product Overview
**Product Name:** Playmaker
**Description:** A sports betting tracking application that allows users to view real-time NBA odds, track their betting predictions, and analyze their performance over time.
**Goal:** To provide a seamless, modern interface for sports enthusiasts to simulate and track betting strategies without financial risk.

## 2. Technical Architecture & Stack
**Frontend Framework:** Next.js (React)
**Backend Framework:** FastAPI (Python)
**Language:** TypeScript / JavaScript (Frontend), Python (Backend)
**Database & Auth:** Supabase (PostgreSQL)
**Styling:** Tailwind CSS (Recommended for Next.js) or React Bootstrap (Legacy)
**Deployment:** Vercel (Frontend), Render/Railway/AWS (Backend)

### Key Architectural Changes (Migration to Next.js & FastAPI)
*   **Routing:** Move from `react-router-dom` to Next.js App Router (file-system based routing).
*   **Rendering:** Utilize Server Components (RSC) for initial data fetching to improve performance and SEO.
*   **API Handling:** Frontend requests are proxied to the FastAPI backend, which handles external services.

## 3. Core Features

### 3.1. Odds Browsing (Home/Landing)
*   **Functionality:** Display real-time NBA betting odds.
*   **Data Source:** The Odds API.
*   **Requirements:**
    *   Fetch upcoming games, spreads, moneyline, and totals.
    *   **Security Upgrade:** API calls must be proxied through the FastAPI backend to hide the `ODDS_API_KEY`.

### 3.2. Prediction Management
*   **Functionality:** Users can "lock in" predictions based on available odds.
*   **Actions:**
    *   **Create:** Select a team/outcome and save it.
    *   **Read:** View list of pending and settled predictions.
    *   **Update:** Mark predictions as won/lost (or automate via API).
    *   **Delete:** Remove a prediction.
*   **Storage Strategy:**
    *   *Primary:* Supabase Database (PostgreSQL).
    *   *Fallback:* Browser `localStorage` (only for guest users if applicable).

### 3.3. Dashboard & Analytics
*   **Functionality:** Visual overview of user performance.
*   **Metrics:** Win/Loss record, total predictions, accuracy percentage.

### 3.4. User Profile
*   **Functionality:** User authentication and settings management.
*   **Features:**
    *   **Authentication:** Sign up, Login, Logout using Supabase Auth.
    *   **Profile:** Manage user details and clear history.

## 4. Data Requirements

### 4.1. External APIs
*   **The Odds API:**
    *   Endpoint: `/v4/sports/basketball_nba/odds`
    *   Rate Limit Handling: Implement caching in Next.js (Data Cache) to minimize quota usage.

### 4.2. Data Models (Prediction)
```typescript
interface Prediction {
  id: string;
  eventId: string;
  sportKey: string;
  homeTeam: string;
  awayTeam: string;
  selectedTeam: string;
  betType: 'h2h' | 'spread' | 'totals';
  odds: number;
  status: 'pending' | 'won' | 'lost';
  timestamp: string;
}
```

## 5. Migration Plan (Vite to Next.js & FastAPI)
1.  **Initialize:** Create new Next.js project (Frontend) and FastAPI project (Backend).
2.  **Supabase Setup:** Initialize Supabase project, configure Auth, and set up Database tables.
3.  **Port Components:** Move `src/components` to Next.js structure, converting to Server Components where possible.
4.  **Backend Setup:** Create FastAPI endpoints to handle external API calls securely.
5.  **State Management:** Replace `predictionStorage.js` with Supabase client calls for data persistence.
5.  **Styling:** Configure global styles and component-level CSS.

## 6. Security & Performance
*   **API Key Protection:** STRICT REQUIREMENT. The Odds API key must strictly reside in the FastAPI backend environment variables (`.env`) and never be exposed to the client.
*   **Caching:** Implement caching in FastAPI (e.g., using Redis or in-memory) to prevent hitting rate limits.
