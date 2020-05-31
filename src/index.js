const express = require('express')
require('./db/mongoose.js')
const userRouter=require('./routers/users')
const tasksRouter=require('./routers/tasks')

const app = express()
const port = process.env.PORT || 3000

//without middleware : new req -> run route handler
//   with middleware : new req -> do something -> run route handler

app.use(express.json()) 
app.use(userRouter)
app.use(tasksRouter)


app.listen(port, () => {
    console.log('the serve is up on port ' + port);
})
