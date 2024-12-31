import mongoose from 'mongoose';

import { EnvironmentConfig } from '@/class/EnviromentConfig';
import { log } from '@/utils/logs';

const config = new EnvironmentConfig();

export const connectDB = async (): Promise<void> => {
    try {
		const conn = await mongoose.connect(config.mongoURI);
		log(`💾 MongoDB connected: ${conn.connection.host}`, 'info', __filename);
	} catch (error) {
		log('❌ MongoDB connection error', 'error', __filename);
    }
};
