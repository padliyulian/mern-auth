const express = require('express')
const user = express.Router()
const userController = require('../../controllers/admin/User')
const { auth, role } = require('../../middlewares/auth')

user.route('/').get(auth, role('admin'), userController.list)
user.route('/').post(auth, role('admin'), userController.store)
user.route('/:id').get(auth, role('admin'), userController.show)
user.route('/:id').patch(auth, role('admin'), userController.update)
user.route('/:id').delete(auth, role('admin'), userController.delete)

module.exports = user