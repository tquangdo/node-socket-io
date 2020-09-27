let activeRoom = null
const socketVar = io('https://shielded-shore-33619.herokuapp.com')
let username = ''
$(document).ready(() => {
    $('#div-an-khi-dang-ky').hide()
    //1)
    $('#btn-dang-ky').click(() => {
        username = $('#txt-username').val()
        socketVar.emit('C_DANGKY_1', username)
    })
    //2)
    socketVar.on('S_DANGKYOK_2', kqTrueFalse => {
        if (kqTrueFalse) {
            $('#div-dang-ky').hide()
            $('#div-an-khi-dang-ky').show()
            $('#welcome-login').append(`User: ${username}`)
            // $('#list-user').append(`<li>${username}</li>`)
            $('#list-room li:first').addClass('active')
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
        socketVar.emit('C_VOROOM_3', activeRoom)
        $('#room-message').html("Nội dung chat trong room [" + activeRoom + "]: ")
    })
    //4)
    socketVar.on('S_ALLMSG_CUA_ROOM_4', mangRoomMsg => {
        $('#list-message li').remove()
        mangRoomMsg.forEach(msg_item =>
            $('#list-message').append(`<li>${msg_item}</li>`)
        )
    })
    //5)
    $('#btn-send').click(() => {
        var msg = $('#txt-msg').val()
        socketVar.emit('C_GUIMSG_5', msg)
    })
    //6)
    socketVar.on('S_GUIMSG_TOROOM_6', msg => {
        $('#list-message').append(`<li>${msg}</li>`)
    })
    //7)
    $('#btn-tao-room').click(function () {
        const newRoomName = $('#txt-room').val()
        socketVar.emit('C_TAOROOM_7', newRoomName)
        $('#room-message').html("Nội dung chat trong room [" + newRoomName + "]: ")
    })
    //8)
    socketVar.on('S_CHECK_TENROOMMOI_8', function (roomName) {
        if (!roomName) {
            alert('Tên room đã tồn tại!!!')
        } else {
            $('#list-room li').removeClass('active')
            $('#list-room').append(`<li class='item-room active'>${roomName}</li>`)
            $('#list-message').html("") //or .empty()
        }
    })
    //9) KO duplicate with 8, nếu KO có 9) thì tuy 1 user thêm room mới nhưng các users khác ko thấy room đó!
    socketVar.on('S_OK_ROOMMOI_9', function (roomName) {
        $('#list-room').append(`<li class='item-room'>${roomName}</li>`)
        $('#info-msg').html(`<i>User đã vừa tạo room mới tên: ${roomName}</i>`)
    })
    //10) giống 9)
    socketVar.on('S_OK_USERMOI_10', function (username) {
        $('#list-user').append(`<li>${username}</li>`)
        $('#info-msg').html(`<i>User: ${username} đã vừa vô!</i>`)
    })
    //11) giống 9)
    socketVar.on('S_USEROUT_DOILIST_11', function (mangUser) {
        $('#list-user').html("")
        mangUser.map(user_item => {
            $('#list-user').append(`<li>${user_item}</li>`)
        })
    })
    socketVar.on('S_USEROUT_INFO_11', function (username) {
        $('#info-msg').html(`<i>User: ${username} đã vừa out!</i>`)
    })
    // 12)
    $("#txt-msg").focusin(function () {
        socketVar.emit("C_FOCUSIN_12")
    })
    // 13)
    socketVar.on("S_FOCUSIN_13", function (data) {
        $("#thongbao-chat").html(data)
    })
    // 14)
    $("#txt-msg").focusout(function () {
        socketVar.emit("C_FOCUSOUT_14")
    })
    // 15)
    socketVar.on("S_FOCUSOUT_15", function () {
        $("#thongbao-chat").html("")
    })
})