export const loggerMiddleware = (req, res, next) => {
    console.log(`# request method: ${req.method} # request url: ${req.url}`)
    next()
}