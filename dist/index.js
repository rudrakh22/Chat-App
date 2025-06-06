"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on('connection', (socket) => {
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());
        console.log("parsed", parsedMessage);
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type === "chat") {
            const currentUserSocket = allSockets.find(x => x.socket == socket);
            if (!currentUserSocket)
                return;
            const roomPeoples = allSockets.filter(x => x.room == currentUserSocket.room);
            roomPeoples.forEach((x) => {
                x.socket.send(parsedMessage.payload.message);
            });
        }
    });
});
