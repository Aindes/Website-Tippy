// ====== MODULE IMPORT ======
require('dotenv').config(); // Load .env

const express = require('express');
const cors = require('cors');
const { Web3 } = require('web3');
const midtransClient = require('midtrans-client');
const mysql = require('mysql2');

// ====== EXPRESS APP ======
const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// ====== DATABASE CONNECTION ======
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
    console.error('Database Connection Error:', err);
    return;
  }
  console.log('Connected to MySQL Database');
  connection.release();
});

// ====== BLOCKCHAIN SETUP ======
const web3 = new Web3(process.env.BLOCKCHAIN_URL || 'http://localhost:8545');

// ====== ROUTES ======

// ------------------ DELETE ORDER ------------------
app.delete('/api/orders/:id', (req, res) => {
  const orderId = req.params.id;

  db.query('DELETE FROM order_items WHERE order_id = ?', [orderId], (err) => {
    if (err) {
      console.error('Error deleting order_items:', err);
      return res.status(500).json({ error: err.message });
    }

    db.query('DELETE FROM orders WHERE id = ?', [orderId], (err2) => {
      if (err2) {
        console.error('Error deleting order:', err2);
        return res.status(500).json({ error: err2.message });
      }
      res.json({ success: true });
    });
  });
});

// ------------------ UPDATE PAYMENT STATUS ------------------
app.patch('/api/orders/:id/pay', (req, res) => {
  const orderId = req.params.id;
  db.query(
    'UPDATE orders SET status = ?, payment_status = ? WHERE id = ?',
    ['paid', 'completed', orderId],
    (err, result) => {
      if (err) {
        console.error('Error updating order status:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    }
  );
});

// ------------------ PRODUCTS ------------------
app.get('/api/products', (req, res) => {
  console.log('Received request for products');
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Database error (products):', err);
      return res.status(500).json({ error: err.message });
    }
    console.log('Products found:', results);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.json(results);
  });
});

// ------------------ TEST ROUTE ------------------
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// ------------------ GET ALL ORDERS ------------------
app.get('/api/orders', (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ------------------ CREATE NEW ORDER ------------------
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
        console.error('Error inserting order:', err);
        return res.status(500).json({ error: err.message });
      }

      const orderId = orderResult.insertId;

      const orderItems = items.map(item => [
        orderId,
        item.id,
        item.quantity || 1,
        item.price
      ]);

      db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?',
        [orderItems],
        (err2) => {
          if (err2) {
            console.error('Error inserting order items:', err2);
            return res.status(500).json({ error: err2.message });
          }
          res.json({ orderId });
        }
      );
    }
  );
});

// ------------------ MIDTRANS PAYMENT ------------------
app.post('/api/payment', async (req, res) => {
  const { orderId, amount } = req.body;

  console.log('MIDTRANS SERVER KEY:', process.env.MIDTRANS_SERVER_KEY);
  console.log('MIDTRANS CLIENT KEY:', process.env.MIDTRANS_CLIENT_KEY);

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
  });

  const parameter = {
    transaction_details: {
      order_id: `ORDER-${orderId}-${Date.now()}`,
      gross_amount: Number(amount)
    }
  };

  try {
    const transaction = await snap.createTransaction(parameter);

    if (transaction && transaction.token) {
      return res.json({ snapToken: transaction.token });
    }

    return res.status(500).json({ error: 'Failed to generate Snap Token' });

  } catch (err) {
    console.error("MIDTRANS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ====== START SERVER ======
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});