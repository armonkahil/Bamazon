DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  product_sales DECIMAL (10, 2) NOT NULL,
  PRIMARY KEY (item_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Forza Motorsport 7 Ultimate Edition", "Xbox One", 59.99, 10, 0);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Gears of War 5 Ultimate Edition", "Xbox One", 79.99, 10, 0);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Cyberpunk 2077 Collector's Edition", "Xbox One", 249.99, 10, 0);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Halo 5 Guardians Deluxe Edition", "Xbox One", 89.99, 10, 0);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Darksiders Genesis Nephilim Edition", "Xbox One", 379.99, 10, 0);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Destroy All Humans! Crypto-137 Edition", "Playstation 4", 399.99, 10, 0);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("THe Last of Us Part II Ellie Edition", "Playstation 4", 229.99, 10, 0);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Jump Force Collector's Edition", "Playstation 4", 259.99, 10, 0);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Rock Band 4 Band-in-a-Box Bundle", "Playstation 4", 1199.99, 10, 0);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Borderlands Gentleman Claptrap Edition", "Playstation 4", 520.99, 10, 0);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Call of Duty: Black Ops III Jugegernog Edition", "Playstation 4", 1199.99, 10, 0);

SELECT item_id as ID, product_name as Name, department_name as Department, price as Price, stock_quantity as Quantity, product_sales as Sales FROM products 

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) NOT NULL,
  over_head_costs DECIMAL (10,2) NOT NULL,
  product_sales DECIMAL (10,2) NOT NULL,
  PRIMARY KEY (department_id)
)

INSERT INTO departments (department_name, over_head_costs, product_sales)
VALUES ('Xbox One', 2000, (SELECT SUM(product_sales) FROM products WHERE department_name = 'XBOX ONE'))

INSERT INTO departments (department_name, over_head_costs, product_sales)
VALUES ('PlayStation 4', 2000, (SELECT SUM(product_sales) FROM products WHERE department_name = 'Playstation 4'))
