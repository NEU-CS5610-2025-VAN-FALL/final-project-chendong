const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require.require('bcryptjs');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// --- Initialization ---
const prisma = new PrismaClient();
const app = express();

// 1. port config
const PORT = parseInt(process.env.PORT) || 8080;

// 2. passkey management
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey12345";
const COOKIE_NAME = "token";

app.use(express.json());
app.use(cookieParser());

// 3. CORS: Use functions for dynamic multi-domains
// Make sure Render environment variables CLIENT_URL includes all allowed domains, split by ','
const ALLOWED_ORIGINS_STRING = process.env.CLIENT_URL || 'http://localhost:3000';
const ALLOWED_ORIGINS = ALLOWED_ORIGINS_STRING.split(',').map(s => s.trim());

// Check if request origin is in the allowed list
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (origin.startsWith('http://localhost')) return callback(null, true);
        if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.error(`CORS Blocked: ${origin}. Allowed: ${ALLOWED_ORIGINS.join(', ')}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

// 4. Cross domain cookie transmission
const isProductionCookiePolicy = process.env.NODE_ENV === 'production'; 

const cookieOptions = {
  httpOnly: true,
  sameSite: isProductionCookiePolicy ? 'none' : 'lax',
  secure: isProductionCookiePolicy, 
  maxAge: 3600000
};

// --- Middleware: Auth Check ---
const requireAuth = (req, res, next) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Router health check
app.get('/ping', (req, res) => res.send('pong'));

// --- 1. Auth & User ---

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !email.includes('@') || !password || password.length < 6) {
    return res.status(400).json({ error: 'Invalid email or password (min 6 chars)' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ 
      data: { email, password: hashedPassword, name } 
    });
    
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.cookie(COOKIE_NAME, token, cookieOptions); 
    
    res.json({ message: 'Registered', user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) { 
    res.status(400).json({ error: 'User already exists' }); 
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
  res.cookie(COOKIE_NAME, token, cookieOptions); 
  
  res.json({ message: 'Logged in!', user: { id: user.id, name: user.name, email: user.email } });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.json({ message: 'Logged out' });
});

app.get('/api/auth/me', async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.json({ loggedIn: false });
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id },
      select: { id: true, name: true, email: true } 
    });
    if (!user) return res.json({ loggedIn: false });
    res.json({ loggedIn: true, user });
  } catch (err) {
    res.json({ loggedIn: false });
  }
});

// --- 2. Menu Items ---

app.get('/api/menu', async (req, res) => {
  const items = await prisma.menuItem.findMany({
    where: { isAvailable: true }
  });
  res.json(items);
});

app.post('/api/menu', requireAuth, async (req, res) => {
  const { name, price, description, category } = req.body;
  if (!name || !price || isNaN(price)) return res.status(400).json({ error: 'Invalid input' });
  
  try {
    const newItem = await prisma.menuItem.create({
      data: { 
        name, 
        description: description || "Custom Item", 
        price: parseFloat(price), 
        category: category || "Custom",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        isAvailable: true
      }
    });
    res.json(newItem);
  } catch(e) {
    console.error(e);
    res.status(500).json({error: "Failed to add item"});
  }
});

app.delete('/api/menu/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.menuItem.update({
      where: { id },
      data: { isAvailable: false }
    });
    res.json({ message: "Item hidden (soft deleted) successfully" });
  } catch (e) {
    console.error("Delete Error:", e);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// --- 3. Cart & Orders ---

const getCart = async (userId) => {
  let cart = await prisma.order.findFirst({
    where: { userId: userId, status: 'CART' },
    include: { orderItems: { include: { menuItem: true } } }
  });
  
  if (!cart) {
    cart = await prisma.order.create({
      data: { userId: userId, status: 'CART' },
      include: { orderItems: { include: { menuItem: true } } }
    });
  }
  return cart;
};

app.get('/api/cart', requireAuth, async (req, res) => {
  const cart = await getCart(req.user.id);
  res.json(cart);
});

app.post('/api/cart/items', requireAuth, async (req, res) => {
  let { menuItemId, quantity } = req.body;
  quantity = quantity || 1;
  const userId = req.user.id;

  if (!menuItemId) return res.status(400).json({ error: 'Item ID required' });

  const cart = await getCart(userId);
  const menuItemIdInt = parseInt(menuItemId);

  const menuItem = await prisma.menuItem.findUnique({ where: { id: menuItemIdInt }});
  
  if (!menuItem || !menuItem.isAvailable) {
    return res.status(404).json({ error: 'Menu item not found or unavailable' });
  }

  const existingItem = await prisma.orderItem.findFirst({
    where: { orderId: cart.id, menuItemId: menuItemIdInt }
  });

  if (existingItem) {
    await prisma.orderItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + parseInt(quantity) }
    });
  } else {
    await prisma.orderItem.create({
      data: {
        orderId: cart.id,
        menuItemId: menuItemIdInt,
        quantity: parseInt(quantity),
        price: menuItem.price 
      }
    });
  }
  res.json({ message: 'Added to cart' });
});

app.delete('/api/cart/items/:id', requireAuth, async (req, res) => {
  const orderItemId = parseInt(req.params.id);
  await prisma.orderItem.delete({ where: { id: orderItemId } });
  res.json({ message: 'Deleted' });
});

app.post('/api/orders/checkout', requireAuth, async (req, res) => {
  const cart = await getCart(req.user.id);
  if (cart.orderItems.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  const total = cart.orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const order = await prisma.order.update({
    where: { id: cart.id },
    data: { 
      status: 'COMPLETED',
      totalAmount: total,
      createdAt: new Date()
    }
  });

  res.json({ message: 'Order placed', order });
});

app.get('/api/orders', requireAuth, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { 
      userId: req.user.id,
      status: { not: 'CART' } 
    },
    include: { orderItems: { include: { menuItem: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
});

// Listen port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});
