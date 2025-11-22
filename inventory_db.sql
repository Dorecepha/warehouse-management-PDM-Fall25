-- Create database and use it
CREATE DATABASE IF NOT EXISTS inventory_db;
USE inventory_db;

-- Categories
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);
INSERT INTO categories VALUES
(1,'Electronics'),
(2,'Clothing'),
(3,'Kitchen'),
(4,'Accessories'),
(5,'Toys'),
(6,'Sports'),
(7,'Home Decor');

-- Products
DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id BIGINT NOT NULL AUTO_INCREMENT,
  created_at DATETIME DEFAULT NULL,
  description VARCHAR(255) DEFAULT NULL,
  expiry_date DATETIME DEFAULT NULL,
  image_url VARCHAR(255) DEFAULT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(38,2) DEFAULT NULL,
  sku VARCHAR(255) NOT NULL,
  stock_quantity INT DEFAULT NULL,
  category_id BIGINT DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY (sku),
  KEY (category_id),
  FOREIGN KEY (category_id) REFERENCES categories(id) 
    ON DELETE CASCADE  -- Deleting Category deletes Product
    ON UPDATE CASCADE, -- Updating Category ID updates Product
  CHECK (stock_quantity >= 0)
);

INSERT INTO products VALUES 
(1,'2025-07-19 18:00:00','Latest smartphone','2026-01-01 00:00:00','products/fef3ec6d-36d1-4cda-8dd4-472647152c20_samsung-galaxy-_main_500_1020.png.webp','Smartphone A1',500.00,'SKU001',20,1),
(2,'2025-07-30 04:00:00','Upgraded smartphone','2026-06-01 00:00:00','products/bd2a9b2b-0213-4710-986f-11f7a901f256_Du-an-moi-3-2.png','Smartphone A2',600.00,'SKU002',15,1),
(3,'2025-10-16 16:00:00','Budget smartphone','2026-02-01 00:00:00','products/36c1f0dc-0740-421b-a768-8d6d098b7320_iphone-17-pro-max_3.webp','Smartphone A3',300.00,'SKU003',25,1),
(4,'2025-08-30 04:00:00','Cotton T-Shirt','2026-11-22 15:16:53','products/9a2f258b-e239-4636-829f-7975e568879c_download (17).jpg','T-Shirt Basic',15.00,'SKU004',100,2),
(5,'2025-11-09 16:00:00','Warm winter jacket','2026-11-22 15:17:18','products/a598644d-487a-4977-b4f5-6c7515fe8e18_download (18).jpg','Jacket Winter',45.00,'SKU005',40,2),
(6,'2025-10-24 22:00:00','High speed blender','2027-01-01 00:00:00','products/52963d8f-c8d9-4e3d-a002-f1b44fa45a31_3aa9f4d3-0b10-432e-b67f427c81c46ba7-396476f2-3200000395-20250618-092613.webp','Blender X',80.00,'SKU006',30,3),
(7,'2025-11-04 15:00:00','5-piece cookware set','2026-11-22 15:18:25','products/94da0d4a-9bb0-4239-b096-7d33ce3496d5_best-cookware-sets_LEDE_021925_1398_VOG_Badge_final.webp','Cookware Set',60.00,'SKU007',25,3),
(8,'2025-11-09 06:00:00','Classic wrist watch','2026-11-22 15:18:37','products/7911592a-4273-4e12-9fe6-d991d1b006f7_dong-ho-jacob-co-astronomia-art-dragon-rose-gold-sky-at112-40-dr-sd-a-phien-ban-duy-nhat.jpg','Watch Classic',50.00,'SKU008',75,4),
(9,'2025-10-24 03:00:00','Silver bracelet','2026-11-22 15:18:48','products/5d5d831c-43f5-42c1-9406-a0aea5eede0f_71kFO60WnnL._AC_UY1100_.jpg','Bracelet Silver',30.00,'SKU009',60,4),
(10,'2025-11-05 00:00:00','Toy racing car','2026-11-22 15:18:55','products/9c110ef6-77e5-4293-a5d0-d3bc47abdbb6_images (1).jpg','Toy Car',10.00,'SKU010',120,5),
(11,'2025-07-28 12:00:00','Lego building set','2026-11-22 15:19:03','products/c16c1017-5806-4b4e-b1f4-765499ce810a_81QUSmkau7L.jpg','Lego Set',55.00,'SKU011',35,5),
(12,'2025-08-12 10:00:00','Professional basketball','2026-11-22 15:19:09','products/598f1b57-4c0e-4ae8-ab8c-729b368fd847_a78425d8-6944-4644-ae09-c065ee8e3156.fe6212bc476847fd8b3354d2a28745c6.webp','Basketball Pro',20.00,'SKU012',45,6),
(13,'2025-08-12 16:00:00','Carbon tennis racket','2026-11-22 15:19:15','products/b98f3752-5bd0-425d-83b4-61959e03bb3e_ATR32-medium__61580.jpg','Tennis Racket',75.00,'SKU013',20,6),
(14,'2025-07-24 18:00:00','Wall-mounted lamp','2026-11-22 15:19:21','products/48c19b61-977a-474b-9a88-abef7689fd16_wall_lights_for_living_room_uk.webp','Wall Lamp',25.00,'SKU014',60,7),
(15,'2025-07-28 08:00:00','Wooden picture frame','2026-11-22 15:19:30','products/4af2de9f-9741-49ff-8a7c-b999f0ed98eb_old-picture-frame-with-clipping-path-D9KDWF.jpg','Picture Frame',12.00,'SKU015',80,7);


