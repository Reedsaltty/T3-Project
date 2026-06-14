import jwt from "jsonwebtoken" ;
import dotenv from "dotenv" ;
dotenv.config({path : new URL('../../.env', import.meta.url)})  


export const jwtConfig ={

    accessSecret : process.env.ACCESS_SECRET_TOKEN ,
    refreshSecret : process.env.REFRESH_SECRET_TOKEN,
    accessOptions : {
        expiresIn : process.env.ACCESS_OPTION ,
    },
    refreshOptions : {
        expiresIn : process.env.REFRESH_OPTION ,
    }
}
    if(!jwtConfig.accessSecret || !jwtConfig.refreshSecret){
        throw new Error("FATAL: JWT Secret tokens are not configured in the .env file.")
    }
