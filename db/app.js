const express = require('express')
const app = express()
const { getTopics } = require('../controllers/topics.controller')

app.use(express.json());


app.get('/api/topics', getTopics);

app.all('*', (req, res) => {
  res.status(404).send({Status: 404, msg : 'endpoint not found'})
}) // rejects all promises where and endpoint is not found



app.use((err, req, res, next) => {
  console.log(err, 'err')
  res.status(400).send({status: 400, msg : 'Bad request'})
  next()
})

module.exports = app;