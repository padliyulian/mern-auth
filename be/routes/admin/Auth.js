const express = require('express')
const authUser = express.Router()
const authController = require('../../controllers/admin/Auth')

authUser.route('/register').post(authController.postRegister)
authUser.route('/confirm/:token').get(authController.confirmEmail)
authUser.route('/forgot').post(authController.postForgot)
authUser.route('/reset/:token').get(authController.reset)
authUser.route('/reset').post(authController.postReset)
authUser.route('/login').post(authController.postLogin)
authUser.route('/logout').post(authController.logout)

module.exports = authUser