const roleModel = require('../../models/Role')
const permissionModel = require('../../models/Permission')
const { check, validationResult } = require('express-validator')
const fs = require('fs')


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
        const roles = await roleModel.find(searchBy)
            .select(['-users','-permissions','-updatedAt'])
            .sort(sortBy)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()

        const count = await roleModel.countDocuments()

        return res.status(200).json({ 
            'roles': roles,
            'totalItems': count,
            'totalPages': Math.ceil(count / limit),
            'currentPage': parseInt(page)
        })

    } catch (err) {
        return next(err)
    }
}

exports.store = [
    check('name').notEmpty().withMessage('name can not be empty!'),
    check('guardName').notEmpty().withMessage('guard name can not be empty!'),
        
    async (req,res,next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            let is_exists = await roleModel.findOne({name: req.body.name})
            if (is_exists) {
                return res.status(401).json({ error: 'Name has exists!' })
            }

            const role = new roleModel(req.body)
            role.save((error, data) => {
                if (error) {
                    res.status(401).json({ error: error })
                    return next(error)
                } else {
                    return res.status(201).json({ status: 'success', msg: 'Add data success!' })
                }
            })  
        } catch (err) {
            return next(err)
        }
    }
]

exports.show = async (req,res,next) => {
    try {
        const role = await roleModel.findOne({_id:req.params.id}).select(['_id','name','guardName']).exec()
        if (!role) return res.status(401).json({ error: 'Data not found!' })
        return res.status(200).json({ status: 'success', role })
    } catch (err) {
        return next(err)
    }
}

exports.update = [

    check('name').notEmpty().withMessage('name can not be empty!'),
    check('guardName').notEmpty().withMessage('guard name can not be empty!'),
        
    async (req,res,next) => {
        try {
            let errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            role = await roleModel.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                guardName: req.body.guardName
            })
            if (role) return res.status(200).json({ status: 'success', msg: 'Update data success!' })
        } catch (err) {
            return next(err)
        }
    }
]

exports.delete = async (req,res,next) => {
    try {
        let role = await roleModel.findByIdAndRemove(req.params.id)
        if (role) return res.status(200).json({ status: 'success', msg: 'Delete data success!' })
    } catch (err) {
        return next(err)
    }
}

exports.permission = async (req,res,next) => {
    try {
        let role = await roleModel.findById(req.params.id).select(['_id','name','guardName','permissions']).exec()
        let permissions = await permissionModel.find().select(['_id','name','guardName']).exec()

        if (!role) return res.status(401).json({ error: 'Data not found!' })
        return res.status(200).json({ status: 'success', role, permissions })
    } catch (err) {
        return next(err)
    }
}

exports.updatePermission = async (req,res,next) => {
    try {
        let role = await roleModel.findByIdAndUpdate(req.params.id, {
            $set: { permissions: req.body.permissions }
        })
        
        if (!role) return res.status(401).json({ error: 'Update permissions failed!' })
        return res.status(200).json({ status: 'success', msg: 'Update permissions success!' })
    } catch (err) {
        return next(err)
    }
}
