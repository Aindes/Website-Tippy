
# Tippy - Preloved Items Marketplace

Tippy is a web application for buying preloved items, supporting both MidTrans and blockchain (MetaMask) payments.

## Features

- View product details
- Add to cart and manage cart
- Order management (view, delete, payment status)
- Payment via MidTrans (bank/ewallet)
- Payment via Blockchain (MetaMask, Sepolia testnet, ethers.js)
- Automatic cart clearing and order status update after payment

## Tech Stack

- Frontend: React.js (Vite) with Chakra UI
- Backend: Node.js with Express
- Database: MySQL
- Blockchain: ethers.js + MetaMask (Sepolia testnet)
- Payment Gateway: MidTrans

## Prerequisites

- Node.js
- MySQL
- MetaMask browser extension (for blockchain payment)

## Setup Instructions

### Database Setup

1. Install MySQL if you haven't already
2. Log in to MySQL
3. Run the database schema:
   ```bash
   mysql -u root -p < backend/database.sql
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Buat file `.env` (jangan di-push ke GitHub!) dengan konfigurasi:
   ```
   PORT=3001
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=tippy_db
   MIDTRANS_SERVER_KEY=your_midtrans_server_key
   MIDTRANS_CLIENT_KEY=your_midtrans_client_key
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`

## Payment Testing

### MidTrans
- Pastikan backend sudah terhubung ke MidTrans (sandbox)
- Checkout di frontend, lakukan pembayaran via Snap popup

### Blockchain (MetaMask)
- Install MetaMask di browser
- Pilih jaringan Sepolia testnet
- Pastikan wallet punya saldo ETH testnet
- Klik "Pay with Blockchain" di cart, konfirmasi transaksi di MetaMask
- Order status akan otomatis berubah setelah pembayaran

## API Testing with Postman

- Products API: `GET /api/products`
- Orders API: `GET /api/orders`
- Payment API: `POST /api/payment`

## Anggota Kelompok

1. Graine Ivana Lumbantobing - 235150701111042
2. Intan Desi Purnomo - 23515070111050
3. Melani Sitohang - 235150700111042
4. Mutiara Dwi Artono - 235150701111052
