const endpoints = require('../endpoints.json')

exports.getAllData = (req, res, next) => {
    res.status(200).send({ endpoints : endpoints})
  }