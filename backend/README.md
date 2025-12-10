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
