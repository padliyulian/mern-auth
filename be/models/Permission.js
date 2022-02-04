const mongoose = require('mongoose')
const Schema = mongoose.Schema

const permissionSchema = new Schema(
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
        
        roles :[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Role'
            }
        ]
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Permission', permissionSchema)