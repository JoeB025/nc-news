const express = require('express')
const app = express()
const { getTopics } = require('../controllers/topics.controller')
const { getAllData } = require('../controllers/api.controller')
const { getArticles, getOrderedArticles } = require('../controllers/articles.controller')

app.use(express.json());


app.get('/api/topics', getTopics); // gets the topics data

app.get('/api', getAllData); // gets all the data 

app.get('/api/articles/:article_id', getArticles) // gets the app by ID

app.get('/api/articles', getOrderedArticles) // gets articles in an ordered format 



app.all('*', (req, res) => {
  res.status(404).send({Status: 404, msg : 'endpoint not found'})
}) // rejects all promises where and endpoint is not found



app.use((err, req, res, next) => {
  res.status(400).send({status: 400, msg : 'Bad request'})
  next()
})

module.exports = app;