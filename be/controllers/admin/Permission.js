const permissionModel = require('../../models/Permission')
const { check, validationResult } = require('express-validator')

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
        const permissions = await permissionModel.find(searchBy)
            .select(['-users','-roles','-updatedAt'])
            .sort(sortBy)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()

        const count = await permissionModel.countDocuments()

        return res.status(200).json({ 
            'permissions': permissions,
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

            let is_exists = await permissionModel.findOne({name: req.body.name})
            if (is_exists) return res.status(401).json({ error: 'Name has exists!' })

            const permission = new permissionModel(req.body)
            permission.save((error, data) => {
                if (error) return res.status(401).json({ error: error })
                return res.status(201).json({ status: 'success', msg: 'Add data success!' })
            })  
        } catch (err) {
            return next(err)
        }
    }
]

exports.show = async (req,res,next) => {
    try {
        const permission = await permissionModel.findOne({_id:req.params.id})
            .select(['_id','name','guardName']).exec()
        if (!permission) return res.status(401).json({ error: 'Data not found!' })
        return res.status(200).json({ status: 'success', permission })
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

            permission = await permissionModel.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                guardName: req.body.guardName
            })
            if (permission) return res.status(200).json({ status: 'success', msg: 'Update data success!' })
        } catch (err) {
            return next(err)
        }
    }
]

exports.delete = async (req,res,next) => {
    try {
        const permission = await permissionModel.findByIdAndRemove(req.params.id)
        if (permission) return res.status(200).json({ status: 'success', msg: 'Delete data success!' })
    } catch (error) {
        return res.status(401).json({ error: error })
    }
}
