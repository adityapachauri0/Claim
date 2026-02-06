# PCP Claim Today - Car Finance Claims Website

A modern, premium MERN stack website for PCP/HP car finance compensation claims. Built with React (Vite) frontend and Node.js/Express/MongoDB backend.

## 🚀 Features

- **Modern Design**: Premium UI with animations, glassmorphism effects, and responsive design
- **Multi-Step Claim Form**: Guided wizard with validation and progress tracking
- **Backend API**: RESTful API with MongoDB for storing claims
- **Email Notifications**: Automatic confirmation emails to claimants
- **Admin Dashboard API**: Endpoints for managing and viewing claims
- **Mobile Optimized**: Sticky CTA and responsive layouts

## 📁 Project Structure

```
claims-website/
├── frontend/           # React (Vite) application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── App.jsx     # Main application
│   │   ├── App.css     # App styles
│   │   └── index.css   # Global design system
│   └── package.json
├── backend/            # Node.js/Express API
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Validation & auth
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── server.js       # Entry point
│   └── package.json
└── README.md
```

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔧 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/claims_db
NODE_ENV=development

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@pcpclaimtoday.co.uk
```

## 📡 API Endpoints

### Claims

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/claims` | Submit a new claim |
| GET | `/api/claims` | List all claims (admin) |
| GET | `/api/claims/stats` | Get claim statistics |
| GET | `/api/claims/:id` | Get single claim |
| PUT | `/api/claims/:id/status` | Update claim status |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

## 🚀 Deployment to VPS

### 1. Build Frontend

```bash
cd frontend
npm run build
```

This creates a `dist` folder with static files.

### 2. Deploy Backend

```bash
cd backend
npm install --production

# Use PM2 for process management
pm2 start server.js --name claims-api
```

### 3. Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend (React static files)
    location / {
        root /var/www/claims-website/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. MongoDB Setup

If using MongoDB Atlas, update `MONGODB_URI` in production `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/claims_db
```

## 🎨 Customization

### Brand Colors

Edit `frontend/src/index.css`:

```css
:root {
  --color-primary: #1a1f35;      /* Main dark color */
  --color-accent: #00d4aa;       /* Accent/highlight */
  --color-gold: #ffd700;         /* Secondary accent */
}
```

### Company Information

Update the following files:
- `frontend/src/components/Header.jsx` - Logo/brand name
- `frontend/src/components/Footer.jsx` - Contact info, legal text
- `frontend/index.html` - SEO meta tags

## 📧 Email Configuration

To enable email notifications:

1. Create a Gmail App Password (or use another SMTP provider)
2. Update `.env` with your SMTP credentials
3. Restart the backend server

## 🔒 Security Notes

- Add authentication middleware for admin routes in production
- Enable HTTPS via Let's Encrypt
- Update CORS origins in `server.js` for production domain
- Add rate limiting for the claims endpoint

## 📱 Mobile Features

- Sticky CTA button on mobile devices
- Touch-optimized form inputs
- Responsive navigation with hamburger menu
- Simplified layouts for smaller screens

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm run build  # Check for build errors
```

## 📝 License

MIT License - Feel free to use for your own projects.

---

Built with ❤️ for UK car finance claim services
