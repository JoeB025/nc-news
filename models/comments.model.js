const db = require('../db/connection')



exports.removeCommentsBy = (comment_id) => {

  let query =
  `DELETE FROM comments 
  WHERE comment_id = $1;`

  return db.query(query, [comment_id])
  .then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: 'article does not exist'
      });
    }
    return result.rows[0]
  })
}