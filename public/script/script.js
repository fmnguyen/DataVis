var Packet = {
    USER_AUTH_NEW: '1',
    USER_AUTH_EXISTING: '2',
    USER_AUTH_RESPONSE: '3',
    USER_JOIN_ROOM: '4',
    USER_LEAVE_ROOM: '5',
    USER_CHANGE_ROOM: '6',
    USER_CHANGE_ROOM_RESPONSE: '7',
    ROOMS_UPDATE_REQUEST: '8',
    ROOMS_UPDATE: '9',
    USER_DISCONNECTING: '10',
    CHAT_MESSAGE: '11',
    ALERT: '12'
};

var USERNAME_KEY = 'nodechat.username';
var ROOM_KEY = 'nodechat.room';

var enterUser, submit;
var enterMsg, submitMsg;
var socket;
var currentUser;
var currentRoom;

$(document).ready(function() {
     //change to whatever the IP is
    socket = io.connect('http://69.91.218.182:1234');

    // Example testing for entering username in input and submitting
    enterMsg = $("#enterMsg");
    submitMsg = $("#submitMsg");
    submitMsg.on("click", function() {
        //socket.emit(Packet.USER_AUTH_NEW, { userName: enterUser.val() });
        //socket.emit(Packet.ROOMS_UPDATE_REQUEST);
        var time = new Date();
        socket.emit(Packet.CHAT_MESSAGE, { user: currentUser, msg: enterMsg.val(), time: time.getTime() });
        //update('[' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + '] &lt;' + 
            //currentUser.displayName + '&gt; ' + enterMsg.val());
    	enterMsg.val('');
    });

    enterUser = $("#enterUser");
    submit = $("#submit");
    submit.on("click", function() {
        socket.emit(Packet.USER_AUTH_NEW, { userName: enterUser.val() });
        //socket.emit(Packet.ROOMS_UPDATE_REQUEST);
        //socket.emit(Packet.CHAT_MESSAGE, { user: currentUser, msg: enterUser.val(), time: (new Date()).getTIme() })
    	enterUser.val('');
    });

    // If we have both username and room id in local storage
    if (localStorage.getItem(USERNAME_KEY) && localStorage.getItem(ROOM_KEY)) {
        socket.emit(Packet.USER_AUTH_EXISTING, { userName: localStorage.getItem(USERNAME_KEY), roomId: localStorage.getItem(ROOM_KEY) });
    } else {
        clearStoredData();
        // So in this else, set up the username input UI, then do this on submit
        // socket.emit(Packet.USER_AUTH_NEW, { userName: 'the entered username' }); 
    }

    socket.on(Packet.USER_AUTH_RESPONSE, function(data) {
        if (data.err) {
            // Invalid or already existing user
            clearStoredData();
           alert(data.err);
        } else {
            setStoredData(data.user.displayName, data.room.id);

            currentUser = data.user;
            currentRoom = data.room;

            // do setup here for UI, we are subbed to a room now, and we'll be receiving messages!
        }
    });

    socket.on(Packet.USER_JOIN_ROOM, function(data) {
        console.log(data);
        update(data.user.displayName + ' has joined the room!');
    });

    socket.on(Packet.USER_LEAVE_ROOM, function(data) {
        console.log(data);
        update(data.user.displayName + ' has left the room!');
    });

    socket.on(Packet.ROOMS_UPDATE, function(data) {
        console.log(data);
    });

    socket.on(Packet.ALERT, function(data) {
        console.log(data);
        alert(data.msg);
    });

    socket.on(Packet.CHAT_MESSAGE, function(data) {
        console.log(data);
        var msg = data.msg;
        var userName = data.user.displayName;
        var time = new Date(data.time);

        update('[' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + '] &lt;' + 
            userName + '&gt; ' + msg);
    });
});

$(window).bind('beforeunload', function(eventObject) {
    socket.emit(Packet.USER_DISCONNECTING, { user: currentUser });
    //clearStoredData();
}); 

function setStoredData(userName, roomId) {
    localStorage.setItem(USERNAME_KEY, userName);
    localStorage.setItem(ROOM_KEY, roomId);
}

function clearStoredData() {
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(ROOM_KEY);
}

function update(msg) {
    // $("#output").append('<div class="message"> Msg: ' + msg + '</div>')
    // Since i dunno how to html
    var container = document.createElement("div");
    container.innerHTML = msg;
    document.getElementById("test").appendChild(container);
}
