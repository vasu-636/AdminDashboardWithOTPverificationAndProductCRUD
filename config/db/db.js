const mongoose = require('mongoose');

const connectDB = async () => {

    try {
        const mongoUrl = 'mongodb://127.0.0.1:27017/adminPanel';
        await mongoose.connect(mongoUrl);
        console.log("Database Connected Successfully !");
    } catch (error) {
        console.log("Database not Connected Successfully !");
    }
}

module.exports = connectDB;