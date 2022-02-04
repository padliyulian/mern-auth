const express = require('express')
const db = require('./configs/database')
const app = express()
const mongoose = require('mongoose')
const cookieParser=require('cookie-parser')
const cors = require('cors')
const createError = require('http-errors')
const session = require('express-session')
const path = require('path')
require('dotenv/config')


// use
mongoose.set('useFindAndModify', false)
app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(express.static(__dirname + '/storage/public'))
app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false
}))

// routes
if (process.env.APP_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../fe/build')))
    app.get('*', (req,res) => {
        res.sendFile(path.join(__dirname, '../fe', 'build', 'index.html'))
    })
} else {
    app.get('/', (req,res) => {
        res.send('Api running ...')
    })
}

const authRoute = require('./routes/admin/Auth')
const roleRoute = require('./routes/admin/Role')
const permissionRoute = require('./routes/admin/Permission')
const userRoute = require('./routes/admin/User')

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/auth/roles', roleRoute)
app.use('/api/v1/auth/permissions', permissionRoute)
app.use('/api/v1/auth/users', userRoute)

// connnect db & create port
db.connect()
    .then(() => {
        app.listen(process.env.APP_PORT, () => {
            console.log(`Listening on port: ${process.env.APP_PORT}`)
        })
    })

// find 404
app.use((req, res, next) => {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    console.error(err.message)
    if (!err.statusCode) err.statusCode = 500
    res.status(err.statusCode).send(err.message)
})

module.exports = app