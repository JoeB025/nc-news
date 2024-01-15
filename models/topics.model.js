const db = require('../db/connection')



exports.selectTopics = () => {
  // console.log('in model')
  return db.query('SELECT * FROM topics').then((result) => {
    // console.log(result.rows, ' result <<<<<<<<<<<<< in model')
    return result.rows
  })
}