const mongoose = require('mongoose')

var Schema = mongoose.Schema

var ArticleSchema = new Schema({
  author: String,
  headline: {
   type: String,
   unique: true 
  },
  date: Date,
  link: String,
  image: String
})

var Article = mongoose.model('Article', ArticleSchema)

module.exports = Article