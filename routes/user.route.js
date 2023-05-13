const express = require('express')
const { UserModel } = require('../models/user.model')
const userRoute = express.Router()
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
userRoute.post('/signup', async (req, res) => {
  try {
    let userData = req.body
    let userInDB = await UserModel.findOne({ email: userData.email })
    console.log(userInDB)
    if (userInDB) {
      return res.status(400).send({ msg: 'user is already registered' })
    }
    bcrypt.hash(userData.password, 3, async function (err, hash) {
      // Store hash in your password DB.
      if (hash) {
        let newUser = new UserModel({ ...userData, password: hash })
        await newUser.save()
        res.status(200).send({ msg: 'user is registered' })
      } else {
        res.status(400).send({ msg: 'register failed' })
      }
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({ msg: 'register failed' })
  }
})
userRoute.post('/login', async (req, res) => {
  try {
    let userData = req.body
    let userInDB = await UserModel.findOne({ email: userData.email })
    console.log(userInDB)
    if (!userInDB) {
      return res.status(400).send({ msg: 'register in first' })
    }
    console.log('user', userInDB, userData)
    bcrypt.compare(
      userData.password,
      userInDB.password,
      function (err, result) {
        // result == true
        console.log(err, result)
        if (result) {
          var token = jwt.sign({ userId: userInDB._id }, 'secret')
          res
            .status(200)
            .send({
              msg: 'login successful',
              token: token,
              id: userInDB._id,
              email: userInDB.email,
            })
        } else {
          console.log(err)
          res.status(400).send({ msg: 'something went wrong' })
        }
      }
    )
  } catch (error) {
    console.log(error)
    res.status(400).send({ msg: 'login failed' })
  }
})
userRoute.patch('/users/:id/reset', async (req, res) => {
  try {
    let { id } = req.params
    let body = req.body
    let userInDB = await UserModel.findOne({ _id: id })
    console.log(userInDB)
    if (!userInDB) {
      return res.status(400).send({ msg: 'register in first' })
    }
    // console.log('user', userInDB, userData)
    bcrypt.compare(
      body.currentPassword,
      userInDB.password,
      async function (err, result) {
        // result == true
        console.log(err, result)
        if (result) {
          await UserModel.findByIdAndUpdate(
            { _id: id },
            { password: body.newPassword }
          )
          res.status(200).send({ msg: 'password changed' })
        } else {
          console.log(err)
          res.status(400).send({ msg: 'wrong current password' })
        }
      }
    )
  } catch (error) {
    console.log(error)
    res.status(400).send({ msg: 'login failed' })
  }
})

module.exports = { userRoute }
