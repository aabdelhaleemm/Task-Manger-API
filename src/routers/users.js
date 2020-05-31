const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const sharp=require('sharp')
const users = require('../models/users')
const multer = require('multer');
const {sendWelcomeEmail} = require('../emails/emails');
const {sendBye} = require('../emails/emails');
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.post('/users', async (req, res) => {
    const user = new users(req.body)
    try {
        await user.save()
        await sendWelcomeEmail(user.email,user.name)
        const token = await user.generateToken()
        res.status(201).send({ user, token })
    }
    catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await users.loginValidate(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.status(200).send({ user, token })
    }
    catch (e) {
        res.status(400).send(e)

    }

})
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((el) => {
            return el.token !== req.token
        })
        await req.user.save()
        res.send('done')
    } catch (e) {
        res.status(500).send(e)
    }
})
router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('done')
    } catch (e) {
        res.status(500).send(e)
    }
})
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed = ['name', 'email', 'password', 'age']
    const isValid = updates.every((value) => allowed.includes(value))
    if (!isValid) {
        return res.status(400).send({ error: 'ivlaid update' })
    }
    try {
        const user = req.user
        updates.forEach((value) => {
            user[value] = req.body[value]
        })
        await user.save()
        // const user =await users.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(user)
        sendBye(req.user.email,req.user.name)
    }
    catch (e) {
        res.status(500).send()
    }
})

const upload = multer({

    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (file.originalname.endsWith('.jpg' || '.png' || '.jpeg')) {
            return cb(undefined, true)
        }
        return cb(new Error('please upload image'))
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    const buffer=await sharp(req.file.buffer).resize({width:250 , height:250}).png().toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => { // to handle error 
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
     req.user.avatar = undefined
     req.user.save()
    
    res.send()
})
router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user= await users.findById(req.params.id)
        if (!user){
            throw new Error('')
        }
        res.set('Content-type','image/png') //to render pic in browser
        res.send(user.avatar)
    }catch(e){
        res.status(404).send('error')
    }
    
})

module.exports = router