
const nodemailer = require('nodemailer')
const ejs = require('ejs')
require('dotenv/config')

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
})

module.exports.sendConfirmationEmail = (name, email, confirmCode) => {
    let tmp = `${process.env.MAIL_TEMPLATE_PATH}/views/templates/mails/email-confirm.ejs`
    let url = `${process.env.FE_URL}/confirm/${confirmCode}`

    ejs.renderFile(tmp, {name, email, confirmCode, url}, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            let mainOptions = {
                from: process.env.MAIL_FROM_NAME,
                to: email,
                subject: 'Please confirm your account',
                html: data,
            }
        
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Message sent: ' + info.response)
                }
            })
        }
    }) 
}

module.exports.sendResetEmail = (name, email, confirmCode) => {
    let tmp = `${process.env.MAIL_TEMPLATE_PATH}/views/templates/mails/reset-password.ejs`
    let url = `${process.env.FE_URL}/reset/${confirmCode}`

    ejs.renderFile(tmp, {name, email, confirmCode, url}, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            let mainOptions = {
                from: process.env.MAIL_FROM_NAME,
                to: email,
                subject: 'Please reset your password',
                html: data,
            }
        
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Message sent: ' + info.response)
                }
            })
        }
    }) 
}