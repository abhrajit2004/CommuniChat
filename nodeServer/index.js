const io = require("socket.io")(8000);
const app = require('express')();
const cors = require('cors');

app.use(cors());

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', username => {
        users[socket.id] = username;
        socket.broadcast.emit('user-joined', username);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, username: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})

app.listen(() => {
    console.log('Server is running on port 8000');
})