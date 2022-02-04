const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 50
        },
        guardName: {
            type: String,
            maxlength: 50,
            default: 'web'
        },

        users :[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            }
        ],
        
        permissions :[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Permission'
            }
        ]
    },
    {
        timestamps: true
    }
)

roleSchema.statics.addPermissionToRole = function(roleId, permissionId) {
    let role = this
    return role.findByIdAndUpdate(
        roleId,
        { $push: { permissions: permissionId } },
        { new: true, useFindAndModify: false }
    )
}

module.exports = mongoose.model('Role', roleSchema)