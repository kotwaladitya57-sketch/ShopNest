const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const options = {};
        if (process.env.MONGO_DB) {
            options.dbName = process.env.MONGO_DB;
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, options);

        console.log(`Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;