import app from './app'
import http from 'http'
import socketio from 'socket.io'

const port = process.env.PORT
const server = http.createServer(app)
const io = socketio(server)

const message = 'Welcome in my Chat App'

io.on('connection', (socket) => {
    console.log('New websocket connection')

    socket.emit('message', message)

    socket.on('chatMsg', (msg)=> {
        io.emit('message', msg)
    })

    console.log('This is read only once')

    // socket.emit('countUpdated', count)

    // socket.on('increment', () => {
    //     count++
    //     // socket.emit('countUpdated', count)
    //     io.emit('countUpdated', count)
    // })

})

server.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})