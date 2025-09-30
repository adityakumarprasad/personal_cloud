const express = require('express');
const app = express();
const userRouter = require('./routes/user.routes')
const indexRouter = require('./routes/index.routes')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const dotenv = require('dotenv');
dotenv.config();
const connectToDatabase = require('./config/db');
connectToDatabase();

const cookieParser = require('cookie-parser');



  app.set('view engine', 'ejs')
app.use(cookieParser())
app.use('/user',userRouter)
app.use('/',indexRouter)


app.listen(3000, ()=>{
console.log("server started")
})