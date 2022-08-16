const mongoose = require('mongoose');
require('dotenv').config()

const connectDB = async ()=> {
    try {
        const conn = await mongoose.connect(process.env.DATABASE,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log('MongoDB connection successful');
    } catch (err) {
        console.log(`Error: ${err.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;