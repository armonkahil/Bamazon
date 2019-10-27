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
const chalk = require('chalk')
const normal = chalk.hex('#F58148')
const amy = chalk.hex('#AEBD44')

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

let deptArray = []
// var to hold banner
const display = '*****************************************'
const banner = '\n\n' + display + '  Manager Access  ' + display
// =============================================================================
// Table variables
// =============================================================================
const headerColor = 'white'
const borderColor = 'blue'
const tableKey = {
  style: { head: [headerColor], border: [borderColor] },
  head: ['Item Id', 'Name', 'Console', 'Price', 'Quantity'],
  colWidths: [9, 50, 15, 10, 10]
}

connection.connect(function (err) {
  if (err) throw err
  console.log(gradient.vice('connected as id ' + connection.threadId + '\n'))
  buildDept()
  ask()
})
function buildDept () {
  connection.query('SELECT B.department_id, A.department_name, B.over_head_costs, SUM(A.product_sales) AS Sales, SUM(A.product_sales) - B.over_head_costs AS Profit FROM products A, departments B WHERE A.department_name = B.department_name GROUP BY department_name ORDER by department_id', function (err, result) {
    if (err) throw err
    for (var i = 0; i < result.length; i++) {
      deptArray.push(result[i].department_name)
    }
  })
}

function buildtable (data, store) {
  for (var i = 0; i < data.length; i++) {
    store.push([data[i].item_id, data[i].product_name, data[i].department_name, data[i].price, data[i].stock_quantity])
    inventory.push(data[i].item_id)
    if (!deptArray.includes(data[i].department_name)) {
      deptArray.push(data[i].department_name)
    }
  }
  console.log(normal(banner))
  console.log(normal(store.toString() + '\n'))
}
// function to display table

function displayProducts () {
  // var to reset table variable
  var table = new Table(tableKey)
  // reset inventory array
  inventory = []
  deptArray = []
  console.log(gradient.vice('\nConnecting to store...'))
  // mysql connection
  connection.query('SELECT * FROM products', function (err, result) {
    if (err) throw err
    buildtable(result, table)
    ask()
  })
}
function newProductDisplay () {
  // var to reset table variable
  var table = new Table(tableKey)
  // reset inventory array
  inventory = []
  console.log(gradient.vice('\nConnecting to store...\n'))
  // mysql connection
  connection.query('SELECT * FROM products', function (err, result) {
    if (err) throw err
    buildtable(result, table)
    newInventory()
  })
}

// update database function
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
      displayProducts()
      console.log(normal('\n' + newResult.affectedRows + ' products updated!!\n'))
    }
  )
}

// function to ask whether to start continue
function keepGoing () {
  inquirer.prompt([
    {
      type: 'confirm',
      message: normal('Are you sure?\n'),
      name: 'confirm',
      default: false
    }]).then(function (again) {
    // if confirmed
    if (again.confirm) {
      ask()
    } else {
      // if not
      console.log(gradient.fruit('\nThank you coming'))
      connection.end()
    }
  })
}

// low inventory function
function lowInventory () {
  // reset table variable
  var lowTable = new Table(tableKey)
  connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (error, result) {
    if (error) throw error
    buildtable(result, lowTable)
    ask()
  })
}

// function to order new stock
function newInventory () {
  inquirer.prompt([
    {
      type: 'input',
      message: normal('What is the ITEM ID of the product you would like to add?'),
      name: 'itemID',
      validate: function (value) {
        // Force manager to enter only item ids
        return inventory.includes(parseFloat(value))
      }
    },
    {
      type: 'input',
      message: normal('How many units of the products would you like to add?'),
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
      stock_quantity: newProduct.itemQuantity,
      product_sales: 0
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
      message: normal('What is the name?'),
      name: 'itemName'
    },
    {
      type: 'list',
      message: normal('What department?'),
      name: 'itemDepartment',
      choices: deptArray
    },
    {
      type: 'input',
      message: normal('What is the price?'),
      name: 'itemPrice',
      validate: function (value) {
        var valid = !isNaN(parseFloat(value))
        return valid || 'Please enter a number'
      },
      filter: Number
    },
    {
      type: 'input',
      message: normal('How many units of the products would you like to add?'),
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
      break
    case 'View Low Inventory':
      lowInventory()
      break
    case 'Add to Inventory':
      newProductDisplay()
      break
    case 'Add New Product':
      newProduct()
      break
    case 'Quit':
      keepGoing()
  }
}

// ask user what they want to do.
function ask () {
  inquirer.prompt([
    {
      type: 'list',
      message: normal('Manager Menu'),
      name: 'options',
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Quit']
    }
  ]).then(function (answer) {
    menuOptions(answer.options)
  })
}
