import http from 'http'
import { books } from './books.js'
// middlewares
import { loggerMiddleware } from './middlewares/loggerMiddleware.js'
import { jsonMiddleware } from './middlewares/jsonMiddleware.js'
// controllers
import { 
    getAllBooksHandler, 
    getBookByIdHandler, 
    addNewBookHandler,
    updateBookHandler,
    deleteBookHandler
    } from './booksController.js'


const PORT = process.env.PORT || 1300

const server = http.createServer((req, res) => {

    loggerMiddleware(req, res, () => {
        jsonMiddleware(req, res, () => {
            if (req.method === "GET") {
                if (req.url.match(/\/api\/books\/([0-9]+)/)) getBookByIdHandler(req, res)
                else if (req.url === '/api/books') getAllBooksHandler(req, res)
            }
            else if (req.method === "POST" && req.url === "/api/books") {
                addNewBookHandler(req, res)
            }
            else if (req.method === 'PUT' && req.url.match(/\/api\/books\/([0-9]+)/)) {
                updateBookHandler(req, res)
            }
            else if (req.method === 'DELETE' && req.url.match(/\/api\/books\/([0-9]+)/)) {
                deleteBookHandler(req, res)
            }
            else {
                res.statusCode = 404
                res.end(JSON.stringify({msg: "route not found"}))
            }
        })
    })

})

server.listen(PORT, () => console.log("server is listening on port ", PORT))