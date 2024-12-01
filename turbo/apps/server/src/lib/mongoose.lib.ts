import mongoose from 'mongoose';
import { MONGO_URI } from '../config/config.js';

const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err);
    }
}

export { connectMongoDB };