const { Server} = require('socket.io')
const io = new Server ({cors: 'http://localhost:5173'})


let onlineUsers = []

io.on('connection', (socket) => {
  
    
    // listen to client connection 
    socket.on('addNewUser', (userId) => {
        !onlineUsers.some(user => user.userId === userId) &&
        onlineUsers.push({
            userId,
            socketId: socket.id
        });
        io.emit('getOnlineUsers', onlineUsers)
        console.log('onlineUser', onlineUsers)
    });

    // add message 
    socket.on('sendMessage', (message) => {
        const currentUser = onlineUsers.find((user) => user.userId === message.recipientId)
    //  send to the user if he is online 
        if(currentUser) {
            io.to(currentUser.socketId).emit('getMessage', message.singleMessage)
        }
    })

      // Handle disconnect event to remove user from onlineUsers array
    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
        io.emit('getOnlineUsers', onlineUsers);
    });

})

io.listen(4040);