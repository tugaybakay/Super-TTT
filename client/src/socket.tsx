import { io, Socket } from "socket.io-client";

interface mySocket extends Socket {
  roomID?: string | null,
  username?: string | null
}

const socket: mySocket = io("127.0.0.1:3000",{
  reconnection: true, 
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 5000,
  autoConnect: true,
  transports: ["websocket"]
});

socket.username = null;
socket.roomID = null;

socket.on("disconnet",() => {
  socket.removeAllListeners();
})

export default socket;
