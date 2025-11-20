# Tippy - Preloved Items Marketplace

Tippy is a web application for buying preloved items with blockchain-based payments.

## Features

- Browse preloved products
- View product details
- Order management
- Blockchain payment integration using Web3.js
- Secure payment processing

## Tech Stack

- Frontend: React.js with Chakra UI
- Backend: Node.js with Express
- Database: MySQL
- Blockchain: Web3.js
- API Testing: Postman

## Prerequisites

- Node.js
- MySQL
ik- Local blockchain network (e.g., Ganache) or testnet connection

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

3. Create a .env file with your configuration:
   ```
   PORT=3001
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=tippy_db
   BLOCKCHAIN_URL=http://localhost:8545
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
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Testing Payments

1. Install MetaMask browser extension
2. Connect MetaMask to your local blockchain network or testnet
3. Make sure you have test ETH in your wallet
4. Try making a purchase and confirm the transaction in MetaMask

## API Testing with Postman

Import the provided Postman collection to test the APIs:

- Products API: `GET /api/products`
- Orders API: `GET /api/orders`
- Payment API: `POST /api/payment`

## Anggota Kelompok

1. Graine Ivana Lumbantobing - 235150701111042
2. Intan Desi Purnomo - 23515070111050
3. Melani Sitohang - 235150700111042
4. Mutiara Dwi Artono - 235150701111052

