const express = require('express')
const roles = express.Router()
const roleController = require('../../controllers/admin/Role')
const { auth, role } = require('../../middlewares/auth')

roles.route('/').get(auth, role('admin'), roleController.list)
roles.route('/').post(auth, role('admin'), roleController.store)
roles.route('/:id').get(auth, role('admin'), roleController.show)
roles.route('/:id').patch(auth, role('admin'), roleController.update)
roles.route('/:id').delete(auth, role('admin'), roleController.delete)
roles.route('/permissions/:id').get(auth, role('admin'), roleController.permission)
roles.route('/permissions/:id').patch(auth, role('admin'), roleController.updatePermission)

module.exports = roles