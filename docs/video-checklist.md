# Video Recording Checklist

## Preparation
- [ ] **Close Unnecessary Tabs**: Keep only the Demo, Github, Vercel, and Render/Railway dashboards open.
- [ ] **Clean Database**: (Optional) Truncate tables or create a fresh show for the demo so it looks clean.
- [ ] **Reset Local Data**: Clear browser cache or incognito mode to show fresh login state.

## Browser Tabs to Open
1.  **Frontend (Deployed)**: The Vercel URL (e.g., `https://project.vercel.app`).
2.  **Frontend (Localhost)**: `http://localhost:5173` (Backup for faster demo if needed).
3.  **Code Editor (VS Code)**: Open to `backend/services/bookingService.js` (to show transaction logic).
4.  **GitHub Repo**: Main page.
5.  **Vercel Dashboard**: Showing the successful deployment.
6.  **Render/Railway Dashboard**: Showing the active web service and logs.

## Recording Sequence
1.  **Start Recording**: Check mic levels.
2.  **Intro**: Face camera or Show GitHub Readme.
3.  **Code Walkthrough**:
    - Show `backend/models`.
    - Show `frontend/src/App.tsx`.
    - Show `docker-compose.yml`.
4.  **Deployment**:
    - Show env vars in Vercel settings.
    - Show env vars in Render settings (blur secrets if needed, or mention them).
5.  **Demo**:
    - Admin: Create Show.
    - User: Book Seats.
    - *Optional*: Open two windows side-by-side to show real-time "Booked" status update if you implemented websockets/polling (We have polling).
6.  **Concurrency**:
    - Show the `backend/tests/concurrency.test.js` or `debug` script.
    - Run it in terminal: `npm test` to show it passing.
7.  **Expiry**:
    - Mention the cron job.
8.  **Wrap up**: Show live URL again.

## Post-Recording
- [ ] Watch playback to check audio clarity.
- [ ] Check if code text size was readable (Zoom in VS Code if needed).
