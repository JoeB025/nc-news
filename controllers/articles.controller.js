const { selectArticles, selectOrderedArticles } = require('../models/articles.model')


exports.getArticles = (req, res, next) => {
  const { article_id } = req.params;
  selectArticles(article_id).then((article) => {
    res.status(200).send({ article });
  })
  .catch((err) => {
    next(err)
  })
};



exports.getOrderedArticles = (req, res, next) => {
  const { sort_by } = req.params
  const { order } = req.params 

  selectOrderedArticles(sort_by, order).then((article) => {
    res.status(200).send({ article });
  })
  .catch((err) => {
    next(err)
  })
}










