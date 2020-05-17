import app from './app'
import http from 'http'
import socketio, { Socket } from 'socket.io'
import Filter from 'bad-words'

const port = process.env.PORT
const server = http.createServer(app)
const io = socketio(server)

const communication = (socket: Socket) => {
    socket.on('sendMessage', (message, callback)=> {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        io.emit('message', message)
        callback()
    })
}

io.on('connection', (socket) => {
    console.log('New websocket connection')

    socket.emit('message', 'Welcome in my Chat App')

    socket.broadcast.emit('message', 'A new user has joined')

    communication(socket)

    socket.on('disconnect', () => {
        io.emit('message', 'User has left')
    })

    socket.on('sendLocation', (location, callback) => {
        io.emit('message', `Location: https://google.com/maps?q=${location.latitude},${location.longitude}`)
        callback()
    })
})

app.post('/chat', (req, res) => {
    io.emit('message', req.body)
    res.send({ message: 'Emitted successfully' })
})

server.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})