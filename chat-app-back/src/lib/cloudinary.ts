import { EnvironmentConfig } from '@/class/EnviromentConfig';
import { v2 as cloudinary } from 'cloudinary';

const env = new EnvironmentConfig();

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret
});

export default cloudinary;