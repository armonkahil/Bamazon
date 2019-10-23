require('dotenv').config()
// var to require mysql package
var mysql = require('mysql')
// var to require keys
var keys = require('./keys.js')
// var to require gradient string package
var gradient = require('gradient-string')
// var to require file system package
var fs = require('fs')
// var to require inquirer package
var inquirer = require('inquirer')
// var to hold password
var gateKey = keys.mysql_db
// var to require table package
const Table = require('cli-table')
// var to configure table displayed
const table = new Table({
  style: { head: ['green'], border: ['blue'] },
  head: ['Item Id', 'Name', 'Console', 'Price', 'Quantity'],
  colWidths: [9, 50, 15, 10, 10]
})
// var to hold mysql config
var connection = mysql.createConnection({
  host: 'localhost',

  // Your port if not 3306
  port: 3306,
  // Your username
  user: gateKey.id,

  // Your password
  password: gateKey.key,
  database: 'bamazon_db'
})

connection.connect(function (err) {
  if (err) throw err
  console.log('connected as id ' + connection.threadId + '\n')
})

function logo () {
  fs.readFile('logo.txt', 'utf8', function (error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error)
    }
    // display logi
    console.log(gradient.summer.multiline(data))
  })
}

function displayProducts () {
  var display = '****************************************'
  console.log('Selecting all products...\n')
  connection.query('SELECT * FROM products', function (err, result) {
    if (err) throw err
    // Log all results of the SELECT statement
    for (var i = 0; i < result.length; i++) {
      table.push([result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity])
    }
    console.log('\n' + display + 'Welcome to Bamazon!!' + display)
    console.log(table.toString())
    console.log('Press any key to continue')
    connection.end()
  })
}
// ask user what they want to do.
function ask () {
  inquirer.prompt([
    {
      type: 'input',
      message: 'What is the ITEM ID of the product you would like to buy?',
      name: 'saleID',
      validate: function (value) {
        if (isNaN(value) === false) {
          return true
        }
        return false
      }
    },
    {
      type: 'input',
      message: 'How many units of the products would you like to buy?',
      name: 'saleQuantity',
      validate: function (value) {
        if (isNaN(value) === false) {
          return true
        }
        return false
      }
    }
  ]).then(function (answers) {
    console.log(answers)
  })
}

function start () {
  logo()
  displayProducts()
  ask()
}
// start app
start()
