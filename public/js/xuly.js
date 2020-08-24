let activeRoom = null
const socket = io()
let username = ''
$(document).ready(() => {
    $('#div-an-khi-dang-ky').hide()
    //1)
    $('#btn-dang-ky').click(() => {
        username = $('#txt-username').val()
        socket.emit('C_DANGKY_1', username)
    })
    //2)
    socket.on('S_DANGKYOK_2', kqTrueFalse => {
        if (kqTrueFalse) {
            $('#div-dang-ky').hide()
            $('#div-an-khi-dang-ky').show()
            $('#welcome-login').append(`Chào bạn: ${username}`)
            $('#list-room li').addClass('active')
        } else {
            alert('Nickname đã tồn tại!!!')
        }
    })
    //3)
    // KO được như dưới vì chỉ click được những rooms có sẵn, KO click được room mới (append)
    //$('#list-room li').click(function () {
    $(document).on("click", '.item-room', function () { // KO được dùng arrow func kiểu: ...click(()=> {}
        $('#list-room li').removeClass('active')
        $(this).addClass('active')
        activeRoom = $(this).html()
        socket.emit('C_VOROOM_3', activeRoom)
    })
    //4)
    socket.on('S_ALLMSG_CUA_ROOM_4', mangRoomMsg => {
        $('#list-message li').remove()
        mangRoomMsg.forEach(msg_item =>
            $('#list-message').append(`<li>${msg_item}</li>`)
        )
    })
    //5)
    $('#btn-send').click(() => {
        var msg = $('#txt-msg').val()
        socket.emit('C_GUIMSG_5', msg)
    })
    //6)
    socket.on('S_HIENMSG_TOGROUP_6', msg => {
        $('#list-message').append(`<li>${msg}</li>`)
    })
    //7)
    $('#btn-tao-room').click(function () {
        socket.emit('C_TAOROOM_7', $('#txt-room').val());
    });
    //8)
    socket.on('S_CHECK_TENROOMMOI_8', function (roomName) {
        if (!roomName) {
            alert('Tên room đã tồn tại!!!');
        } else {
            $('#list-room li').removeClass('active')
            $('#list-room').append(`<li class='item-room active'>${roomName}</li>`);
            $('#list-message').html("") //or .empty()
        }
    });
    //9) KO duplicate with 8, nếu KO có 9) thì tuy 1 user thêm room mới nhưng các users khác ko thấy room đó!
    socket.on('S_OK_ROOMMOI_9', function (roomName) {
        $('#list-room').append(`<li class='item-room'>${roomName}</li>`);
    });
})