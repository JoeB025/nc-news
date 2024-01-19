const db = require('../db/connection')


exports.selectArticles = (article_id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id=$1;', [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'article does not exist'
        });
      }
      return result.rows[0];
    });
};



exports.selectOrderedArticles = (sort_by = 'created_at', order = 'desc', topic = '') => {

  const validSortQueries = ['created_at']
  if(!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status : 400, msg : 'invalid sort_by query'})
  }

  const validTopicQueries = ['mitch', 'cats', 'paper', '']
  if(!validTopicQueries.includes(topic)) {
    return Promise.reject({ status : 400, msg : 'Not a valid topic!'})
  }

  let query = `
        SELECT
        articles.author, articles.title, articles.article_id,
        articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.article_id) AS number_of_comments
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        `;

      const queryParameters = [];

      if(topic) {   
        query += ` WHERE topic = $1`;
        queryParameters.push(topic)
      }

      // console.log(queryParameters)
        
      query += 
        ` GROUP BY articles.article_id
         ORDER BY articles.${sort_by} ${order};`
         
    return db.query(query, queryParameters).then((result) => {
        return result.rows
    })
}







exports.selectArticleComments = (article_id, sort_by = 'created_at', order = 'desc') => {
  let query =`
  SELECT * 
  FROM comments
  WHERE article_id=$1
  ORDER BY ${sort_by} ${order};
  `
  return db.query(query, [article_id]).then((result) => {
    return result.rows
  })
}



// task 7 post 

exports.insertNewComment = ({body, username}, article_id ) => {

// console.log(body)
// console.log(username)
// console.log(article_id)

  let query = 
    `INSERT INTO comments (body, author, article_id)
    VALUES ($1, $2, $3) 
    RETURNING *
    `;
    return db.query(query, [body, username, article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'article does not exist'
        });
      }
    // console.log('in model')
    return result.rows

})
}


exports.swapComments = (article_id, incComment) => {

  let query =
  `UPDATE articles
  SET votes = votes + ${incComment.inc_votes}
  WHERE article_id = ${article_id} 
  RETURNING *`

  return db.query(query)
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








