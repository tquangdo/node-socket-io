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
    new Room('Học tập'),
]
const mangUsername = []

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))
app.get('/', (req, res) => { // KO được lược bỏ kiểu như ReactJS: ...res => {}
    res.render('home', {
        //truyền biến "<%mangRoom%>" cho "home.ejs"
        mangRoom: mangRoom.map(room_item => room_item.roomName)
    })
})

io.on('connection', socket => {
    console.log('id ket noi la: ' + socket.id)
    socket.currentRoom = 'Học tập'
    socket.join('Học tập')
    socket.emit('S_ALLMSG_CUA_ROOM_4', mangRoom[0].mangRoomMsg)
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
        const room = mangRoom.find(room_item => room_item.roomName === roomName)
        // console.log('mangRoom: ', mangRoom)
        socket.emit('S_ALLMSG_CUA_ROOM_4', room.mangRoomMsg)
    })
    socket.on('C_GUIMSG_5', msg => {
        const message = `${socket.username}: ${msg}`
        //loại 4) send to group: io.to(socketid).emit()
        io.to(socket.currentRoom).emit('S_HIENMSG_TOGROUP_6', message)
        const room = mangRoom.find(room_item => room_item.roomName === socket.currentRoom)
        room.mangRoomMsg.push(message)
    })
    socket.on('C_TAOROOM_7', function (roomName) {
        if (mangRoom.indexOf(roomName) === -1) {

            socket.join(roomName);
            if (socket.currentRoom != undefined) {
                socket.leave(socket.currentRoom);
            }
            socket.currentRoom = roomName;

            socket.emit('S_CHECK_TENROOMMOI_8', roomName);
            socket.broadcast.emit('S_OK_ROOMMOI_9', roomName); //bắt buộc loại broadcast, xem cmt out file "xuly.js"
            // mangRoom.unshift(roomName);
            mangRoom.push(new Room(roomName));
        } else {
            socket.emit('S_CHECK_TENROOMMOI_8', false);
        }
    });
})