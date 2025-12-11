# Ticket Booking Frontend

A React + TypeScript application for booking tickets.

## Tech Stack
- React
- Typescript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (Icons)

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run development server:
    ```bash
    npm run dev
    ```

## Features
- **Home**: List all available shows.
- **Booking**: Interactive seat selection for a specific show.
- **Admin**: Dashboard to create shows and run maintenance tasks.
- **Auth**: Mock authentication (toggle via Login button in navbar).

## Configuration
- API URL is configured in `src/contexts/ShowsContext.tsx` (default: `http://localhost:3000`).
