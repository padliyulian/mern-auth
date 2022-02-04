const mongoose = require('mongoose')
require('dotenv/config')

function connect() {
    return new Promise((resolve, reject) => {
        if (process.env.DB_CONNECTION == 'mongodb') {
            let conn = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false`
            mongoose.connect(conn, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
                .then((res, err) => {
                    if (err) return reject(err)
                    console.log('MongoDB Connected success')
                    resolve()
                })
        }
    })
}

function close() {
    return mongoose.disconnect()
}

module.exports = { connect, close }