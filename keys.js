var gradient = require('gradient-string')
console.log(gradient.vice('\nloading credentials\n'))

exports.mysql_db = {
  id: process.env.MySQL_ID,
  key: process.env.MySQL_KEY
}
