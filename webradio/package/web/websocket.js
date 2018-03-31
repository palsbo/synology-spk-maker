/*
    Standard WebSocket object with reconnect.
    to define obj: ({wsobj} is the name of your ws object.)
        var {wsobj} = new WEBSOCKET('ws:'+ window.location.hostname +':81')
    to define callback functions:
        {wsobj}.onstatus = function(stat) {};
        {wsobj}.onmessage = function(data) {};
    to start the socket in onload():
        {wsobj}.begin();
    by erik@palsbo.com
*/
function WEBSOCKET(websocketServerLocation) {
    var obj = this;
    this.onstatus = function (stat) {
        console.log(stat ? "Online" : "Offline");
    };
    this.onmessage = function (data) {
        console.log(data);
    };
    this.begin = function () {
        socket = new WebSocket(websocketServerLocation);
        socket.onopen = function () {
            obj.onstatus(true);
            if (window.timerID) {
                window.clearInterval(window.timerID);
                window.timerID = 0;
            }
        };
        socket.onmessage = function (e) {
            obj.onmessage(e.data);
        };
        socket.onclose = function () {
            obj.onstatus(false);
            if (!window.timerID) {
                window.timerID = setInterval(function () { obj.begin(websocketServerLocation) }, 5000);
            }
        };
        socket.on = function (id, func) { }
    }
}
