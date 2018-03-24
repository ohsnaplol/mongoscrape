const mongoose = require('mongoose')
const cheerio = require('cheerio')
const request = require('request')
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const db = require('./newsmodel.js')
var PORT = 3000 || process.env.PORT
var app = express()
app.use(express.static('public'))
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

// var database = 'scrape'
// var collections = ['Article']

var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/scrape'

mongoose.Promise = Promise
mongoose.connect(MONGODB_URI)

app.get('/api', function (req, res) {
  request("http://www.polygon.com", function (error, response, html) {
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html)

    // An empty array to save the data that we'll scrape
    var results = []

    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    // but be sure to visit the package's npm page to see how it works
    $("h2.c-entry-box--compact__title").each(function (i, element) {
      var link = $(element).children().attr("href")
      var title = $(element).children().text()
      // Save these results in an object that we'll push into the results array we defined earlier
      results.push({
        title: title,
        link: link
      })
    })
    res.send(results)
  })
})

app.post('/api/savetodb', function(req, res) {
  const title = req.body.title
  const link = req.body.link
  db.create({headline: title, link: link})
    .catch(function(error) {
      console.log(error)
    })
})

app.get('/api/getsaved', function(req, res) {
  db.find()
    .then(function(dbArticle) {
      res.json(dbArticle)
    })
    .catch(function(error) {
      res.json(error)
    })
})

app.post('/api/delete', function(req, res) {
  const withTitle = req.body.title
  db.deleteOne({headline: withTitle})
    .then(function(result) {
      res.send(result)
    })
})

app.get('/', function (req, res) {
  res.sendFile('index.html')
})

app.get('/saved', function(req, res) {
  res.sendFile('saved.html')
})

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
})
