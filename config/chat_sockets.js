const cors = require('cors');
const Message = require("../models/messageModel");

module.exports.chatSockets = function (socketServer) {

    let io = require("socket.io")(socketServer, {
        cors: {
            origin: "http://localhost:8000",
            methods: ["GET", "POST"]
        }
    });

    io.sockets.on('connection', function (socket) {
        console.log('new connection received', socket.id);

        socket.on("disconnect", function () {
            console.log("socket disconnect");
        })

        //on method call when join_room is emit from chat engine(client)
        socket.on("join_room", function (data) {
            console.log('joining request rec.', data);

            socket.join(data.chatroom);

            // for emit in chat room we emit request by io
            io.in(data.chatroom).emit('user_joined', data);
            //send notification of client to all other usersthet new user is enter in room
        });

        //detect send_message and broadcast to everyone in room
        socket.on('send_message', async function (data) {
            // io.in(data.chatroom).emit('receive_message', data);

            const messageData = {
                user_email: data.user_email,
                message: data.message,
                chatroom: data.chatroom,
            };

            try {
                // Save the message to MongoDB
                const message = await Message.create(messageData);

                // Emit the message to all clients in the room
                io.in(data.chatroom).emit('receive_message', message);
            } catch (err) {
                console.error('Error saving message to database:', err);
            }

        })
    });

}