const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
server.listen(process.env.PORT || 1234, () => console.log('Server khoi dong OK!'))

function Room(roomName) {
    this.roomName = roomName
    this.mangRoomMsg = []
}
const mangRoom = [
    new Room('Mặc định'),
]
const mangUser = []

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))
app.get('/', (req, res) => { // KO được lược bỏ kiểu như ReactJS: ...res => {}
    res.render('home', {
        //truyền biến "<%mangXXX%>" cho "home.ejs"
        mangRoom: mangRoom.map(room_item => room_item.roomName),
        mangUser: mangUser.map(user_item => user_item)
    })
})

io.on('connection', socket => {
    console.log('id ket noi la: ' + socket.id)
    socket.currentRoom = 'Mặc định'
    socket.join('Mặc định')
    socket.emit('S_ALLMSG_CUA_ROOM_4', mangRoom[0].mangRoomMsg)
    socket.on('C_DANGKY_1', username => {
        if (mangUser.indexOf(username) === -1) {
            mangUser.push(username)
            socket.emit('S_DANGKYOK_2', true)
            socket.username = username
            //loại 1)
            io.sockets.emit('S_OK_USERMOI_10', username)
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
        const room = mangRoom.find(room_item => room_item.roomName === roomName)
        socket.emit('S_ALLMSG_CUA_ROOM_4', room.mangRoomMsg)
    })
    socket.on('C_GUIMSG_5', msg => {
        const message = `${socket.username}: ${msg}`
        //loại 4)
        io.to(socket.currentRoom).emit('S_GUIMSG_TOROOM_6', message)
        const room = mangRoom.find(room_item => room_item.roomName === socket.currentRoom)
        room.mangRoomMsg.push(message)
    })
    socket.on('C_TAOROOM_7', function (roomName) {
        if ((mangRoom.findIndex(room_item => room_item.roomName === roomName)) === -1) {
            socket.join(roomName)
            if (socket.currentRoom != undefined) {
                socket.leave(socket.currentRoom)
            }
            socket.currentRoom = roomName
            socket.emit('S_CHECK_TENROOMMOI_8', roomName)
            //loại 3)
            socket.broadcast.emit('S_OK_ROOMMOI_9', roomName) // bắt buộc cần, xem cmt out file "xuly.js"
            mangRoom.push(new Room(roomName))
        } else {
            socket.emit('S_CHECK_TENROOMMOI_8', false)
        }
    })
    socket.on("disconnect", function () {
        mangUser.splice(mangUser.indexOf(socket.username), 1)
        //loại 3)
        socket.broadcast.emit('S_USEROUT_DOILIST_11', mangUser)
        //loại 4)
        io.to(socket.currentRoom).emit('S_USEROUT_INFO_11', socket.username)
    })
    socket.on("C_FOCUSIN_12", function () {
        socket.in(socket.currentRoom).broadcast.emit("S_FOCUSIN_13", socket.username + " đang gõ phím...")
    })
    socket.on("C_FOCUSOUT_14", function () {
        socket.in(socket.currentRoom).broadcast.emit("S_FOCUSOUT_15")
    })
})