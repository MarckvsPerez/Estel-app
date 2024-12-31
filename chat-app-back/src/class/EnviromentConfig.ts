import * as dotenv from 'dotenv';

export class EnvironmentConfig {
    private readonly requiredEnvVars: string[] = [
        'SERVER_PORT',  
        'MONGO_URI',
        'JWT_SECRET_KEY',
        'JWT_ACCES_HOUR',
        'JWT_REFRESH_MONTH',
        'NODE_ENV',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET',
        'CLIENT_URL_DEVELOPMENT',
        'CLIENT_URL_PRODUCTION'
    ];

    public serverPort: string;
    public mongoURI: string;
    public jwtSecretKey: string;
    public jwtAccesHour: string;
    public jwtRefreshMonth: string;
    public nodeEnv: string;
    public cloudinaryCloudName: string;
    public cloudinaryApiKey: string;
    public cloudinaryApiSecret: string;
    public clientUrlDevelopment: string;
    public clientUrlProduction: string;

    constructor() {
        dotenv.config();
        this.serverPort = '';
        this.mongoURI = '';
        this.jwtSecretKey = '';
        this.jwtAccesHour = '';
        this.jwtRefreshMonth = '';
        this.nodeEnv = '';
        this.cloudinaryCloudName = '';
        this.cloudinaryApiKey = '';
        this.cloudinaryApiSecret = '';
        this.clientUrlDevelopment = '';
        this.clientUrlProduction = '';
        this.checkRequiredEnvVars();
    }

    private checkRequiredEnvVars(): void {
        this.requiredEnvVars.forEach((envVar) => {
            const value = process.env[envVar];
            if (value == null) {
                throw new Error(`Missing required environment variable: ${envVar}`);
            }
            this.setEnvVar(envVar, value);
        });
    }

    private setEnvVar(envVar: string, value: string): void {
        switch (envVar) {
            case 'SERVER_PORT':
                this.serverPort = value;
                break;
            case 'MONGO_URI':
                this.mongoURI = value;
                break;
            case 'JWT_SECRET_KEY':
                this.jwtSecretKey = value;
                break;
            case 'JWT_ACCES_HOUR':
                this.jwtAccesHour = value;
                break;
            case 'JWT_REFRESH_MONTH':
                this.jwtRefreshMonth = value;
                break;
            case 'NODE_ENV':
                this.nodeEnv = value;
                break;
            case 'CLOUDINARY_CLOUD_NAME':
                this.cloudinaryCloudName = value;
                break;
            case 'CLOUDINARY_API_KEY':
                this.cloudinaryApiKey = value;
                break;
            case 'CLOUDINARY_API_SECRET':
                this.cloudinaryApiSecret = value;
                break;
            case 'CLIENT_URL_DEVELOPMENT':
                this.clientUrlDevelopment = value;
                break;
            case 'CLIENT_URL_PRODUCTION':
                this.clientUrlProduction = value;
                break;
        }
    }
}