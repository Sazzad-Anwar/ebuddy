// @Description: All server running configuration is setting up here.
// @CreatedAt:
// @Author-name: Md. Sazzad Bin Anwar

const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const http = require('http');
const server = http.createServer(app);
require('dotenv').config();
const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});
const connectMongoDB = require('./config/db/MongoDB');
require('colors');
const port = process.env.PORT || 8080;
const {
    errorHandler,
    notFound
} = require('./middlewares/middlewares');
const { joinUsers, userLeave, getRoomUser, getAllUser, friendRequestSend, friendRequestDeclined, friendRequestAccepted } = require('./libs/users');
const Message = require('./models/messsages');
const User = require('./models/users');

//This will show the request path for every request only for development mode
if (process.env.NODE_ENV !== 'production') {
    const morgan = require('morgan');
    app.use(morgan('tiny'));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'public')));

//@Description: To use mongoDB connection
connectMongoDB('eBuddy');

app.use('/api/v1', require('./routes/AppRoute'));

let count = 0;

io.on('connection', (socket) => {
    console.log(`Socket connected ${count}`.cyan);

    socket.on('user-login', async data => {

        console.log('user-login event called');

        const joinedUser = await joinUsers(socket.id, data.email, data.photo, data.name)
        const allUsers = await getAllUser();

        let userInfo = {
            allUsers,
            joinedUser
        }

        io.emit('user-joined', userInfo)
        socket.broadcast.to(joinedUser.email).emit('roomUser', {
            users: await getRoomUser(joinedUser.email)
        });
    })

    socket.on('room-user', email => {
        console.log('room-user event called');
        let user = getRoomUser(email)
        socket.join(email);
        io.to(email).emit('room-user-details', user)
    })

    socket.on('friend-request-send', async data => {
        console.log('friend-request-send event called');
        let { requestReceiver, requestSender, message, requestSenderUser } = await friendRequestSend(data.friendId, data.myId)
        io.emit('friend-request', ({ requestReceiver, requestSender, message, requestSenderUser }))
    })

    socket.on('friend-request-declined', async data => {
        console.log('friend-request-declined event called');
        let { message } = await friendRequestDeclined(data);
    })

    socket.on('friend-request-accepted', async data => {
        console.log('friend-request-accepted event called');
        let { requestId, userId } = await friendRequestAccepted(data);
        io.emit('friend-list', ({ requestId, userId }));
    })

    socket.on('message', async msg => {
        console.log('message event called');
        socket.broadcast.emit('chat-message', msg)
    });

    socket.on('messageDelete', async data => {
        console.log('messageDelete event called');
        await Message.deleteOne({ _id: data });
        io.emit('removeMsgFromChat', data);
    })

    socket.on('disconnect', async () => {
        console.log('disconnect event called');
        const leavingUser = await userLeave(socket.id);
        const allUsers = await getAllUser()
        if (leavingUser) {
            socket.emit('roomUser', {
                users: getRoomUser(leavingUser.email)
            });
            let userInfo = {
                allUsers,
                leavingUser
            }
            io.emit('user-joined', userInfo)
        }
    })

    count++;
});

app.use(errorHandler);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
    console.log('Build file connected');
});
app.use(notFound);

server.listen(port, () => console.log(`App is listening on port ${port}!`.cyan.underline));