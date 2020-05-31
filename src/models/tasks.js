const mongoose=require('mongoose')
const taskSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true

    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        href:'user'
    }
},{
    timestamps:true
})

const tasks=mongoose.model('tasks',taskSchema)

module.exports=tasks
