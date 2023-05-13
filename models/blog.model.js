const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  userName: String,
  title: String,
  category: String,
  content: String,
  date: Number,
  likes: Number,
  comments: [{ userName: String, content: String }],
})

const BlogModel = mongoose.model('blog', blogSchema)

module.exports = { BlogModel }
