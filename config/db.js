const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.DATABASE_URI, {
            // useUnifiedTopology: true,
            useNewUrlParser: true,
        });

        console.log(`MongoDB Connected: ${db.connection.host}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDB;