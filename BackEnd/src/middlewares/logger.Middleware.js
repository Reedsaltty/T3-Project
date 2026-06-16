import pino, { destination, levels } from 'pino'
import { configDotenv } from 'dotenv';

export default function logger(req, res,next) {
    const transport = pino.transport({
        target: 'pino/file',
        options: { destination: 'DIRECTORY'}
    })
    const log = pino({
        level: process.env.PINO_LOG_LEVEL || 'warn',
        formatters :{
            level: (lable) => {
                return {level: lable.toUpperCase() }
            }

        }
    }, transport)

    const userLogger = log.child({user : req.user})
    log.info()
    log.error('error')
 
    next();
}