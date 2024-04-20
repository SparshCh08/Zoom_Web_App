import express from "express";
import { v4 as uuidv4 } from 'uuid';
import http from "http";
import { Server } from "socket.io";
import { ExpressPeerServer } from "peer";
import dotenv from "dotenv";
dotenv.config()

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3030
const peerServer = ExpressPeerServer(server, { debug: true });

app.use('/peerjs', peerServer);
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.redirect(`${uuidv4()}`)
})
app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId ,userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message)
        })
    })
})

server.listen(port, () => {
    console.log("Server running on port:", port)
})