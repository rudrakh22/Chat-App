import { WebSocketServer,WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket:WebSocket;
    room:string
}

let allSockets:User[]=[];
wss.on('connection',(socket)=>{
        socket.on("message",(message:string)=>{
            const parsedMessage=JSON.parse(message.toString())
            if(parsedMessage.type==="join"){
                allSockets.push({
                    socket,
                    room:parsedMessage.payload.roomId
                })
            }
            if (parsedMessage.type==="chat"){
                const currentUserSocket=allSockets.find(x=>x.socket==socket)
                if(!currentUserSocket) return;
                const roomPeoples=allSockets.filter(x=>x.room==currentUserSocket.room)
                roomPeoples.forEach((x)=>{
                    x.socket.send(parsedMessage.payload.message)
                })
            }
        })
});