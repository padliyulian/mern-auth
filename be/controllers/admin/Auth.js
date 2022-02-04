const { check, validationResult } = require('express-validator')
const userModel = require('../../models/User')
const roleModel = require('../../models/Role')
const fs = require('fs')
const randomstring = require('randomstring')
const bcrypt = require('bcrypt')
const mailSender = require('../../configs/mail')


exports.postRegister = [
    check('name').notEmpty().withMessage('fullname can not be empty!').bail()
        .isLength({ max: 100 }).withMessage('fullname max 100 character!'),
    check('email').notEmpty().withMessage('email can not be empty!').bail()
        .isEmail().withMessage('require email format!').bail()
        .isLength({ max: 100 }).withMessage('email max 100 character!'),
    check('password').notEmpty().withMessage('password can not be empty!').bail()
        .isLength({ min: 8 }).withMessage('password min 8 character!'),
    check('password_confirmation','Retype password must have the same value as the password,')
        .exists()
        .custom((value, { req }) => value === req.body.password),
    
    async (req,res,next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const new_user = new userModel(req.body)
        const user_role = await roleModel.findOne({name:'user'})
        if (user_role) new_user.role = user_role._id
        
        userModel.findOne({email:new_user.email},function(err,user){
            if (user) {
                return res.status(401).json({ error: 'Email has register!' })
            }

            new_user.save((error, data) => {
                if (error) {
                    return next(error)
                } else {
                    mailSender.sendConfirmationEmail(data.name, data.email, data.confirmCode)
                    return res.status(201).json({ status: 'success', msg: 'Register success!' })
                }
            })
        })
    }
]

exports.confirmEmail = async (req, res, next) => {
    try {
        let user = await userModel.findOne({confirmCode: req.params.token})
        if (user) {
            await userModel.findByIdAndUpdate(user._id, {
                confirmCode: null,
                emailVerifiedAt: Date.now(),
                status: 2
            })
            return res.status(200).json({ status: 'success', msg: 'Email confirm success, please login'})
        }
        return res.status(401).json({ error: 'Email confirm failed, user not found!' })
    } catch (error) {
        return next(error)
    }
}

exports.postForgot = [
    check('email').notEmpty().withMessage('email can not be empty!').bail()
        .isEmail().withMessage('require email format!'),

    async (req,res,next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        
        let token = randomstring.generate()
        let user = await userModel.findOneAndUpdate({email: req.body.email}, {
            confirmCode: token
        })
        if (user) {
            mailSender.sendResetEmail(user.name, user.email, token)
            return res.status(200).json({ status: 'success', msg: 'Email reset password has send!'})
        } else {
            return res.status(401).json({ error: 'Email not found!' })
        }
    }
]

exports.reset = async (req, res, next) => {
    try {
        let user = await userModel.findOne({confirmCode: req.params.token})
        if (!user) return res.status(401).json({ error: 'Reset password failed, user not found!' })
        return res.status(200).json({
            status: 'success',
            msg: 'User found!',
            email: user.email
        })
    } catch (error) {
        return next(error)
    }
}

exports.postReset = [
    check('password').notEmpty().withMessage('password can not be empty!').bail()
        .isLength({ min: 8 }).withMessage('password min 8 character!'),
    check('password_confirmation','Retype password must have the same value as the password,')
        .exists()
        .custom((value, { req }) => value === req.body.password),

    async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            let user = await userModel.findOne({confirmCode: req.body.token})
            if (!user) return res.status(401).json({ error: 'Reset password failed!' })
            
            let salt = await bcrypt.genSalt(10)
            let newPasswd = await bcrypt.hash(req.body.password,salt)
            await userModel.findByIdAndUpdate(user._id, {
                confirmCode: null,
                password: newPasswd
            })
            return res.status(200).json({ status: 'success', msg: 'Reset password success!'})
        } catch (error) {
            return next(error)
        }
    }
]

exports.postLogin = [
    check('email').notEmpty().withMessage('email can not be empty!').bail()
        .isEmail().withMessage('require email format!'),
        // .custom((value, {req}) => {
        //     userModel.findOne({email:req.body.email},function(err,user){
        //         if (user) {
        //             return true
        //         } else {
        //             return false
        //         }
        //     })
        // }).withMessage('email or password not valid'),
        // .custom((value, {req}) => {
        //     userModel.findOne({email:req.body.email},function(err,user){
        //         if (user.status == 2) {
        //             return true
        //         } else {
        //             return false
        //         }
        //     })
        // }).withMessage('please confirm email address before login').bail(),
    check('password').notEmpty().withMessage('password can not be empty!'),

    async (req,res,next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        userModel.findOne({'email':req.body.email}, function(err,user) {
            // if (!user) return res.json({isAuth : false, message : 'email not found'})
            if (!user) {
                return res.status(401).json({ error: 'Email or Password Invalid!' })
            }
    
            user.comparepassword(req.body.password,(err,isMatch) => {
                if (!isMatch) {
                    return res.status(401).json({ error: 'Email or Password Invalid!' })
                }

                if (user.status == 1) {
                    return res.status(401).json({ error: 'Please confirm email address before login!' })
                }
    
                user.generateToken((err,user) => {
                    if(err) return res.status(400).json({ err: err })
                    return res.status(200)
                        .json({
                            status: 'success',
                            token: user.token
                        })
                })
            })
        }).populate('role', 'name').exec() 
    }
]

exports.logout = async (req,res,next) => {
    let user = await userModel.findOneAndUpdate({token:req.body.token}, {$unset : {token :1}})
    if (user) return res.status(200).json({ status: 'success', msg: 'Logout success!' })
}
