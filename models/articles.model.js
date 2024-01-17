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



exports.selectOrderedArticles = (sort_by = 'created_at', order = 'desc') => {
  let query = `
        SELECT
        articles.author, articles.title, articles.article_id,
        articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.article_id) AS number_of_comments
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order};`
    return db.query(query).then((result) => {
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



