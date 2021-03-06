const express = require('express')
const uuid = require('uuid/v4');
const { isWebUri } = require('valid-url')
const logger = require('../logger')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

const bookmarks = [{
  id: 1,
  title: 2,
  rating : 4,
  url: 'http://google.com',
  desc: 'This is it',
}]

bookmarkRouter
  .route('/bookmark')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
      const { title, rating, url, desc } = req.body;
      //check for required feilds
      if (!title) {
        return res
            .status(400)
            .status('Title is required');
      }
      if (!url || !isWebUri(url)) {
        logger.error(`Invalid url '${url}' supplied`)
        return res
            .status(400)
            .status('Enter a valid url');
      }

      const id = uuid();
      const bookmark = {
        id, 
        title, 
        url,
        rating,
        desc
      }
      bookmarks.push(bookmark);
      logger.info(`Bookmark with id ${id} created`);
    res
      .status(201)
      .location(`http://localhost:8000/bookmark/${id}`)
      .json(bookmark)    
  })

  bookmarkRouter
  .route('/bookmark/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark  = bookmarks.find(b => b.id == id);
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }
    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(b => b.id == id);
    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not found');
    }
    bookmarks.splice(bookmarkIndex, 1);
    logger.info(`Card with id ${id} deleted.`);
    res
      .status(204)
      .end();
  })

  module.exports = bookmarkRouter