
CREATE DATABASE IF NOT EXISTS stock_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE stock_management;


CREATE TABLE IF NOT EXISTS products (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(150) NOT NULL,               
  reference        VARCHAR(50)  NOT NULL UNIQUE,         
  description      TEXT,                                 
  category         VARCHAR(100) NOT NULL,                
  quantity         INT NOT NULL DEFAULT 0,                
  alert_threshold  INT NOT NULL DEFAULT 5,               
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  
  CONSTRAINT chk_quantity_positive CHECK (quantity >= 0),
  CONSTRAINT chk_threshold_positive CHECK (alert_threshold >= 0)
);


INSERT INTO products (name, reference, description, category, quantity, alert_threshold) VALUES
('Casque audio Bluetooth', 'AUD-001', 'Casque sans fil, autonomie 20h',        'Audio',         15, 5),
('Câble USB-C 1m',         'CAB-002', 'Câble de charge rapide',                'Accessoires',    3, 5),
('Souris sans fil',        'PER-003', 'Souris ergonomique 2.4GHz',             'Périphériques',  0, 5),
('Clavier mécanique',      'PER-004', 'Clavier rétroéclairé switches rouges',  'Périphériques',  8, 3),
('Enceinte portable',      'AUD-005', 'Enceinte Bluetooth étanche IPX7',       'Audio',          2, 4);
