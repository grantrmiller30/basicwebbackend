require('dotenv').config()
const PORT = process.env.PORT || 3500
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')

const connectDB = require('./config/dbConn')
const { logger, logEvent } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')

connectDB()

app.use(logger)

app.use('/', express.static(path.join(__dirname, 'public')))

app.use(express.json())

app.use('/', require('./routes/root'))
app.use('/users', require('./routes/userRoutes'))
app.use('/items', require('./routes/itemRoutes'))

app.all(/.*/, (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({message: '404 Not Found'})
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () =>  {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvent(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})