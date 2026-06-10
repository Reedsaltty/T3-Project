function logger(req, res,next) {
    console.log(`log`)
    next()
}

export default logger;