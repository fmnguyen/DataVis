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

var socket;
var messageBox;
var connected = false;
var authorized = false;

$(document).ready(function() {
    // Connect to the socket
    socket = io.connect('http://localhost:1234');
    socket.on('connect', function(data) {
        connected = true;
    });
    socket.on('disconnect', function(data) {
        connected = false;
    });

    if (hasStoredDetails()) {
        var deets = getStoredDetails();
        socket.emit(Packet.USER_AUTH_EXISTING, { userName: deets[USERNAME_KEY], roomId: deets[ROOM_KEY] });
    } else {
        clearStoredData();
    }

    messageBox = $("#message-box");
    messageBox.keyup(function (e) {
        if (e.keyCode == 13) {
            // User entered message
            alert(messageBox.val());
        }
    });
});

function hasStoredData() {
    return localStorage.getItem(USERNAME_KEY) && localStorage.getItem(ROOM_KEY);
}

function clearStoredData() {
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(ROOM_KEY);
}

function getStoredData() {
    return {
        USERNAME_KEY: localStorage.getItem(USERNAME_KEY),
        ROOM_KEY: localStorage.getItem(ROOM_KEY)
    }
}
