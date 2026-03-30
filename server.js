import http from 'http'
import { getFileName, getDirName } from './utils.js'

const PORT = process.env.PORT || 1300

const server = http.createServer((req, res) => {
    // method 1
    // res.statusCode = 201
    // res.setHeader('Content-Type', "text/html")
    // res.end("<h1>server is healthy</h1>")
    
    // method 2
    // res.statusCode = 404
    // res.setHeader('Content-Type', "text/plein")
    // res.end("<h1>server is healthy</h1>") // displayed as text not html

    // method 3
    // res.statusCode = 500
    // res.setHeader('Content-Type', "application/json") // return json object
    // res.end(JSON.stringify({msg: "server is healthy"}))

    // set both status code and headers
    // res.writeHead(200, {
    //     'Content-Type': "application/json"
    // })
    // res.end(JSON.stringify({msg: "server is healthy"}))

    const __Filename = getFileName()
    const __Dirname = getDirName(__Filename)

    console.log(__Filename)
    console.log(__Dirname)
})

server.listen(PORT, () => {
    console.log("server is listening on port ", PORT)
})