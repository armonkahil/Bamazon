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
// var to require chalk
const chalk = require('chalk')
const normal = chalk.hex('#FF8800')
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
// var to hold banner
const display = '**************************************'
const banner = '\n' + display + '  Welcome to Bamazon!!  ' + display
// =============================================================================
// table variables
// =============================================================================
const headerColor = 'yellow'
const borderColor = 'green'
const tableKey = {
  style: { head: [headerColor], border: [borderColor] },
  head: ['Item Id', 'Name', 'Console', 'Price', 'Quantity'],
  colWidths: [9, 50, 15, 10, 10]
}
const updatedtableKey = {
  style: { head: [headerColor], border: [borderColor] },
  head: ['Name', 'Console', 'Price', 'Quantity', 'Total'],
  colWidths: [50, 15, 10, 10, 9]
}

connection.connect(function (err) {
  if (err) throw err
  console.log(gradient.vice('connected as id ' + connection.threadId + '\n'))
  // start app
  start()
})
// Custom logo display function
function logo () {
  fs.readFile('logo.txt', 'utf8', function (error, banner) {
    if (error) {
      return console.log(error)
    }
    // display logo
    console.log(gradient.summer.multiline(banner))
  })
}

// function to display data in a table
function displayProducts () {
  // var to reset table variable
  var table = new Table(tableKey)
  // var to reset inventory array
  inventory = []
  console.log(gradient.vice('\nConnecting to store...\n'))
  // mysql connection
  connection.query('SELECT * FROM products', function (err, result) {
    if (err) throw err
    for (var i = 0; i < result.length; i++) {
      // push data to Table constructor
      table.push([result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity])
      // push item id in array for validation in prompts
      inventory.push(result[i].item_id)
    }
    // display banner
    console.log(gradient.vice(banner))
    // display table
    console.log(table.toString() + '\n')
    ask()
  })
}

// update database function
function updateProducts (product, newQuant, oldQuant, sales) {
  connection.query('UPDATE products SET ? WHERE ?',
    [
      {
        // update database quantity with new quantity
        stock_quantity: newQuant,
        product_sales: sales
      },
      {
        item_id: product
      }
    ],
    function (error, newResult) {
      if (error) throw error
      console.log(gradient.vice('\n' + newResult.affectedRows + ' products updated!!\n'))
      displayPurchase(product, oldQuant)
    }
  )
}

// function to display purchase information
function displayPurchase (product, quantity) {
  var updatedTable = new Table(updatedtableKey)
  connection.query('SELECT * FROM products WHERE item_id=?', [product], function (error, result) {
    if (error) throw error
    var cost = (result[0].price * quantity).toFixed(2)
    updatedTable.push([result[0].product_name, result[0].department_name, result[0].price, result[0].stock_quantity, cost])
    console.log(gradient.vice('Your purchase'))
    console.log(updatedTable.toString() + '\n')
    console.log(gradient.vice('Total purchase = $' + cost))
    keepGoing()
  })
}

function purchasing (product, quant) {
  connection.query('SELECT * FROM products WHERE item_id=?', [product], function (error, result) {
    if (error) throw error
    if (quant > result[0].stock_quantity) {
      console.log(gradient.summer('Insufficient Quantity!!'))
      keepGoing()
    } else {
      var newQuant = result[0].stock_quantity - quant
      var sales = result[0].price + (result[0].price * quant)
      updateProducts(product, newQuant, quant, sales)
    }
  })
}

// function to ask whether to start continue
function keepGoing () {
  inquirer.prompt([
    {
      type: 'confirm',
      message: gradient.vice('Would you like to make another purchase?\n'),
      name: 'confirm',
      default: true
    }]).then(function (again) {
    // if confirmed
    if (again.confirm) {
      displayProducts()
    } else {
      // if not
      console.log(gradient.fruit('\nThank you coming'))
      connection.end()
    }
  })
}

// ask user what they want to do.
function ask () {
  inquirer.prompt([
    {
      type: 'input',
      message: gradient.vice('What is the ITEM ID of the product you would like to buy?'),
      name: 'saleID',
      validate: function (value) {
        // Force customer to enter only item ids
        return inventory.includes(parseFloat(value))
      }
    },
    {
      type: 'input',
      message: gradient.vice('How many units of the products would you like to buy?'),
      name: 'saleQuantity',
      validate: function (value) {
        // Force customer to enter a number
        var valid = !isNaN(parseFloat(value))
        return valid || 'Please enter a number'
      },
      filter: Number
    }
  ]).then(function (answers) {
    purchasing(answers.saleID, answers.saleQuantity)
  })
}

function start () {
  // uncomment to see custom Logo
  // logo()
  displayProducts()
}
