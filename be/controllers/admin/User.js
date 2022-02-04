const userModel = require('../../models/User')
const { check, validationResult } = require('express-validator')
const multer = require('multer')
const fs = require('fs')
const bcrypt = require('bcrypt')

//define storage for the images
const storage = multer.diskStorage({
    //destination for files
    destination: function (req, file, callback) {
        callback(null, './storage/public/images')
    },

    //add back the extension
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname)
    },
})

//upload parameters for multer
const upload = multer({storage: storage})


exports.list = async (req,res,next) => {
    const handleQuerySort = (query) => {
        try {
            // convert the string to look like json object
            // example "id: -1, name: 1" to "{ "id": -1, "name": 1 }"
            const toJSONString = ("{" + query + "}").replace(/(\w+:)|(\w+ :)/g, (matched => {
                return '"' + matched.substring(0, matched.length - 1) + '":'
            }))
        
            return JSON.parse(toJSONString)
        } catch (err) {
            return JSON.parse("{}") // parse empty json if the clients input wrong query format
        }
    }

    const handleQuerySearch = (column = null, key = null) => {
        try {
            if (!column || !key) {
                return {}
            }
            return { [column]: { $regex: key, $options: "i" } }
        } catch (err) {
            return JSON.parse("{}")
        }
    }

    // { name: { $regex: "arwana", $options: "i" } }
    const searchBy = handleQuerySearch(req.query.searchBy, req.query.searchKey)
    // {name:-1} || {name:'asc'}
    const sortBy = handleQuerySort(req.query.sortBy)
    const { page = 1, limit = 10 } = req.query
    
    try {
        const users = await userModel.find(searchBy)
            .select(['-password','-confirmCode','-token','-updatedAt'])
            .sort(sortBy)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('role', 'name')
            .exec()

        const count = await userModel.countDocuments()
        return res.status(200).json({ 
            'users': users,
            'totalItems': count,
            'totalPages': Math.ceil(count / limit),
            'currentPage': parseInt(page)
        })
    } catch (err) {
        return next(err)
    }
}

exports.store = [
    upload.single('photo'),
    check('photo')
        .if((value, { req }) => req.file)
        .bail()
        .custom((value, {req}) => {
            let allow_ext = ['image/png','image/jpg','image/jpeg']
            if (allow_ext.indexOf(req.file.mimetype) > -1) {
                return true
            } else {
                fs.unlink(`storage/public/images/${req.file.filename}`, function (err) {
                    if (err) console.log(err)
                })
                return false
            }
        })
        .withMessage('only .png, .jpg and .jpeg format allowed!')
        .bail()
        .custom((value, {req}) => {
            if (req.file.size <= 1002400) {
                return true
            } else {
                fs.unlink(`storage/public/images/${req.file.filename}`, function (err) {
                    if (err) console.log(err)
                })
                return false
            }
        })
        .withMessage('max size 1MB'),

    check('name').notEmpty().withMessage('fullname can not be empty!').bail()
        .isLength({ max: 100 }).withMessage('fullname max 100 character!'),
    check('email').notEmpty().withMessage('email can not be empty!').bail()
        .isEmail().withMessage('require email format!').bail()
        .isLength({ max: 100 }).withMessage('email max 100 character!'),
    check('phone').notEmpty().withMessage('phone can not be empty!').bail()
        .isLength({ max: 20 }).withMessage('phone max 20 character!'),
    check('address').notEmpty().withMessage('address can not be empty!').bail()
        .isLength({ max: 500 }).withMessage('address max 500 character!'),
    check('password').notEmpty().withMessage('password can not be empty!').bail()
        .isLength({ min: 8 }).withMessage('password min 8 character!'),
    check('password_confirmation','Retype password must have the same value as the password,')
        .exists()
        .custom((value, { req }) => value === req.body.password),
    check('role').notEmpty().withMessage('role can not be empty!'),
    check('status').notEmpty().withMessage('status can not be empty!'),
        
    async (req,res,next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            if (req.file) req.body.photo = req.file.filename
            req.body.status = 2

            const new_user = new userModel(req.body)
            userModel.findOne({email:new_user.email},function(err,user){
                if (user) return res.status(401).json({ error: 'Email has exists!' }) 
    
                new_user.save((error, data) => {
                    if (error) return res.status(401).json({ error }) 
                    return res.status(201).json({ status: 'success', msg: 'Add data success!' })
                })
            })
        } catch (err) {
            return next(err)
        }
    }
]

