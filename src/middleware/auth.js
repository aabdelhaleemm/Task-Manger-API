const jwt=require('jsonwebtoken')
const users=require('../models/users')

const auth= async(req,res,next)=>{
    try{
    const token =req.headers.authorization.replace('Bearer ','')
    const tokenv=jwt.verify(token,process.env.TOKENKEY)
    const user =await users.findOne({_id:tokenv._id,'tokens.token':token})
    if (!user){
        throw new Error('')
    }
    req.token=token
    req.user=user
    next()
    }
    catch(e){
        res.status(401).send('please login to continue')
        
    }
}
module.exports=auth