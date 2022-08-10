const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//Load env files
dotenv.config({path: './config/config.env'});

//Load models

const Bootcamp = require('./models/Bootcamp');
//const course = require('./models/Course');
const Course = require('./models/Course');
const User = require('./models/User')

//connect Db

mongoose.connect(process.env.MONGO_URI);

//Read Json file

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))

//import to db

const importData = async () => {
    try{
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users)
        console.log('Data imported to db...'.green.inverse)
        process.exit();
    }
    catch(err){
        console.log(err)
    }
}
const deleteData = async () => {
    try{
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany()
        console.log('Data destroyed to db...'.red.inverse);
        process.exit();
    }
    catch(err){
        console.log(err)
    }
}
if(process.argv[2]==='-i'){
    importData();
}else if(process.argv[2]==='-d'){
    deleteData();

}