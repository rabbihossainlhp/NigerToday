# NigerToday frontend

## Run locally

1. Start the backend on port `3000` with its MongoDB and JWT environment variables configured.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` to the backend API base URL.
3. Install frontend dependencies with `npm install`, then run:

   ```bash
   npm run dev -- --port 3001
   ```

4. Open [http://localhost:3001](http://localhost:3001).

The login screen uses the backend `/auth/login` API. You must use an existing verified admin account; the old hard-coded demo login is no longer used.

Customer and renewal data, dashboard statistics, account profile, and password changes are loaded from the backend. Reminder delivery and reminder preference persistence are not provided by the current backend.
