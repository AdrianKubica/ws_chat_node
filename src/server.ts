import app from './app'
import http from 'http'
import socketio, { Socket } from 'socket.io'
import Filter from 'bad-words'
import { generateMessage, generateLocationMessage } from './utils/messages'
import { addUser, removeUser, getUser, getUsersInRoom } from './utils/users'

const port = process.env.PORT
const server = http.createServer(app)
const io = socketio(server)

const communication = (socket: Socket) => {
    socket.on('sendMessage', (message, callback)=> {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        io.to(user.room).emit('message', generateMessage(message, user.username))
        callback()
    })
}

io.on('connection', (socket) => {
    console.log('New websocket connection')

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message', generateMessage('Welcome in my Chat App', user.username))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined`, user.username))
        callback()
    })

    communication(socket)

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left`, user.username))
        }
    })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`, user.username))
        callback()
    })
})

app.post('/chat', (req, res) => {
    io.emit('message', generateMessage(req.body.message, 'REST API'))
    res.send({ message: 'Emitted successfully' })
})

server.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})