-- Suppliers
DROP TABLE IF EXISTS suppliers;
CREATE TABLE suppliers (
  id BIGINT NOT NULL AUTO_INCREMENT,
  address VARCHAR(255) DEFAULT NULL,
  contact_info VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);
INSERT INTO suppliers VALUES
(1,'HCM','0901000001','Alpha Supply Co'),
(2,'HN','0901000002','Bravo Traders'),
(3,'Da Nang','0901000003','Charlie Imports'),
(4,'HCM','0901000004','Delta Distribution'),
(5,'HN','0901000005','Echo Wholesale'),
(6,'HCM','0901000006','Foxtrot Logistics'),
(7,'Da Nang','0901000007','Gamma Partners');

-- Users
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  created_at DATETIME DEFAULT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255) NOT NULL,
  role ENUM('ADMIN','MANAGER') DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY (email)
);
INSERT INTO users VALUES
('1', '2025-11-21 16:15:10.308216', 'admin@gmail.com', 'admin user', '$2a$10$eUSKrqVAFm/rThmuBv858Oc/5pemWwpnm3PufrkaFUj.YLV6xxhtq', '+84363636406', 'ADMIN'),
('2', '2025-11-21 16:15:32.964089', 'manager@gmail.com', 'manager user', '$2a$10$WMNX5Tj5zz6T.qDQJqbd2O28PEHZA8t0BprwLnofZz01nJW3/EgwO', '+84363636406', 'MANAGER');
-- password for both account: 123456
-- Transactions
DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
  id BIGINT NOT NULL AUTO_INCREMENT,
  created_at DATETIME DEFAULT NULL,
  description VARCHAR(255) DEFAULT NULL,
  note VARCHAR(255) DEFAULT NULL,
  status ENUM('CANCELLED','COMPLETED','PENDING','PROCESSING') DEFAULT NULL,
  total_price DECIMAL(38,2) DEFAULT NULL,
  total_products INT DEFAULT NULL,
  transaction_type ENUM('PURCHASE','RETURN_TO_SUPPLIER','SALE') DEFAULT NULL,
  update_at DATETIME DEFAULT NULL,
  product_id BIGINT DEFAULT NULL, 
  supplier_id BIGINT DEFAULT NULL, 
  user_id BIGINT DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id) REFERENCES products(id) 
    ON DELETE SET NULL   -- Product deleted? Keep transaction, set ID to NULL
    ON UPDATE CASCADE,   -- Product ID changed? Update transaction too
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) 
    ON DELETE SET NULL   -- Supplier deleted? Keep transaction, set ID to NULL
    ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE SET NULL   -- User deleted? Keep transaction, set ID to NULL
    ON UPDATE CASCADE
);

INSERT INTO transactions VALUES
(1,'2025-07-24 17:00:00','Purchase stock','Initial load','COMPLETED',2500.00,5,'PURCHASE','2025-11-15 19:49:44',1,1,1),
(2,'2025-08-03 02:00:00','Sale to customer','Online order','COMPLETED',600.00,1,'SALE','2025-11-15 19:49:44',3,2,2),
(3,'2025-07-30 05:00:00','Return to supplier','Damaged product','PROCESSING',45.00,1,'RETURN_TO_SUPPLIER','2025-11-15 19:49:44',5,3,1),
(4,'2025-10-01 05:00:00','Purchase stock','Restock toys','COMPLETED',200.00,20,'PURCHASE','2025-11-15 19:49:44',10,4,1),
(5,'2025-11-05 16:00:00','Sale to customer','Retail store','COMPLETED',150.00,3,'SALE','2025-11-15 19:49:44',8,5,2),
(6,'2025-10-22 22:00:00','Purchase restock','Sports equipment','COMPLETED',400.00,10,'PURCHASE','2025-11-15 19:49:44',12,6,1),
(7,'2025-11-04 15:00:00','Return from customer','Customer refund','PENDING',25.00,1,'RETURN_TO_SUPPLIER','2025-11-15 20:18:30',14,7,2);

