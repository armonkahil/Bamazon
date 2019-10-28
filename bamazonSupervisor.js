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
// var to require inquirer package
const inquirer = require('inquirer')
// var to require table package
const Table = require('cli-table')// var to hold password
// var to require chalk package
const chalk = require('chalk')
// var for to hold login credentials
const gateKey = keys.mysql_db
// var for text color
const normal = chalk.hex('#F58148')

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
const display = '*******************************'
const banner = '\n\n' + display + ' Supervisor Access ' + display
// =============================================================================
// Table variables
// =============================================================================
const headerColor = 'white'
const borderColor = 'blue'
const tableKey = {
  style: { head: [headerColor], border: [borderColor] },
  head: ['Department ID', 'Name', 'Overhead Cost', 'Product Sales', 'Total Profit'],
}

connection.connect(function (err) {
  if (err) throw err
  console.log(gradient.vice('connected as id ' + connection.threadId + '\n'))
  ask()
})

function buildtable (result, store) {
  for (var i = 0; i < result.length; i++) {
    store.push(([result[i].department_id, result[i].department_name, result[i].over_head_costs, result[i].Sales, result[i].Profit]))
    if (!inventory.includes(result[i].department_name)) {
      inventory.push(result[i].department_name)
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
  console.log(gradient.vice('\nConnecting to store...'))
  // mysql connection
  connection.query('SELECT B.department_id, A.department_name, B.over_head_costs, SUM(A.product_sales) AS Sales, SUM(A.product_sales) - B.over_head_costs AS Profit FROM products A, departments B WHERE A.department_name = B.department_name GROUP BY department_name ORDER by department_id', function (err, result) {
    if (err) throw err
    buildtable(result, table)
    ask()
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

function createDepartment (newProduct) {
  connection.query('INSERT INTO departments SET ?',
    {
      department_name: newProduct.deptName,
      over_head_costs: newProduct.itemPrice,
      product_sales: 0
    },
    function (error, result) {
      if (error) throw error
      console.log(result.affectedRows + ' product added!\n')
      displayProducts()
    }
  )
}

function newDepartment () {
  inquirer.prompt([
    {
      type: 'input',
      message: normal('What is the name new department ?'),
      name: 'deptName'
    },
    {
      type: 'input',
      message: normal('What is the overhead cost?'),
      name: 'itemPrice',
      validate: function (value) {
        var valid = !isNaN(parseFloat(value))
        return valid || 'Please enter a number'
      },
      filter: Number
    }
  ]).then(function (answers) {
    createDepartment(answers)
  })
}

function menuOptions (choice) {
  switch (choice) {
    case 'View Products Sales by Department':
      displayProducts()
      break
    case 'Create New Department':
      newDepartment()
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
      message: normal('Supervisor Menu'),
      name: 'options',
      choices: ['View Products Sales by Department', 'Create New Department', 'Quit']
    }
  ]).then(function (answer) {
    menuOptions(answer.options)
  })
}
