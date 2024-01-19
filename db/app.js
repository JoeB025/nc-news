const express = require('express')
const app = express()
const { getTopics } = require('../controllers/topics.controller')
const { getAllData } = require('../controllers/api.controller')
const { getArticles, getOrderedArticles, getArticleComments, insertComments, replaceComments } = require('../controllers/articles.controller')
const { deleteComments } = require('../controllers/comments.controller')
const { getUsers } = require('../controllers/users.controller')


app.use(express.json());


app.get('/api/topics', getTopics); // gets the topics data

app.get('/api', getAllData); // gets all the data 

app.get('/api/articles/:article_id', getArticles) // gets the app by ID

app.get('/api/articles', getOrderedArticles) // gets articles in an ordered format 

app.get('/api/articles/:article_id/comments', getArticleComments);

app.post('/api/articles/:article_id/comments', insertComments);

app.patch('/api/articles/:article_id', replaceComments);

app.delete('/api/comments/:comment_id', deleteComments); 

app.get('/api/users', getUsers); 







app.all('*', (req, res) => {
  res.status(404).send({Status: 404, msg : 'endpoint not found'})

}) // rejects all promises where an endpoint is not found





app.use((err, req, res, next) => {
  // console.log(err)
  // console.log(err.code)
  // console.log(err.detail)

  if (err.code === '23503' && err.detail.includes('article_id')) {
    res.status(404).send({Status: 404, msg : 'article does not exist'})
  } else if (err.code === '23503' && err.detail.includes('user')) {
    res.status(404).send({Status: 404, msg : 'Username not found'})
  } else if (err.code === '22P02' || err.code === '23502' || err.code === '42883' || err.code === '42703') {
  res.status(400).send({msg : 'Bad request'})
  
} else if (err.status && err.msg) {
    res.status(err.status).send({msg : err.msg})
}
  next()
})






module.exports = app;