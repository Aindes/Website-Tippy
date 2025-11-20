DROP DATABASE IF EXISTS tippy_db;
CREATE DATABASE tippy_db;
USE tippy_db;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'paid', 'completed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, description, price, image_url) VALUES 
('Sepatu Nike Air Max', 'Sepatu running bekas pakai 3 bulan, kondisi 90%', 800.000, '/images/nikeAir.jpg'),
('Tas Gucci Authentic', 'Tas Gucci authentic second kondisi 85%', 5.000.000, '/images/tasGucci.png'),
('Kemeja Uniqlo', 'Kemeja flannel kotak-kotak kondisi 95%, jarang dipakai', 150.000, '/images/kemejaUniqlo.png'),
('iPhone 13 Pro', 'HP second kondisi 85%, baterai 89%, fullset dengan charger original', 8.500.000, '/images/ip13.png'),
('Jam Tangan Casio', 'Jam tangan digital vintage tahun 90an, fungsi lengkap', 450.000, '/images/jamTangan.png'),
('Nintendo Switch V2', 'Switch second fullset, bonus 2 game fisik, kondisi 90%', 3.200.000, '/images/nintendoSwitch.png'),
('Hoodie H&M', 'Hoodie warna navy, kondisi 90%, size L', 175.000, '/images/hoodieH&M.png'),
('Cardigan Zara', 'Cardigan rajut tebal, warna cream, size M, kondisi 95%', 225.000, '/images/cardiganZara.png'),
('Kalung Pandora', 'Kalung silver authentic dengan pendant butterfly, kondisi 98%', 850.000, '/images/kalungPandora.png'),
('Dress Cottonink', 'Dress motif floral, bahan katun, size S, kondisi 92%', 180.000, '/images/dressCottonink.png'),
('Gelang Cartier Love', 'Gelang Cartier Love Rose Gold, kondisi 88%', 15.000.000, '/images/cartier.png'),
('Jaket Denim Levis', 'Jaket jeans classic fit, size XL, kondisi 87%', 350.000, '/images/jaketLevis.png'),
('Cincin Swarovski', 'Cincin crystal size 14, fullset dengan box, kondisi 96%', 450.000, '/images/cincinSwarovski.png'),
('Kemeja Crop Stradivarius', 'Kemeja crop putih basic, size S, kondisi 93%', 125.000, '/images/kemejaCrop.png'),
('Scarf Burberry', 'Scarf wool motif classic check, authentic, kondisi 89%', 2.800.000, '/images/scarfBurberry.png'),
('Sweater UNIQLO', 'Sweater rajut basic lengan panjang, size M, kondisi 94%', 165.000, '/images/sweaterUniqlo.png');