exports.show = async (req,res,next) => {
    try {
        let user = await userModel.findOne({_id:req.params.id})
            .select(['-password','-confirmCode','-token','-updatedAt'])
        if (!user) return res.status(401).json({ error: 'Data not found!' })
        return res.status(200).json({ status: 'success', user })
    } catch (err) {
        return next(err)
    }
}

exports.update = [
    upload.single('photo'),
    check('photo')
        .if((value, { req }) => req.file)
        .bail()
        .custom((value, {req}) => {
            let allow_ext = ['image/png','image/jpg','image/jpeg']
            if (allow_ext.indexOf(req.file.mimetype) > -1) {
                return true
            } else {
                fs.unlink(`storage/public/images/${req.file.filename}`, function (err) {
                    if (err) console.log(err)
                })
                return false
            }
        })
        .withMessage('only .png, .jpg and .jpeg format allowed!')
        .bail()
        .custom((value, {req}) => {
            if (req.file.size <= 1002400) {
                return true
            } else {
                fs.unlink(`storage/public/images/${req.file.filename}`, function (err) {
                    if (err) console.log(err)
                })
                return false
            }
        })
        .withMessage('max size 1MB'),

    check('name').notEmpty().withMessage('fullname can not be empty!').bail()
        .isLength({ max: 100 }).withMessage('fullname max 100 character!'),
    check('email').notEmpty().withMessage('email can not be empty!').bail()
        .isEmail().withMessage('require email format!').bail()
        .isLength({ max: 100 }).withMessage('email max 100 character!'),
    check('phone').notEmpty().withMessage('phone can not be empty!').bail()
        .isLength({ max: 20 }).withMessage('phone max 20 character!'),
    check('address').notEmpty().withMessage('address can not be empty!').bail()
        .isLength({ max: 500 }).withMessage('address max 500 character!'),
    check('password').if((value, { req }) => req.body.password).bail()
        .isLength({ min: 8 }).withMessage('password min 8 character!'),
    check('password_confirmation','Retype password must have the same value as the password,')
        .exists()
        .custom((value, { req }) => value === req.body.password),
        
    async (req,res,next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            let old_user = await userModel.findById(req.params.id)

            if (req.body.password) {
                let salt = await bcrypt.genSalt(10)
                let newPasswd = await bcrypt.hash(req.body.password,salt)
                req.body.password = newPasswd
            } else {
                req.body.password = old_user.password
            }

            if (req.file) {
                if (old_user.photo) {
                    fs.unlink(`storage/public/images/${old_user.photo}`, function (err) {
                        if (err) console.log(err)
                    })
                }
                req.body.photo = req.file.filename
            }

            let update_user = await userModel.findByIdAndUpdate(req.params.id, req.body)
            if (update_user) return res.status(200).json({ status: 'success', msg: 'Update data success!' })
        } catch (err) {
            return next(err)
        }
    }
]

exports.delete = async (req,res,next) => {
    try {
        userModel.findByIdAndRemove(req.params.id)
            .then(data => {
                if (data.photo) {
                    fs.unlink(`storage/public/images/${data.photo}`, function (err) {
                        if (err) console.log(err)
                    })
                }
                
                return res.status(200).json({ status: 'success', msg: 'Delete data success!' })
            })
            .catch(err => next(err))
    } catch (err) {
        return next(err)
    }
}
