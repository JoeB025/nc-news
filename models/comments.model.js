const db = require('../db/connection')

exports.selectComments = () => {
  return db.query(`SELECT article_id FROM comments;`)
  .then((result) => {
 return result.rows
    })
}






// exports.selectCommentCount = () => {
//   return db.query(`SELECT article_id FROM comments;`)
//   .then((result) => {

// let num = 0
//     result.rows.forEach((key) => {
//       if (key.article_id > num) {
//         num = key.article_id
//       }
//     })

// const obj = {}
// let i = 1

// while (num >= i) {
//   let count = 0
//     result.rows.forEach((item) => {
//       if (item.article_id === i) {
//         obj[item.article_id] = count++ 
//       }

//     })
//     i++
//   }

// console.log(obj)
    
//  return result.rows
//     })
// }