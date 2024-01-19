const { selectUsers } = require('../models/users.model')

exports.getUsers = (req, res, next) => {
  // console.log('in controller')
  selectUsers().then((users) => {
    res.status(200).send({users})
  }).catch((err) => {
    next(err)
  })
}; 