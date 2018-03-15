const mongoose = require('mongoose')

var Schema = mongoose.Schema

var ArticleSchema = new Schema({
  author: string,
  headline: string,
  date: Date,
  link: string,
  image: string
})

var Article = mongoose.model('Article', ArticleSchema)

module.exports = Article