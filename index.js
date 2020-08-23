const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
server.listen(process.env.PORT || 1234, () => console.log('Server khoi dong OK!'))

function Room(roomName) {
    this.roomName = roomName
    this.mangAllMsg = []
}
const mangRoom = [
    new Room('Học tập'),
    new Room('Ăn chơi'),
    new Room('Kinh tế'),
    new Room('Chứng khoán')
]
const mangUsername = []

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))
app.get('/', (req, res) => res.render( // KO được lược bỏ kiểu: ...res => res.render()
    'home', {
    mangRoom: mangRoom.map(e => e.roomName)
    //truyền biến "<%mangRoom%>" cho "home.ejs"
}
))

io.on('connection', socket => {
    console.log("id ket noi la: " + socket.id)
    socket.on('C_DANGKY_1', username => {
        if (mangUsername.indexOf(username) === -1) {
            mangUsername.push(username)
            socket.emit('S_DANGKYOK_2', true)
            socket.username = username
        } else {
            socket.emit('S_DANGKYOK_2', false)
        }
    })
    socket.on('C_VOROOM_3', roomName => {
        socket.leave(socket.currentRoom, () => {
            socket.join(roomName, () => {
                socket.currentRoom = roomName
            })
        })
        const room = mangRoom.find(e => e.roomName == roomName)
        socket.emit('S_ALLMSG_CUA_ROOM_4', room.mangAllMsg)
    })
    socket.on('C_GUIMSG_5', msg => {
        const message = `${socket.username}: ${msg}`
        //loại 4) send to group: io.to(socketid).emit()
        io.to(socket.currentRoom).emit('S_HIENMSG_TOOTHERS_6', message)
        const room = mangRoom.find(e => e.roomName == socket.currentRoom)
        room.mangAllMsg.push(message)
    })
})