# Asher Writes

A production-ready article publishing website for **Rana Ashir Mehmood**.
Minimal, fast, and secure — built with Node.js/Express, MongoDB, and vanilla JS.

---

## 🗂 Project Structure

```
asher-writes/
├── server.js                  # Express entry point
├── vercel.json                # Vercel deployment config
├── .env.example               # Environment variable template
├── routes/
│   ├── articleRoutes.js       # Article CRUD routes
│   └── adminRoutes.js         # Admin auth routes
├── controllers/
│   ├── articleController.js   # Article logic
│   └── adminController.js     # Auth logic
├── models/
│   ├── db.js                  # MongoDB connection
│   ├── Article.js             # Article schema
│   └── Admin.js               # Admin schema (bcrypt)
├── middleware/
│   ├── auth.js                # JWT protection
│   ├── validate.js            # Input validation
│   └── errorHandler.js        # Global error handler
├── public/
│   ├── index.html             # SPA shell
│   ├── css/style.css          # Full stylesheet
│   └── js/
│       ├── api.js             # API client
│       ├── router.js          # Client-side router
│       ├── app.js             # Bootstrap
│       └── pages/             # Page renderers
└── scripts/
    └── seed.js                # DB seeder
```

---

## ⚡ Local Setup

### Prerequisites
- Node.js ≥ 18
- A MongoDB database (MongoDB Atlas free tier works perfectly)

### 1. Clone & install
```bash
git clone <your-repo>
cd asher-writes
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env` with your values:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-long-random-secret-here
ADMIN_USERNAME=asher
ADMIN_PASSWORD=AsherAdmin@2024!
NODE_ENV=development
```

### 3. Seed the database
```bash
node scripts/seed.js
```
This creates the admin user and 3 sample articles.

### 4. Run locally
```bash
npm run dev      # development (nodemon)
npm start        # production
```
Open: **http://localhost:3000**

---

## 🔐 Admin Panel

The admin panel is **not linked anywhere** in the public UI.

| Route | Description |
|-------|-------------|
| `/admin-secret-panel/login` | Login page |
| `/admin-secret-panel` | Article list & management |
| `/admin-secret-panel/new` | Create new article |
| `/admin-secret-panel/edit/:id` | Edit existing article |

**Default test credentials** (change before going live):
- Username: `asher`
- Password: `AsherAdmin@2024!`

---

## 🚀 Deploy to Vercel

### 1. Push to GitHub
```bash
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/<you>/asher-writes.git
git push -u origin main
```

### 2. Import on Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Framework preset: **Other**
4. Root directory: `/` (leave as-is)

### 3. Add Environment Variables
In Vercel project settings → **Environment Variables**, add:
```
MONGODB_URI      = mongodb+srv://...
JWT_SECRET       = your-long-secret
ADMIN_USERNAME   = asher
ADMIN_PASSWORD   = your-strong-password
NODE_ENV         = production
```

### 4. Deploy
Click **Deploy**. Vercel will build and deploy automatically.

---

## 🔒 Security Features

| Feature | Implementation |
|---------|----------------|
| Password hashing | bcrypt (12 rounds) |
| Authentication | JWT (Bearer token, 7d expiry) |
| HTTP security headers | Helmet.js |
| Rate limiting | express-rate-limit (100 req/15min global, 10 req/15min on login) |
| NoSQL injection | express-mongo-sanitize |
| XSS stripping | Custom sanitizer + xss-clean |
| Input validation | Custom middleware |
| Error leaking | Disabled in production |

---

## 📡 API Reference

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | List published articles |
| GET | `/api/articles/slug/:slug` | Get article by slug |

### Protected (Bearer token required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles/all` | List all (incl. drafts) |
| GET | `/api/articles/id/:id` | Get by ID |
| POST | `/api/articles` | Create article |
| PUT | `/api/articles/:id` | Update article |
| DELETE | `/api/articles/:id` | Delete article |
| POST | `/api/admin/login` | Login → returns JWT |
| GET | `/api/admin/me` | Get current admin |

---

## ✏️ Article Content

Articles support HTML in the `content` field:
```html
<h2>Section heading</h2>
<p>Paragraph text with <strong>bold</strong> and <em>italic</em>.</p>
<ul><li>List item</li></ul>
<blockquote><p>A quote.</p></blockquote>
<pre><code>// code block</code></pre>
<img src="url" alt="description" />
```

---

## 📝 License
MIT — use freely, attribute kindly.
