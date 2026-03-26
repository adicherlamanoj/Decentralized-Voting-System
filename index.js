const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

/* ================= AUTH MIDDLEWARE ================= */
const authorizeUser = (req, res, next) => {
  const authHeader = req.query.Authorization;
  if (!authHeader) {
    return res.status(401).send('<h1 align="center">Login to Continue</h1>');
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    next();
  } catch (err) {
    return res.status(403).send('<h1 align="center">Invalid Token</h1>');
  }
};

/* ================= STATIC FILES (NO AUTH) ================= */
app.use(express.static(path.join(__dirname, 'src')));
app.use('/dist', express.static(path.join(__dirname, 'src/dist')));
app.use('/css', express.static(path.join(__dirname, 'src/css')));
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));
app.use('/public', express.static(path.join(__dirname, 'public')));

/* ================= HTML ROUTES (NO AUTH) ================= */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/login.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/login.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/admin.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/index.html'));
});

/* ================= PROTECTED API ROUTES ================= */
/* Example: protect only APIs, not pages */
app.get('/api/protected', authorizeUser, (req, res) => {
  res.json({ message: 'Authorized access' });
});

/* ================= SERVER ================= */
app.listen(8080, () => {
  console.log('Server listening on http://localhost:8080');
});
