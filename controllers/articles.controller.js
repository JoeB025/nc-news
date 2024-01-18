const { selectArticles, selectOrderedArticles, selectArticleComments, insertNewComment, swapComments } = require('../models/articles.model')
const { checkArticles } = require('../db/seeds/utils')

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
  const { sort_by } = req.query
  const { order } = req.query 

  selectOrderedArticles(sort_by, order).then((article) => {
    res.status(200).send({ article });
  })
  .catch((err) => {
    next(err)
  })
}



exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params
  const { sort_by } = req.query
  const { order } = req.query

  const checkForComments = checkArticles(article_id)
  const sortedComments = selectArticleComments(article_id, sort_by, order)

  Promise.all([checkForComments, sortedComments])
  .then((comments) => {
    res.status(200).send({comments : comments[1]});
  })
  .catch((err) => {
    next(err)
  })
}


// post 

exports.insertComments = (req, res, next) => {
  const newComment = req.body;
  const { article_id } = req.params 


  insertNewComment(newComment, article_id)
  .then((comment) => {
    res.status(201).send({comment})
  }).catch((err) => {
    next(err)
  })
}; 






// patch 

exports.replaceComments = (req, res, next) => {
  
  const { article_id } = req.params 
  const incComment = req.body 
  
swapComments(article_id, incComment)
.then((article) => {
  res.status(200).send({article})
}).catch((err) => {
  next(err)
})
}






