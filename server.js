import http from 'http'
import { books } from './books.js'

const PORT = process.env.PORT || 1300

const server = http.createServer((req, res) => {

    if (req.method === "GET") {
        if (req.url.match(/\/api\/books\/([0-9]+)/)) {
            const bookId = parseInt(req.url.split('/')[3])
            const book = books.find(book => book.id === bookId)
            if (book) {
                // using method 1
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 200
                res.end(JSON.stringify(book))
            } else {
                // using method 2 (better)
                res.writeHead(404, {'Content-Type' : 'application/json'})
                res.end(JSON.stringify({msg: "book not found"}))
            }
        } 
        else if (req.url === '/api/books') {
            // respond with all books
            res.writeHead(200, {'Content-Type' : 'application/json'})
            res.end(JSON.stringify(books))
        }
    } else if (req.method === "POST" && req.url === "/api/books") {
        // streaming data
        let body = ''
        req.on('data', (chunk) => body += chunk)
        // when all chunks arrive
        req.on('end', () => {
            const newBook = JSON.parse(body)
            const requiredFields = ['title', 'pagesCount', 'author', 'released', 'genre', 'status']
            const missingFields = requiredFields.filter(field => !(field in newBook))

            // check if all fields are available
            if (missingFields.length > 0) {
                res.writeHead(400, {'Content-Type': 'application/json'})
                res.end(JSON.stringify({msg: `missing fields: ${missingFields.join(', ')}`}))
                return
            }
            // insert new book safely
            newBook.id = Math.max(...books.map(b => b.id)) + 1
            books.push(newBook)
            res.writeHead(201, {'Content-Type': 'application/json'})
            res.end(JSON.stringify(newBook))
        })
    } else if (req.method === 'PUT' && req.url.match(/\/api\/books\/([0-9]+)/)) {
        // streaming data
        let body = ''
        req.on('data', (chunk) => body += chunk)

        // when all chunks arrive
        req.on('end', () => {
            // get book id to update
            const bookId = parseInt(req.url.split('/')[3])

            // get old book fiels
            let book = books.find(book => book.id === bookId)
            if (book) {
                // merge old fields with new fields
                let newBook = {...book, ...JSON.parse(body)}
                // replace old book
                const index = books.findIndex(book => book.id === bookId)
                books[index] = newBook
                // respond
                res.writeHead(204) // updated successfully and no content is returned
                res.end()
            } else {
                res.writeHead(404, {'Content-Type' : 'application/json'})
                res.end(JSON.stringify({msg: "book not found"}))
            }
        })
    } else if (req.method === 'DELETE' && req.url.match(/\/api\/books\/([0-9]+)/)) {
        // find book
        const bookId = parseInt(req.url.split('/')[3])
        const book = books.find(book => book.id === bookId)
        if (book) {
            // delete book
            books.splice(books.findIndex(book => book.id === bookId), 1)
            // respond
            res.writeHead(200, {'Content-Type' : 'application/json'})
            res.end(JSON.stringify({msg: "book deleted successfully"}))
        } else {
            res.writeHead(404, {'Content-Type' : 'application/json'})
            res.end(JSON.stringify({msg: "book not found"}))
        }
        
    } else {
        res.writeHead(404, {'Content-Type' : 'application/json'})
        res.end(JSON.stringify({msg: "route not found"}))
    }

})

server.listen(PORT, () => {
    console.log("server is listening on port ", PORT)
})