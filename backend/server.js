// Create new order
app.post('/api/orders', (req, res) => {
  const { items, total_amount } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items in order' });
  }
  db.query(
    'INSERT INTO orders (total_amount, status, payment_status) VALUES (?, ?, ?)',
    [total_amount, 'pending', 'pending'],
    (err, orderResult) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const orderId = orderResult.insertId;
      const orderItems = items.map(item => [orderId, item.id, item.quantity || 1, item.price]);
      db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?',
        [orderItems],
        (err2) => {
          if (err2) {
            return res.status(500).json({ error: err2.message });
          }
          res.json({ orderId });
        }
      );
    }
  );
});
// ...existing code...


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Web3 } = require('web3');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Database connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tippy_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to database');
  connection.release();
});

// Connection is handled by the pool

// Blockchain setup
const web3 = new Web3(process.env.BLOCKCHAIN_URL || 'http://localhost:8545');

// Routes
// Products routes
app.get('/api/products', (req, res) => {
  console.log('Received request for products');
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Products found:', results);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.json(results);
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Orders routes
app.get('/api/orders', (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Payment routes with blockchain integration
app.post('/api/payment', async (req, res) => {
  const { orderId, walletAddress, amount } = req.body;
  try {
    // Here will be the blockchain transaction logic
    // This is a placeholder for the actual blockchain implementation
    const transaction = {
      from: walletAddress,
      value: web3.utils.toWei(amount.toString(), 'ether'),
      // Add other transaction details as needed
    };
    
    // Update payment status in database
    db.query(
      'UPDATE orders SET payment_status = ? WHERE id = ?',
      ['completed', orderId],
      (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Payment processed successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});