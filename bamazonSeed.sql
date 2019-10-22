DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  item_id int NOT NULL,
  product_name VARCHAR(50) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (1, "Forza Motorsport 7 Ultimate Edition", "Xbox One", 59.99, 10);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (9, "Gears of War 5 Ultimate Edition", "Xbox One", 79.99, 10);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (21, "Cyberpunk 2077 Collector's Edition", "Xbox One", 249.99, 10);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (25, "Halo 5 Guardians Deluxe Edition", "Xbox One", 89.99, 10);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (34, "Darksiders Genesis Nephilim Edition", "Xbox One", 379.99, 10);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (35, "Destroy All Humans! Crypto-137 Edition", "Playstation 4", 399.99, 10);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (58, "THe Last of Us Part II Ellie Edition", "Playstatio 4", 229.99, 10);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (67, "Jump Force Collector's Edition", "Playstation 4", 259.99, 10);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (73, "Rock Band 4 Band-in-a-Box Bundle", "Playstation 4", 1199.99, 10);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (83, "Borderlands Gentleman Claptrap Edition", "Playstation 4", 520.00, 10);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (96, "Call of Duty: Black Ops III Jugegernog Edition", "Playstation 4", 1199.99, 10);