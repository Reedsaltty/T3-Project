

export function handleServerError (res,err , message){
        res.log.err(err)
        res.status(500).json({ message : message })
}