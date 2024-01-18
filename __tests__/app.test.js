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
          expect(res.body.msg).toBe('endpoint not found')
          })
        })
    test('GET /articles should return a status code 404 with the message article does not exist', () => {
      return request(app)
        .get('/api/articles/14324234') 
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe('article does not exist')
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
            expect(res.body.article.length > 0).toBe(true)
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
          expect(typeof comment.body).toBe('string')
          expect(comment.hasOwnProperty('votes')).toBe(true)
          expect(typeof comment.votes).toBe('number')
          expect(comment.hasOwnProperty('created_at')).toBe(true)
          expect(typeof comment.created_at).toBe('string')
          expect(comment.hasOwnProperty('author')).toBe(true)
          expect(typeof comment.author).toBe('string')
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
    test('GET / Check server responds with an error code of 404 when given an article_id that could but does not yet exist', () => {
      return request(app)
      .get('/api/articles/99999/comments') 
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe('article does not exist')
    })
  })
  test('GET /request should return a status code 400 with the message Bad request when given not given a number for an article_id', () => {
    return request(app)
      .get('/api/articles/banana/comments') 
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('Bad request')
        })
      })
    }) 
  }) 




  // post /api/articles/:article_id/comments 


  describe('app', () => {
    describe('/api/articles/:article_id/comments', () => {
      test('Check data is posted with correct keys and data', () => {
        return request(app)
        .post('/api/articles/9/comments')
        .send({
          body : 'this is the body',
          username : 'butter_bridge'
        })
        .expect(201)
        .then((res) => {
          expect(res.body.comment[0]).toMatchObject(
            {
              comment_id: 19,
              body: 'this is the body',
              article_id: 9,
              author: 'butter_bridge',
              votes: 0
            })
            expect(typeof res.body.comment[0].body).toBe('string')
            expect(typeof res.body.comment[0].author).toBe('string')
            expect(res.body.comment[0].hasOwnProperty('created_at')).toBe(true)
        })
      })
      test('POST:404 responds with an appropriate status and error message when provided with an invalid username (no username exists)', () => {
        return request(app)
        .post('/api/articles/9/comments')
        .send({
          body : 'this is the body',
          username : 'margarine_bridge'
        })
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe('Username not found')
        })
      })
      test('POST:400 responds with an appropriate status and error message when not provided with a username', () => {
        return request(app)
        .post('/api/articles/9/comments')
        .send({
          body : 'this is the body'
        })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe('Bad request')
        })
      })

      test('POST:404 responds with an appropriate status and error message when provided with an incorrect username (no username exists)', () => {
        return request(app)
        .post('/api/bananas/9/comments')
        .send({
          body : 'this is the body',
          username : 'butter_bridge'
        })
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe('endpoint not found')
        })
      })
      test('POST:404 responds with an appropriate status and error message when provided with a bad username (no username exists)', () => {
        return request(app)
        .post('/api/articles/999/comments')
        .send({
          body : 'this is the body',
          username : 'butter_bridge'
        })
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe('article does not exist')
        })
      })
    })
  })








// patch /api/articles/:article_id

  describe('app', () => {
    describe('/api/articles/:article_id', () => {
      test('Check status code returns 200 for valid patch requests', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes : -1})
        .expect(200)
        })
        test('Check votes decrease by one and returns an object containing correct information', () => {
          return request(app)
          .patch('/api/articles/1')
          .send({inc_votes : -1})
          .expect(200)
          .then((res) => {
            expect(res.body.article).toMatchObject({
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              votes: 99,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            })
            expect(res.body.article.hasOwnProperty('article_id')).toBe(true)
            expect(typeof res.body.article.article_id).toBe('number')
            expect(res.body.article.hasOwnProperty('title')).toBe(true)
            expect(typeof res.body.article.title).toBe('string')
            expect(res.body.article.hasOwnProperty('topic')).toBe(true)
            expect(typeof res.body.article.topic).toBe('string')
            expect(res.body.article.hasOwnProperty('author')).toBe(true)
            expect(typeof res.body.article.author).toBe('string')
            expect(res.body.article.hasOwnProperty('body')).toBe(true)
            expect(typeof res.body.article.body).toBe('string')
            expect(res.body.article.hasOwnProperty('votes')).toBe(true)
            expect(typeof res.body.article.votes).toBe('number')
            expect(res.body.article.hasOwnProperty('article_img_url')).toBe(true)
            expect(typeof res.body.article.article_img_url).toBe('string')
          })
          })
          test('Check increment works for a different number', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({inc_votes : +15})
            .expect(200)
            .then((res) => {
              expect(res.body.article.votes).toBe(115)
          })
        })
        test('Check error 404 is returned for incorrect endpoint', () => {
          return request(app)
          .patch('/api/pokemon/1')
          .send({inc_votes : +15})
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe('endpoint not found')
          })
        })
        test('Check error 404 for valid requests that do not yet exist', () => {
          return request(app)
          .patch('/api/articles/100000')
          .send({inc_votes : +15})
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe('article does not exist')
          })
        })
        test('Check error 400 when passed a string of letters as an incrementor', () => {
          return request(app)
          .patch('/api/articles/1')
          .send({inc_votes : 'one'})
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe('Bad request')
          })
        })
        test('Check error 400 when passed in an invalid incrementor', () => {
          return request(app)
          .patch('/api/articles/1')
          .send({inc_votes : false})
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe('Bad request')
          })
        })
        test('Check error 400 when given incorrect object key', () => {
          return request(app)
          .patch('/api/articles/1')
          .send({increaseMyVoteCount : -1})
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe('Bad request')
          })
        })
    })
  })



  // delete /api/comments/:comment_id
  describe('app', () => {
    describe('/api/comments/:comment_id', () => {
      test('Check status code returns 204 for valid delete requests', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        })
      test('Check returned object is empty', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then((res) => {
          expect(res.body).toEqual({})
      })
    })
      test('Check error 404 for valid requests that do not yet exist', () => {
        return request(app)
        .delete('/api/comments/999')
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe('article does not exist')
        })
      })
      test('Check for error code 404 for endpoints that do not exist', () => {
        return request(app)
        .delete('/api/commentsss/1')
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe('endpoint not found')
        })
      })
      test('Check for error code 400 for invalid endpoints', () => {
        return request(app)
        .delete('/api/comments/one')
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe('Bad request')
        })
      })
    })
  }) 