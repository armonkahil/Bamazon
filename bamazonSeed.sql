DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Forza Motorsport 7 Ultimate Edition", "Xbox One", 59.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Gears of War 5 Ultimate Edition", "Xbox One", 79.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cyberpunk 2077 Collector's Edition", "Xbox One", 249.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Halo 5 Guardians Deluxe Edition", "Xbox One", 89.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Darksiders Genesis Nephilim Edition", "Xbox One", 379.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Destroy All Humans! Crypto-137 Edition", "Playstation 4", 399.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("THe Last of Us Part II Ellie Edition", "Playstation 4", 229.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Jump Force Collector's Edition", "Playstation 4", 259.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Rock Band 4 Band-in-a-Box Bundle", "Playstation 4", 1199.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Borderlands Gentleman Claptrap Edition", "Playstation 4", 520.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Call of Duty: Black Ops III Jugegernog Edition", "Playstation 4", 1199.99, 10);