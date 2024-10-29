const express = require('express')
const cors = require('cors')
const morgan = require('./logger/morgan')
const router = require('./routes/index.routes')
const connectDB = require('./config/db')
const errorHandler = require('./middlewares/error-handler')
const { PORT, HOST } = require('./config/environments')

const path = require('path')
const { bot } = require('./bot/bot')

const port = PORT || 5000
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan())
app.use('/api', router)
app.use('/api/file', express.static(path.join(`${process.cwd()}/uploads`)))
app.use(errorHandler)

const start = async () => {
  try {
    await connectDB()

    bot.launch()
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))

    app.listen(port, console.log(`Server running: ${HOST}:${port}`))
  } catch (error) {
    console.log('Error')
  }
}

start()
