# Backend - Ticket Booking System

## Setup

1.  Copy `.env.example` to `.env` and configure your database credentials.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run migrations:
    ```bash
    npx sequelize-cli db:migrate
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```

### Booking Concurrency Handling

We use **Pessimistic Locking** (Row-level locking) to handle concurrent bookings.
When a booking request is received:
1. A `PENDING` booking record is continually created.
2. A Database Transaction is started.
3. The specific `Shows` row is locked using `SELECT ... FOR UPDATE`. This prevents other transactions from reading the `booked_seats` of this show until the current transaction completes.
4. We check if the requested seats are already present in the `booked_seats` array of the `Show`.
5. If available, we update `booked_seats` and set the booking status to `CONFIRMED`.
6. If not available, the transaction rolls back, and the booking is marked as `FAILED`.

This ensures that even if multiple requests successfully pass the initial service layer checks, the database lock ensures they are processed serially for the critical "check then update" section, preventing overbooking.

### Booking Expiry
A background worker runs every 30 seconds to clean up `PENDING` bookings that have not been confirmed within 2 minutes. These bookings are marked as `FAILED`.

You can also manually trigger this process:
**POST** `/admin/run-expiry`

## Docker Support

We provide a `docker-compose.yml` to easily spin up the backend and a Postgres database.

1.  **Run with Docker Compose**:
    ```bash
    docker-compose up --build
    ```
    This will start the database on port 5432 and the backend server on port 3000. It also automatically runs migrations.

2.  **API Documentation**:
    A Postman collection is available at `docs/postman_collection.json`. Import this file into Postman to test the API endpoints.

## API Endpoints

### Create a Show
**POST** `/admin/shows`

Example using curl:
```bash
curl -X POST http://localhost:3000/admin/shows \
  -H "Content-Type: application/json" \
  -d '{"name": "The Lion King", "start_time": "2025-12-25T19:00:00Z", "total_seats": 100}'
```

Response:
```json
{
  "id": "uuid",
  "name": "The Lion King",
  "start_time": "2025-12-25T19:00:00.000Z",
  "total_seats": 100,
  "createdAt": "...",
  "updatedAt": "..."
}
```

### List Shows
**GET** `/shows`

Example using curl:
```bash
curl http://localhost:3000/shows
```

Response:
```json
[
  {
    "id": "uuid",
    "name": "The Lion King",
    "start_time": "2025-12-25T19:00:00.000Z",
    "total_seats": 100,
    "createdAt": "...",
    "updatedAt": "...",
    "confirmed_seats_count": 0,
    "available_seats": 100
  }
]
```
