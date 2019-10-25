// =============================================================================
// npm packages
// =============================================================================
require('dotenv').config()
// var to require mysql package
const mysql = require('mysql')
// var to require keys
const keys = require('./keys.js')
// var to require gradient string package
const gradient = require('gradient-string')
// var to require file system package
const fs = require('fs')
// var to require inquirer package
const inquirer = require('inquirer')
// var to hold password
const gateKey = keys.mysql_db
// var to require table package
const Table = require('cli-table')
// =============================================================================
// Global Variables
// =============================================================================
// var to hold mysql config
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port if not 3306
  port: 3306,
  // Your username
  user: gateKey.id,

  // Your password
  password: gateKey.key,
  database: 'bamazon_db'
})
// var to hold inventory
let inventory = []
const display = '*****************************************'
const banner = '\n' + display + '  Manager Access  ' + display
const headerColor = 'yellow'
const borderColor = 'green'
connection.connect(function (err) {
  if (err) throw err
  console.log(gradient.vice('connected as id ' + connection.threadId + '\n'))
  ask()
})

function displayProducts () {
  var table = new Table({
    style: { head: [headerColor], border: [borderColor] },
    head: ['Item Id', 'Name', 'Console', 'Price', 'Quantity'],
    colWidths: [9, 50, 15, 10, 10]
  })
  inventory = []
  console.log('Selecting all products...\n')
  connection.query('SELECT * FROM products', function (err, result) {
    if (err) throw err
    // Log all results of the SELECT statement
    for (var i = 0; i < result.length; i++) {
      table.push([result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity])
      inventory.push(result[i].item_id)
    }
    console.log(gradient.vice(banner))
    console.log(table.toString())
  })
}

function updateProducts (product, newQuant) {
  connection.query('UPDATE products SET ? WHERE ?',
    [
      {
        stock_quantity: newQuant
      },
      {
        item_id: product
      }
    ],
    function (error, newResult) {
      if (error) throw error
      console.log(gradient.vice(newResult.affectedRows + ' products have been added!!\n'))
      displayProducts()
    }
  )
}

// function to ask whether to start next game
function nextGame () {
  // use inquirer to confirm continued play
  inquirer.prompt([
    {
      type: 'confirm',
      message: gradient.vice('Would you like to make another purchase?\n'),
      name: 'confirm',
      default: true
    }]).then(function (foolish) {
    // if foolish enough to keep playing
    if (foolish.confirm) {
      displayProducts()
    } else {
      // if not foolish, let player down as easily as possible
      console.log(gradient.fruit('\nThank you coming'))
      connection.end()
    }
  })
}

function lowInventory () {
  var lowTable = new Table({
    style: { head: [headerColor], border: [borderColor] },
    head: ['Item Id', 'Name', 'Console', 'Price', 'Quantity'],
    colWidths: [9, 50, 15, 10, 10]
  })
  connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (error, result) {
    if (error) throw error
    for (var i = 0; i < result.length; i++) {
      lowTable.push([result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity])
      inventory.push(result[i].item_id)
    }
    console.log(gradient.vice(banner))
    console.log(lowTable.toString())
    ask()
  })
}

function newInventory () {
  displayProducts()
  inquirer.prompt([
    {
      type: 'input',
      message: gradient.vice('What is the ITEM ID of the product you would like to add?'),
      name: 'itemID',
      validate: function (value) {
        // Force customer to enter only item ids
        return inventory.includes(parseFloat(value))
      }
    },
    {
      type: 'input',
      message: gradient.vice('How many units of the products would you like to add?'),
      name: 'itemQuantity',
      validate: function (value) {
        var valid = !isNaN(parseFloat(value))
        return valid || 'Please enter a number'
      },
      filter: Number
    }
  ]).then(function (answers) {
    updateProducts(answers.itemID, answers.itemQuantity)
  })
}

function createProduct (newProduct) {
  connection.query('INSERT INTO products SET ?',
    {
      product_name: newProduct.itemName,
      department_name: newProduct.itemDepartment,
      price: newProduct.itemPrice,
      stock_quantity: newProduct.itemQuantity
    },
    function (error, result) {
      if (error) throw error
      console.log(result.affectedRows + ' product added!\n')
      displayProducts()
    }
  )
}

function newProduct () {
  inquirer.prompt([
    {
      type: 'input',
      message: gradient.vice('What is the name?'),
      name: 'itemName'
    },
    {
      type: 'list',
      message: gradient.vice('What department?'),
      name: 'itemDepartment',
      choices: ['Xbox One', 'Playstation 4', 'Nintendo Switch', 'PC-LOL!']
    },
    {
      type: 'input',
      message: gradient.vice('What is the price?'),
      name: 'itemPrice',
      validate: function (value) {
        var valid = !isNaN(parseFloat(value))
        return valid || 'Please enter a number'
      },
      filter: Number
    },
    {
      type: 'input',
      message: gradient.vice('How many units of the products would you like to add?'),
      name: 'itemQuantity',
      validate: function (value) {
        var valid = !isNaN(parseFloat(value))
        return valid || 'Please enter a number'
      },
      filter: Number
    }
  ]).then(function (answers) {
    createProduct(answers)
  })
}

function menuOptions (choice) {
  switch (choice) {
    case 'View Products for Sale':
      displayProducts()
      ask()
      break
    case 'View Low Inventory':
      lowInventory()
      ask()
      break
    case 'Add to Inventory':
      newInventory()
      ask()
      break
    case 'Add New Product':
      newProduct()
      break
  }
}

// ask user what they want to do.
function ask () {
  inquirer.prompt([
    {
      type: 'list',
      message: gradient.vice('What is the ITEM ID of the product you would like to buy?'),
      name: 'options',
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }
  ]).then(function (answer) {
    menuOptions(answer.options)
  })
}
