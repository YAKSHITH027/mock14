const express = require('express')
const cors = require('cors')
const { connection } = require('./db')
const { userRoute } = require('./routes/user.route')
const { blogRoute } = require('./routes/blog.route')

require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('home')
})

app.use('/user', userRoute)
app.use('/blog', blogRoute)

app.listen(process.env.port, async () => {
  try {
    await connection
    console.log('db is connected')
  } catch (error) {
    console.log(error)
  }
  console.log('port is runnin')
})
