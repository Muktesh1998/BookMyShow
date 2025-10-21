# BookMyShow (Full-Stack)

A full-stack web application for browsing movies, managing theatres and shows, booking seats, and handling payments.

- Backend: Node.js + Express + MongoDB (Mongoose)
- Frontend: React (Vite) + Ant Design + Redux Toolkit
- Docs: Swagger (OpenAPI 3)

---

## Monorepo Structure

```
BookMyShow/
├─ Client/               # React + Vite frontend
│  ├─ src/
│  ├─ index.html
│  └─ vite.config.js
├─ Server/               # Express + MongoDB backend
│  ├─ routes/
│  ├─ controllers/
│  ├─ models/
│  ├─ middlewares/
│  ├─ public/            # swagger.css (optional)
│  ├─ server.js
│  ├─ swagger.js
│  └─ package.json
├─ BookMyShow.postman_collection.json
└─ README.md
```

---

## Prerequisites

- Node.js 18+ (Node 22.x supported)
- npm 8+
- MongoDB (local or Atlas)

---

## Environment Variables (Server/.env)
Create `Server/.env` with the following keys (adjust values for your environment):

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bookmyshow
JWT_SECRET=super-secret-jwt
NODE_ENV=development

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLIC_KEY=pk_test_xxx

# Email (Nodemailer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_pass
```

Notes:
- `Server/server.js` serves the built client from `Client/dist` in production.
- Helmet CSP is configured to allow Google Fonts (Inter). Adjust CSP for your deployment domain if needed.

---

## Install & Run

### Backend
```
cd Server
npm install
npm start
```
- Runs nodemon on `server.js`.
- API base path: `/bms/v1`
- Swagger UI: `http://localhost:3000/bms/docs`
- Swagger JSON: `http://localhost:3000/bms/docs/docs.json`

### Frontend (Dev)
```
cd Client
npm install
npm run dev
```
- Vite dev server (default `http://localhost:5173`).
- Proxy to API is configured in `Client/vite.config.js` for `/bms/v1` → `http://localhost:3000`.

### Frontend (Build for Prod)
```
cd Client
npm run build
```
- Outputs to `Client/dist/`. Backend serves this folder statically in production.

---

## Features

- Users:
  - Register, Login (JWT), Get Current User, Password reset flow.
- Admin:
  - Manage Movies (Add, Update, Delete, List).
- Partner:
  - Manage Theatres, Create/Update Shows.
- Booking & Payments:
  - Seat selection, create payment intent, book show, combined pay+book.
- Security:
  - Helmet, Rate limiting, JWT auth, Mongo sanitize (toggleable), CSP.
- Docs:
  - Swagger (OpenAPI 3) with JWT Bearer security.

---

## API Documentation
- UI: `GET /bms/docs`
- JSON: `GET /bms/docs/docs.json`
- JSDoc annotations live in route files, e.g. `Server/routes/userRoute.js`, `movieRoute.js`, `theatreRoute.js`, `showRoute.js`, `bookingRoute.js`.

Authentication in Swagger:
- Click "Authorize" → paste `Bearer <JWT>` obtained from `/bms/v1/users/login`.

---

## Testing

### Manual E2E
1. Start backend (`Server/`) and frontend (`Client/`).
2. Register → Login via UI → land on Home.
3. Open Swagger → Authorize with JWT → hit protected endpoints.
4. Admin: Add a movie → appears on Home.
5. Partner: Add theatre & show → showtimes appear on movie page.
6. Booking: Select seats → pay → booking visible on Profile.

### Postman
- Import `BookMyShow.postman_collection.json` at repo root.
- Set environment:
  - `baseUrl=http://localhost:3000`
  - Tests can capture login token to `authToken` and set `Authorization: Bearer {{authToken}}`.

### Automated (optional)
- API: Jest + Supertest
- UI: Playwright/Cypress

---

## Common Issues & Troubleshooting

- Frontend dev command:
  - Use `npm run dev` (not `ndm`). Run from `Client/`.
- CORS in dev:
  - Proxy is configured in `Client/vite.config.js` for `/bms/v1` → `http://localhost:3000`.
- Ports busy:
  - Change `PORT` in `Server/.env` and Vite will suggest a new port, or set `PORT=5173` alternative.
- Mongo duplicate errors when adding movies:
  - `Server/models/movieSchema.js` has `unique: true` on `movieName`. Ensure distinct names, or adjust the schema.
- Fonts blocked in production:
  - Update Helmet CSP in `Server/server.js` for your CDN/domains (Google Fonts are allowed by default here).

---

## Styling & Theming
- Ant Design tokens set via `ConfigProvider`.
- Inter font included via Google Fonts (CSP configured).
- Dark/Light theme toggle available (floating button) powered by `Client/src/components/ThemeProvider.jsx` and `ThemeToggle.jsx`. Preference is persisted in `localStorage`.

---

## Deployment Notes
- Build the client and serve via the server for a single-origin deployment.
- Ensure environment variables are set in your hosting provider.
- If deploying frontend separately (static hosting):
  - Adjust API base/proxy and CORS on the backend accordingly.

---

## Scripts

### Server/package.json
- `start` → `nodemon server.js`

### Client/package.json
- `dev` → Vite dev server
- `build` → Vite production build
- `preview` → Preview built client
- `lint` → ESLint

---

## License
This project is for educational purposes.
