const http = require('http')
const app = require('./app')
const { disconnectDB, connectDB } = require('./lib/db')

const server = http.createServer(app)

const port = process.env.PORT || 5000
server.listen(port, () => console.log(`listening on port: ${port}`))

connectDB()

const terminate = () => {
    Object.values(io.sockets.sockets).forEach(socket => socket.disconnect())
    server.close(() => {
        disconnectDB(() => {
            process.exit(0)
        })
    })
}

process.on('SIGTERM', terminate)
process.on('SIGINT', terminate)