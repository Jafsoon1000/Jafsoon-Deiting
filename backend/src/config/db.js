const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    
    if (!uri || uri.includes('your_mongodb') || uri.includes('connection_string')) {
        console.log('\n⚠️  No valid MONGODB_URI found in environment variables.');
        console.log('🔄 Running in MOCK DATABASE mode (saves to src/data/mock_users.json local file).\n');
        process.env.USE_MOCK_DB = 'true';
        return;
    }

    try {
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        console.log('🔄 Falling back to MOCK DATABASE mode (saves to src/data/mock_users.json local file).\n');
        process.env.USE_MOCK_DB = 'true';
    }
};

module.exports = connectDB;
