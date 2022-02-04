const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const randomstring = require('randomstring')
const salt = 10
require('dotenv/config')

const userSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            maxlength: 100
        },
        email:{
            type: String,
            required: true,
            trim: true,
            maxlength: 100
            // db.users.createIndex({email:1}, {unique:true})
        },
        password:{
            type: String,
            required: true,
            minlength: 8,
        },
        phone:{
            type: Number,
            maxlength: 20,
            default: null
        },
        address:{
            type:String,
            maxlength: 500,
            default: null
        },
        photo:{
            type:String,
            default: null
        },
        provinceId:{
            type: Number,
            default: null
        },
        cityId:{
            type: Number,
            default: null
        },
        confirmCode:{
            type: String,
            default: null
        },
        emailVerifiedAt:{
            type: Date,
            default: null
        },
        status:{
            type: Number,
            default: 1,
        },
        token :{
            type: String,
        },

        role :{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Role'
        },
        articles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Article'
        }]
    },
    {
        timestamps: true
    }
)

// hasing passwd before save
userSchema.pre('save',function(next){
    let user = this
    if(user.isModified('password')){
        bcrypt.genSalt(salt,function(err,salt){
            if(err)return next(err)
            bcrypt.hash(user.password,salt,function(err,hash){
                if(err) return next(err)
                user.password = hash
                user.confirmCode = randomstring.generate()
                next()
            })
        })
    } else {
        next()
    }
})

// check passwd
userSchema.methods.comparepassword = function(password,cb){
    bcrypt.compare(password,this.password,function(err,isMatch){
        if(err) return cb(next)
        cb(null,isMatch)
    })
}

// generate token when user login
userSchema.methods.generateToken = function(cb){
    let user = this
    let token = jwt.sign({
        id: user._id.toHexString(),
        name: user.name,
        photo: user.photo,
        email: user.email,
        role: user.role.name,
        status: user.status,
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
    }, process.env.DB_PASSWORD)

    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user)
    })
}

// find by token
userSchema.statics.findByToken = function(token,cb){
    let user = this

    jwt.verify(token,process.env.DB_PASSWORD,function(err,decode){
        user.findOne({"_id": decode, "token":token},function(err,user){
            if(err) return cb(err)
            cb(null,user)
        })
    })
}

//delete token
userSchema.methods.deleteToken = function(token,cb){
    let user = this

    user.updateOne({$unset : {token :1}},function(err,user){
        if(err) return cb(err)
        cb(null,user)
    })
}

// add role
// userSchema.statics.addRole = function(userId, roleId) {
//     let user = this
//     return user.findByIdAndUpdate(
//         userId,
//         { $push: { permissions: permissionId } },
//         { new: true, useFindAndModify: false }
//     )
// }

module.exports = mongoose.model('User', userSchema)