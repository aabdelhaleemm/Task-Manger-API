const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const tasks = require('../models/tasks')

router.get('/tasks', auth, async (req, res) => {
    const match={}
    const query= req.query.completed
    if (query){
        match.completed = query ==='true'
    }
    try {
        const task=await tasks.find({owner:req.user._id, completed:match.completed} , null ,{limit:parseInt(req.query.limit),skip:parseInt(req.query.skip),sort:{createdAt:1}})
        res.send(task)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async  (req, res) => {
    const _id = req.params.id
    try {
        const task = await tasks.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }

})
router.post('/tasks', auth, async (req, res) => {
    const task = new tasks({
        ...req.body,
        owner: req.user._id
    })
    try {

        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }

})
router.patch('/tasks/:id',auth, async (req, res) => {
    const update = Object.keys(req.body)
    try {

        const task = await tasks.findone({_id:req.params.id,owner:req.user._id})
        

        if (!task) {
            return res.status(404).send()
        }
        update.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.delete('/tasks/:id',auth, async (req, res) => {
    try {
        const task = await tasks.findOneAndDelete({_id:req.params.id,owner :req.user._id})
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    }
    catch (e) {
        res.status(500).send()
    }
})
module.exports = router