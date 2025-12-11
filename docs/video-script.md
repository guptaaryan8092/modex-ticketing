# Video Script: Ticket Booking System

## 1. Introduction (0:00 - 0:30)
"Hi, I'm [Your Name]. This is my Ticket Booking System, a high-concurrency booking platform designed to handle real-time demand without race conditions.
I built this project to solve the classic 'double-booking' problem—where two users try to buy the same seat at the exact same moment. My system ensures data integrity using atomic database transactions and row-level locking."

## 2. Tech Stack & Architecture (0:30 - 1:00)
"Let's look at the tech stack.
- **Frontend**: I used React with Vite and Tailwind CSS for a responsive, modern UI. State is managed with Context API and optimizations like `useMemo` for performance.
- **Backend**: Node.js with Express.
- **Database**: PostgreSQL, managed via Sequelize ORM.
- **Infrastructure**: The app is containerized using Docker and deployed on Render (Backend) and Vercel (Frontend).
- **Architecture**: I used a specialized 'Shows' and 'Bookings' architecture where seat availability is calculated dynamically, ensuring 100% accuracy."

## 3. Deployment Walkthrough (1:00 - 3:00)
"Here is how I deployed the application.
**Backend**:
- I have a `Dockerfile.backend` that builds the Node.js app.
- On Render, I connected my GitHub repo and set the `DATABASE_URL` environment variable.
- The build command runs `npm install` and the start command defaults to `npm start`.
- I also configured a `pre-deploy` command to run database migrations, ensuring the schema is always up to date.

**Frontend**:
- Deployed on Vercel.
- I set the `VITE_API_URL` environment variable to point to my Render backend.
- Vercel handles the build automatically, serving the optimized assets via their CDN."

## 4. Demo: User Flow (3:00 - 4:15)
"Now for the demo.
**Admin**:
- First, I'll log in as Admin.
- I'll create a new show: 'Avengers Premiere' at 8:00 PM with 50 seats.
- You can see the validation logic here preventing invalid inputs.
- Once created, it appears instantly on the dashboard.

**User**:
- Switching to the User view (Home Page).
- I see the new show. I click 'Book Tickets'.
- This is the **Seat Map**. Notice the layout adapts to the screen size.
- I'll select seats 1, 2, and 3.
- As I confirm, you'll see an **Optimistic UI update**—the seats turn 'Booked' immediately for a snappy feel, while the API confirms in the background."

## 5. Concurrency & Challenges (4:15 - 5:00)
"The biggest challenge was Concurrency.
- What happens if I try to book Seat 5, and another user tries to book Seat 5 at the same millisecond?
- To test this, I wrote a script that fires 10 simultaneous booking requests for the same seat.
- **Solution**: I implemented a Postgres Transaction with `REPEATABLE READ` isolation (or explicit locking). The database locks the target row. The first request succeeds, and the other 9 fail gracefully with a 'Seat taken' error.
- You can see this in the logs here—only one `CONFIRMED`, the rest `FAILED`."

## 6. Conclusion (5:00 - 5:30)
"In summary, this project demonstrates end-to-end full-stack development, from designing complex database interactions to building a polished, accessible frontend.
The code is available on my GitHub at [Your Repo Link], and the live demo is at [Your Vercel Link]. Thanks for watching!"
