const express = require('express')
const permission = express.Router()
const permissionController = require('../../controllers/admin/Permission')
const { auth, role } = require('../../middlewares/auth')

permission.route('/').get(auth, role('admin'), permissionController.list)
permission.route('/').post(auth, role('admin'), permissionController.store)
permission.route('/:id').get(auth, role('admin'), permissionController.show)
permission.route('/:id').patch(auth, role('admin'), permissionController.update)
permission.route('/:id').delete(auth, role('admin'), permissionController.delete)

module.exports = permission