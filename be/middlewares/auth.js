const User = require('../models/User')
const Role = require('../models/Role')
const Permission = require('../models/Permission')

let auth = async (req,res,next) => {
    let token = req.headers.authorization
    let user = await User.findOne({token:token}).populate('role', 'name').exec()
    if (!user) return res.status(401).json({ status: 'error', msg: 'uset not auth' })

    req.token = token
    req.user = user
    next()
}

let role = (...roles) => {
    return (req,res,next) => {
        if (!roles.includes(req.user.role.name)) {
            return res.status(403).json({
                status: 'error',
                msg: 'You don\'t have role authorization'
            })
        }
        next()
    }
}

let permission = (permission) => {
    return (req,res,next) => {
        Role.findById(req.user.role,(err,role) => {
            if(err) throw err
            if (role) {
                Permission.findOne({"name":permission}, (err, permis) => {
                    if (!role.permissions.includes(permis._id)) {
                        return res.status(403).json({
                            status: 'error',
                            msg: 'You don\'t have permission authorization'
                        })
                    }
        
                    next()
                })
            }
        })      
    }
}

module.exports = { auth, role, permission }