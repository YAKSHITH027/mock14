const express = require('express')
const { BlogModel } = require('../models/blog.model')

const blogRoute = express.Router()

blogRoute.get('/', async (req, res) => {
  try {
    let { page, limit, category, title, sort, order } = req.query

    //page
    page = page || 1
    if (!limit) limit = 5

    if (order == 'asc') {
      order = 1
    } else if (order == 'desc') {
      order = -1
    } else {
      order = -1
    }
    sort = sort || 'date'
    let obj = {}
    if (category) obj.category = category

    let data = await BlogModel.find(obj)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ date: order })
    res.status(200).send({ data })
  } catch (error) {
    console.log(error), res.status(400).send({ msg: 'something went wrong' })
  }
})

blogRoute.post('/', async (req, res) => {
  try {
    let data = req.body
    let newBlog = new BlogModel(data)
    await newBlog.save()
    res.status(200).send({ msg: 'blog added' })
  } catch (error) {
    console.log(error)
    res.status(400).send({ msg: 'something went wrong' })
  }
})
blogRoute.patch('/:id', async (req, res) => {
  try {
    let data = req.body
    let { id } = req.params
    console.log(data, id)
    let newBlog = await BlogModel.findByIdAndUpdate({ _id: id }, data)

    res.status(200).send({ msg: 'blog updated' })
  } catch (error) {
    console.log(error)
    res.status(400).send({ msg: 'something went wrong' })
  }
})
blogRoute.delete('/:id', async (req, res) => {
  try {
    let data = req.body
    let { id } = req.params
    let newBlog = await BlogModel.findByIdAndDelete({ _id: id })

    res.status(200).send({ msg: 'blog deleted' })
  } catch (error) {
    console.log(error)
    res.status(400).send({ msg: 'something went wrong' })
  }
})

module.exports = { blogRoute }
