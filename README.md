# HostelHub

HostelHub is a MEAN stack hostel management platform for students and hostel admins.

## Stack

- Frontend: Angular 20 standalone app
- Backend: Node.js + Express.js
- Database: MongoDB Atlas / local MongoDB
- Auth: JWT + bcrypt
- PDF/QR: `pdfkit` + `qrcode`
- Charts: `chart.js` + `ng2-charts`

## Local setup

1. Copy `.env.example` to `server/.env` and update values.
2. Install dependencies:

```bash
npm install --prefix server
npm install --prefix client
```

3. Start the backend:

```bash
npm --prefix server run dev
```

4. Start the frontend in a new terminal:

```bash
npm --prefix client run start
```

5. Open `http://localhost:4200`.

## Environment setup

### Backend

Create `server/.env` from the root `.env.example` with:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:4200,https://your-vercel-project.vercel.app
```

`CLIENT_URL` supports a comma-separated list so local and deployed frontend URLs can both access the API.

### Frontend

Angular uses environment files instead of a `.env` file:

- local API URL: `client/src/app/environments/environment.ts`
- production API URL: `client/src/app/environments/environment.prod.ts`

Before deploying the frontend, replace the placeholder production URL with your real Render backend URL.

## Production targets

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Deployment notes

### Vercel frontend

1. Import the repo into Vercel.
2. Set the Vercel project root directory to `client`.
3. Build command: `npm run build`
4. Output directory: `dist/hostelhub-client`
5. Update `client/src/app/environments/environment.prod.ts` with your real Render API URL before building.

### Render backend

1. Create a new Web Service from the `server` directory or use the included `render.yaml`.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add environment variables:
   - `PORT`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`

## Admin login

- Admin email: `admin@gmail.com`
- Default admin password: `admin123`
- The admin account is auto-created by the backend on startup if it does not already exist.
- Admin registration is blocked intentionally. Use login only for the admin account.

## Notifications

- In-app notifications are available for outpass approvals/rejections, complaint updates, new complaints, and announcements.
- Real-time notification delivery is enabled with Socket.IO, so updates appear without refreshing the page.
- Notifications can be:
  - marked individually as read
  - marked all as read
  - cleared completely from the list and database with `Clear all`
- Full notification history is available at `/notifications`.

## Run locally before deploy

### Backend

```bash
cd server
npm run dev
```

Expected local API:

```text
http://localhost:5000/api
```

### Frontend

```bash
cd client
npm run start
```

Expected local app:

```text
http://localhost:4200
```

## Production checklist

### Before frontend deploy

1. Open `client/src/app/environments/environment.prod.ts`
2. Replace:

```ts
https://your-render-backend.onrender.com/api
```

3. With your real Render backend API URL

Example:

```ts
https://hostelhub-api.onrender.com/api
```

### Before backend deploy

Make sure Render environment variables are set:

- `PORT=5000`
- `MONGODB_URI=...`
- `JWT_SECRET=...`
- `CLIENT_URL=https://your-vercel-project.vercel.app`

If you also want localhost access after deploy, use:

```env
CLIENT_URL=http://localhost:4200,https://your-vercel-project.vercel.app
```

## Manual smoke guide

### Login

- Register a new student account and confirm redirect to `/dashboard`
- Login with `admin@gmail.com` and confirm redirect to `/admin`
- Enter an invalid password and confirm the UI shows a toast error
- Refresh the browser after login and confirm the session restores correctly

### Outpass

- Student creates an outpass with valid dates and destination
- Student sees the request in outpass history
- Admin can search/filter the request by student, block, room, department, or status
- Admin approves the request and student can download the PDF

### Complaints

- Student submits a complaint and sees it in the complaints list
- Admin changes complaint status and confirms it updates in the table
- Admin deletes a completed complaint and confirms it disappears from the queue

### Announcements

- Admin creates an announcement
- Admin edits the same announcement and confirms the updated content is shown
- Student can view announcements and important notices are visually highlighted

### Notifications

- Student submits an outpass and admin receives a live notification
- Admin approves or rejects the outpass and student receives a live notification without refresh
- Complaint status changes create a student notification
- `Mark all read` updates unread state
- `Clear all` removes notifications from both the UI and database

## Deploy flow

### Vercel

1. Import the repository
2. Set root directory to `client`
3. Build command: `npm run build`
4. Output directory: `dist/hostelhub-client`
5. Redeploy after setting the correct production API URL

### Render

1. Create a Web Service
2. Set root directory to `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all required environment variables
6. After first deploy, confirm `GET /api/health` responds successfully
