import { books } from "./books.js"

export const getAllBooksHandler = (req, res) => {
    // respond with all books
    res.statusCode = 200
    res.end(JSON.stringify(books))
}

export const getBookByIdHandler = (req, res) => {
    // find book
    const bookId = parseInt(req.url.split('/')[3])
    const book = books.find(book => book.id === bookId)
    // check & respond
    if (book) {
        res.statusCode = 200
        res.end(JSON.stringify(book))
    } else {
        res.statusCode = 404    
        res.end(JSON.stringify({msg: "book not found"}))
    }
}

export const addNewBookHandler = (req, res) => {
    // streaming data
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk)) // store buffers
    // when all chunks arrive
    req.on('end', () => {
        const body = Buffer.concat(chunks).toString()
        const newBook = JSON.parse(body)
        const requiredFields = ['title', 'pagesCount', 'author', 'released', 'genre', 'status']
        const missingFields = requiredFields.filter(field => !(field in newBook))

        // check if all fields are available
        if (missingFields.length > 0) {
            res.statusCode = 400
            res.end(JSON.stringify({msg: `missing fields: ${missingFields.join(', ')}`}))
            return
        }
        // insert new book safely
        newBook.id = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1
        books.push(newBook)
        res.statusCode = 201
        res.end(JSON.stringify(newBook))
    })
}

export const updateBookHandler = (req, res) => {
    // streaming data
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk)) // store buffers

    // when all chunks arrive
    req.on('end', () => {
        // get book id to update
        const bookId = parseInt(req.url.split('/')[3])

        // get new fields
        const body = Buffer.concat(chunks).toString()

        // get old book fiels
        let book = books.find(book => book.id === bookId)
        if (book) {
            // merge old fields with new fields
            let newBook = {...book, ...JSON.parse(body)}
            // replace old book
            const index = books.findIndex(book => book.id === bookId)
            books[index] = newBook
            // respond
            res.statusCode = 204 // updated successfully and no content is returned
            res.end()
        } else {
            res.statusCode = 404
            res.end(JSON.stringify({msg: "book not found"}))
        }
    })
}

export const deleteBookHandler = (req, res) => {
    // find book
    const bookId = parseInt(req.url.split('/')[3])
    const book = books.find(book => book.id === bookId)
    if (book) {
        // delete book
        books.splice(books.findIndex(book => book.id === bookId), 1)
        // respond
        res.statusCode = 200
        res.end(JSON.stringify({msg: "book deleted successfully"}))
    } else {
        res.statusCode = 404
        res.end(JSON.stringify({msg: "book not found"}))
    }
}