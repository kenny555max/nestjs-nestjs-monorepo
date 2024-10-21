import * as dotenv from 'dotenv';
dotenv.config();

const configuration = () => {
    if (!process.env.JWT_ACCESS_TOKEN_SECRET){
        throw Error("Missing Env: JWT_ACCESS_TOKEN_SECRET");
    }
    if (!process.env.JWT_ACCESS_TOKEN_EXPIRES){
        throw Error("Missing Env: JWT_ACCESS_TOKEN_EXPIRES")
    }
    if (!process.env.JWT_REFRESH_TOKEN_SECRET){
        throw Error("Missines ENv: JWT_REFRESH_TOKEN_SECRET");
    }
    if (!process.env.JWT_REFRESH_TOKEN_EXPIRES){
        throw Error("Missing Env: JWT_REFRESH_TOKEN_EXPIRES");
    }
    if (!process.env.JWT_VERIFICATION_TOKEN_EXPIRES){
        throw Error("Missing Env : JWT_VERIFICATION_TOKEN_EXPIRES");
    }
    if (!process.env.JWT_VERIFICATION_TOKEN_SECRET){
        throw Error("Missing Env: JWT_VERIFICATION_TOKEN_SECRET");
    }
    if (!process.env.AWS_REGION) {
        throw Error('Missing Env: AWS_REGION');
    }
    if (!process.env.AWS_ACCESS_KEY_ID) {
        throw Error('Missing Env: AWS_ACCESS_KEY_ID');
    }
    if (!process.env.AWS_SECRET_ACCESS_KEY) {
        throw Error('Missing Env: AWS_ACCESS_KEY_SECRET');
    }
    if (!process.env.AWS_SENDER_EMAIL) {
        throw Error('Missing Env: AWS_SENDER_EMAIL');
    }
    if (!process.env.REDIS_HOST){
        throw Error("Missing Env: REDIS_HOST")
    }
    if (!process.env.REDIS_PORT){
        throw Error("Missing Env: REDIS_PORT")
    }
    if (!process.env.REDIS_PASSWORD){
        throw Error("Missing Env: REDIS_PASSWORD")
    }

    return {
        jwt: {
            access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            access_token_expires: process.env.JWT_ACCESS_TOKEN_EXPIRES,
            verification_token_secret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
            verification_token_expires: process.env.JWT_VERIFICATION_TOKEN_EXPIRES,
            refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            refresh_token_expires: process.env.JWT_REFRESH_TOKEN_EXPIRES,
        },
        AWS: {
            REGION: process.env.AWS_REGION,
            ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
            ACCESS_KEY_SECRET: process.env.AWS_SECRET_ACCESS_KEY,
            SES_SENDER_NAME: process.env.AWS_SENDER_NAME,
            SES_SOURCE_EMAIL: process.env.AWS_SENDER_EMAIL,
        }
    };
};

export default configuration;