const request = require('supertest');
const app = require('../db/app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js')
const endpoints = require('../endpoints.json')



afterAll(() => db.end());

beforeEach(() => seed(testData));


// api/topics 
describe('app', () => {
  describe('/api/topics', () => {
    test('GET /topics should return a list of all the topics and status code 200', () => {
      return request(app)
      .get('/api/topics')
      .expect(200)
      .then((res) => {
        expect(res.body.topics.length).toBe(3); 
          res.body.topics.forEach((topic) => {
            const objectKeys = Object.keys(topic)
            expect(objectKeys.includes('slug')).toBe(true)
            expect(objectKeys.includes('description')).toBe(true)
            expect(typeof topic.slug).toBe('string')
            expect(typeof topic.description).toBe('string')
          })
        })
      })
    test('GET /request should return an error status code of 404 with the message endpoint not found', () => {
      return request(app)
      .get('/api/noTopics')
      .expect(404)
      .then((res) => {
          expect(res.body).toEqual({Status: 404, msg: 'endpoint not found'})
          expect(res.body.msg).toBe('endpoint not found')
        })
      })
    })
  }) 



// api 

describe('app', () => {
  test('GET/ api should return a description of all other endpoints', () => {
      return request(app)
      .get('/api')
      .expect(200)
      .then((res) => {
        expect(typeof res).toBe('object')
        expect(res.body.endpoints).toEqual(endpoints)

        for (const key in res.body.endpoints) {
          expect(typeof res.body.endpoints[key].description).toBe('string')
          if (key !== 'GET /api') {
          expect(Array.isArray(res.body.endpoints[key].queries)).toBe(true)
          expect(typeof res.body.endpoints[key].exampleResponse).toBe('object')
          }
        }
      })
    })
})



// article 


describe('app', () => {
  describe('/api/articles/:article_id', () => {
    test('GET /articles should return the single requested article object and status code 200', () => {
      return request(app)
      .get('/api/articles/1') 
      .expect(200)
      .then((res) => {
       expect(res.body.article.title).toBe('Living in the shadow of a great man')
       expect(res.body.article.topic).toBe('mitch')
       expect(res.body.article.author).toBe('butter_bridge')
       expect(res.body.article.body).toBe('I find this existence challenging')
       expect(res.body.article.created_at).toBe('2020-07-09T20:11:00.000Z')
       expect(res.body.article.votes).toBe(100)
       expect(typeof res.body.article.votes).toBe('number')
       expect(res.body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
          })
        })

    test('GET /articles should return the single requested article object and status code 200', () => {
      return request(app)
        .get('/api/articles/5') 
        .expect(200)
        .then((res) => {
          expect(res.body.article.title).toBe('UNCOVERED: catspiracy to bring down democracy')
          expect(res.body.article.topic).toBe('cats')
          expect(res.body.article.author).toBe('rogersop')
          expect(res.body.article.body).toBe('Bastet walks amongst us, and the cats are taking arms!');
          })
        })
    test('GET /articles should return a status code 404 with the message endpoint not found', () => {
      return request(app)
        .get('/api/no-articles/1') 
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({Status: 404, msg: 'endpoint not found'})
          expect(res.body.msg).toBe('endpoint not found')
          })
        })
    test('GET /articles should return a status code 404 with the message endpoint not found', () => {
      return request(app)
        .get('/api/articles/14324234') 
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual({status: 400, msg : 'Bad request'})
          expect(res.body.msg).toBe('Bad request')
          })
        })
      })
    }) 



    // get ordered articles 

    describe('app', () => {
      describe('/api/articles', () => {
        test('GET /articles all articles, removing the body key and adding in a count of number of comment. Status code 200', () => {
          return request(app)
          .get('/api/articles/') 
          .expect(200)
          .then((res) => {
            res.body.article.forEach((obj) => {
              expect(typeof obj).toBe('object')
              expect(typeof Number(obj.number_of_comments)).toBe('number')
              expect(obj.body).toBe(undefined)
              expect(typeof obj.author).toBe('string')
              expect(typeof obj.article_id).toBe('number')
              })
            })
          })
        test('GET /articles all articles in order by date created and return a status code of 200', () => {
          return request(app)
          .get('/api/articles') 
          .expect(200)
          .then((res) => {
            expect(res.body.article).toBeSortedBy('created_at', {descending : true});
            expect(res.body.article).not.toBeSortedBy('created_at', {ascending : true})
              })
            })
          test('GET /articles should return an error code of 404 with the message endpoint not found ', () => {
            return request(app)
            .get('/api/articlessss') 
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toBe('endpoint not found')
              })
          })
        })
      })

 







// /api/articles/:article_id/comments

describe('app', () => {
  describe('/api/articles/:article_id/comments', () => {
    test('GET / Check server responds with an array of comments and each required property is present. Status code 200', () => {
      return request(app)
      .get('/api/articles/1/comments') 
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.comments)).toBe(true)
        expect(res.body.comments.length).not.toBe(0)

        res.body.comments.forEach((comment) => {
          expect(comment.article_id).toBe(1)
          expect(comment.hasOwnProperty('body')).toBe(true)
          expect(comment.hasOwnProperty('votes')).toBe(true)
          expect(typeof comment.votes).toBe('number')
          expect(comment.hasOwnProperty('created_at')).toBe(true)
          expect(comment.hasOwnProperty('author')).toBe(true)
        })
    })
  })
  test('GET / Check comments are ordered with the most recent first. Status code 200', () => {
    return request(app)
    .get('/api/articles/1/comments') 
    .expect(200)
    .then((res) => {
      expect(res.body.comments).toBeSortedBy('created_at', {descending : true});
      expect(res.body.comments).not.toBeSortedBy('invalid_key', {descending : true});
      expect(res.body.comments).not.toBeSortedBy('created_at', {ascending : true})
  })
})
    test('GET / Check server responds with an error code of 404 when given an endpoint that doesn\'t exist', () => {
      return request(app)
      .get('/api/articles/9999/comments') 
      .expect(400)
      .then((res) => {
        console.log(res.body)
        expect(res.body.msg).toBe('Bad request')
    })
  })
  test('GET /request should return a status code 400 with the message Bad request', () => {
    return request(app)
      .get('/api/articles/1/commentsss') 
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe('endpoint not found')
        })
      })
    }) 
  }) 