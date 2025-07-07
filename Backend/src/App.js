const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const { DBconnection } = require(path.join(__dirname, '..', 'config', 'MongoConn'));


// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || "your-session-secret",
  resave: false,
  saveUninitialized: true,
}));

// Static files
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'public')));
// app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'frontend', 'uploads')));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '..', 'templates', 'views'));

// Routes
const formRoutes = require('./routes/formRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
app.use('/api', formRoutes);
app.use('/api/admin', adminRoutes);
app.use('/public', publicRoutes);

// Public entrypoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'public', 'form.html'));
});

//!when deployed, redirect to frontend
// app.get("/", (req, res) => {
//   res.redirect("https://yourfrontend.vercel.app");
// });

app.get('/thankyou', (req, res) => {
  res.render('thankyou');
});


DBconnection().then(() => {
  console.log("✅ MongoDB connected");
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
}).catch(err => console.error('❌ DB Connection Failed:', err));