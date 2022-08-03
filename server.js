const express = require('express');

const dotenv = require('dotenv');

const morgan = require('morgan')

const colors = require('colors')

const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')

//Load env vars
dotenv.config({path: './config/config.env'})

//connect to Database

connectDB()

//Routes files
const bootcamp = require('./routes/bootcamp');
const course = require('./routes/Course')
const app = express();

//Body Parser
app.use(express.json())

//Dev loggin middleware
if(process.env.NODE_ENV=='development'){
    app.use(morgan('dev'));
}

//mount routers
app.use('/api/v1/bootcamp', bootcamp)
app.use('/api/v1/Course', course)
//error handler
app.use(errorHandler)
const PORT = process.env.PORT || 5000

const server = app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${5000}`.red.bold))

// handle UnhandleRejection
process.on('unhandledRejection', (err, promise)=>{
    console.log(`Error: ${err.message}`)

   //close server
   
   server.close(()=> process.exit(1))

})
 