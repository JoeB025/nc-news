const { selectComments } = require('../models/comments.model')

exports.getComments = (req, res, next) => {
  selectComments().then((comment) => {
    res.status(200).send({ comment });
  })
  .catch((err) => {
    next(err)
  })
};