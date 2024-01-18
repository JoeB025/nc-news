const { removeCommentsBy } = require('../models/comments.model')


// delete

exports.deleteComments = (req, res, next) => {

  const { comment_id } = req.params

  removeCommentsBy(comment_id)
  .then((comment) => {
    res.status(204).send({comment})
  }).catch((err) => {
    next(err)
  })
 }
