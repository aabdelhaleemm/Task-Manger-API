const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const tasks = require('./tasks');

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        validate(value) {
            if (!isNaN(value)) {
                throw new Error('name shouldnt be number')
            }
        },
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Wrog email!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Wrog password!')
            }
        }

    },
    realpass: {
        type: String,
        default: null
    },

    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age error!')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }

    }],
    
    avatar:{
        type:Buffer
    }

},{
    timestamps:true
})

usersSchema.virtual('tasks',{
    ref:'tasks',
    localField:'_id',
    foreignField:'owner'

})
usersSchema.pre('remove',async function(next){
    const user=this
    await tasks.deleteMany({owner:user._id})
    next()
})
usersSchema.pre('save', async function (next) { //do something before save 
    const user = this
    if (user.isModified('password')) {
        user.realpass = user.password
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

usersSchema.methods.toJSON =  function(){
    const user =this
    const userObject=user.toObject()
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//to make function to the instance -user
usersSchema.methods.generateToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
    user.tokens = await user.tokens.concat({ token })
    
    await user.save()
    return token
}
parseInt
// to make new function for the model  
usersSchema.statics.loginValidate = async (email, password) => {
    const user = await users.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const userPass = await bcrypt.compare(password, user.password)
    if (!userPass) {
        throw new Error('Unable to login')
    }
    return user
}
const users = mongoose.model('user', usersSchema)


module.exports = users