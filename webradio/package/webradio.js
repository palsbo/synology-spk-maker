var express = require('express');
const WebSocket = require('ws');
const http = require('http');
const url = require('url');
const radio = require("radio-stream");
var app = express()
//var stream;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

var currentUrl = "http://live-icy.gss.dr.dk:80/A/A02H.mp3";
var currentTitle = "";
var currentInfo = "";

function checkArgs(req, res) {
    switch (req.params[0]) {
        case '/index.html':
            if (req.query.id) {
                console.log("Found %s in %s", req.query.id, req.params[0])
            }
            break;
    }
}

app.get(/^(.+)$/, function (req, res) {
    if (req.params[0] == '/') req.params[0] = '/index.html';
    checkArgs(req, res);
    res.sendFile(__dirname + '/web' + req.params[0]);
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

handleStream = function (ar) {
    for (id in ar) {
        switch (id) {
            case 'url':
                currentUrl = ar.url;
                currentTitle = "";
                currentInfo = "";
                wss.broadcast(JSON.stringify({ 'url': currentUrl, 'title': currentTitle, 'info':currentInfo }));
                var stream = new radio.createReadStream(currentUrl)
                stream.on("error", function () {
                    currentInfo = "Stream error!";
                    wss.broadcast(JSON.stringify({ 'info': currentInfo }));
                })
                //stream.on("close", function() { console.log("Stream Closed")});
                stream.on("connect", function () {
                    currentInfo = stream.headers['ice-audio-info'];
                    wss.broadcast(JSON.stringify({ 'info': currentInfo }));
                    stream.on("metadata", function (title) {
                        currentTitle = title.toString().replace("StreamTitle=", "");
                        wss.broadcast(JSON.stringify({ 'title': currentTitle }));
                    });
                });
                break;
        }
    }
}

wss.on('connection', function connection(ws, req) {
    ws.send(JSON.stringify({'url':currentUrl, 'title':currentTitle, 'info':currentInfo}));
    ws.on('message', function incoming(data) {
        handleStream(JSON.parse(data));
    });
});

handleStream({ 'url': currentUrl });

server.listen(81, function listening() {
    console.log('Listening on port %d', server.address().port);
});
