
const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        const db = await mongoose.connect("mongodb://127.0.0.1:27017/jobportal");
        console.log(`MongoDB Connected : ${db.connection.host}`)
    }catch(e){
        console.log(e)
    }
}

module.exports = connectDB;