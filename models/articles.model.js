const db = require('../db/connection')


exports.selectArticles = (article_id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id=$1;', [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
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
        LEFT JOIN comments on articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order};`
    return db.query(query).then((result) => {
        return result.rows
    })
}