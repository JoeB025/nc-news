const db = require('../db/connection')



exports.selectUsers = () => {
  // console.log('in model')
  return db.query('SELECT * FROM users').then((result) => {
    // console.log(result.rows, ' result <<<<<<<<<<<<< in model')
    return result.rows
  })
}