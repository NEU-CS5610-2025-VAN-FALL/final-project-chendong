// filepath: api/index.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Initialization
const prisma = new PrismaClient();
const app = express();
const PORT = 3000;
const SECRET_KEY = "supersecretkey12345"; 

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Middleware：Check Auth
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// test responsiveness
app.get('/ping', (req, res) => res.send('pong'));

// 1. Register
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashedPassword, name } });
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.json({ message: 'Registered', user });
  } catch (e) { 
    console.error(e);
    res.status(400).json({ error: 'User exists or error' }); 
  }
});

// 2. Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).send('Invalid');
  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.json({ message: 'Logged in' });
});

// 3. Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

// 4. Get Menu (GET)
app.get('/api/menu', async (req, res) => {
  const items = await prisma.menuItem.findMany();
  res.json(items);
});

// 5. Add Item (POST) - Login Required (Auth)
app.post('/api/menu', requireAuth, async (req, res) => {
  const { name, price } = req.body;
  try {
    const newItem = await prisma.menuItem.create({
      data: { 
        name, 
        description: "Delicious food",
        price: parseFloat(price), 
        category: "Main"
      }
    });
    res.json(newItem);
  } catch(e) {
    res.status(500).json({error: "Failed to add"});
  }
});

// 6. Check Auth Status
app.get('/api/auth/me', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ loggedIn: false });
    try {
      jwt.verify(token, SECRET_KEY);
      res.json({ loggedIn: true });
    } catch (err) {
      res.json({ loggedIn: false });
    }
  });

app.listen(PORT, () => console.log(`API running on port ${PORT}`));