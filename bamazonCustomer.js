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
let inStock = []
const display = '**************************************'
const banner = '\n' + display + '  Welcome to Bamazon!!  ' + display
const headerColor = 'yellow'
const borderColor = 'green'
connection.connect(function (err) {
  if (err) throw err
  console.log(gradient.vice('connected as id ' + connection.threadId + '\n'))
})

function logo () {
  fs.readFile('logo.txt', 'utf8', function (error, banner) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error)
    }
    // display logo
    console.log(gradient.summer.multiline(banner))
  })
}

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
    console.log(gradient.vice('Press any key to continue'))
    ask()
  })
}

function updateProducts (product, newQuant, oldQuant) {
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
      console.log(gradient.vice(newResult.affectedRows + ' products updated!!\n'))
      displayPurchase(product, oldQuant)
    }
  )
}

function displayPurchase (product, quantity) {
  var updatedTable = new Table({
    style: { head: [headerColor], border: [borderColor] },
    head: ['Name', 'Console', 'Price', 'Quantity', 'Total'],
    colWidths: [50, 15, 10, 10, 15]
  })
  connection.query('SELECT * FROM products WHERE item_id=?', [product], function (error, result) {
    if (error) throw error
    var cost = (result[0].price * quantity).toFixed(2)
    updatedTable.push([result[0].product_name, result[0].department_name, result[0].price, result[0].stock_quantity, cost])
    console.log(gradient.vice('Your purchase'))
    console.log(updatedTable.toString())
    console.log(gradient.vice('Total purchase = $' + cost))
    nextGame()
  })
}

function purchasing (product, quant) {
  connection.query('SELECT * FROM products WHERE item_id=?', [product], function (error, result) {
    if (error) throw error
    if (quant > result[0].stock_quantity) {
      console.log(gradient.summer('Insufficient Quantity!!'))
      nextGame()
    } else {
      var newQuant = result[0].stock_quantity - quant
      updateProducts(product, newQuant, quant)
    }
  })
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
// start app
start()
