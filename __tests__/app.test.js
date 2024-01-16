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
        .get('/api/articles/999999999') 
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual({status: 400, msg : 'Bad request'})
          expect(res.body.msg).toBe('Bad request')
          })
        })
      })
    }) 



 


