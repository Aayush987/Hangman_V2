
const {Server} = require('socket.io');

const io = new Server(3000, {
    cors: true
})

const users = [];       

const rooms = [];

io.on('connection', (socket) => {
    console.log("A user connected", socket.id);

    socket.on('disconnect', () => {
        console.log("A user disconnected", socket.id);
            const index = users.findIndex(user => user.socketId === socket.id);
            if (index !== -1) {
            users.splice(index, 1);
            }
            removeUserFromRoom(socket.id);
            console.log("Number of users connected:", users.length);
    })

    socket.on('join-room', ({ name, email, roomId }) => {
        try {
            let room = rooms.find(r => r.Id === roomId);
            if (!room) {
                room = { 
                    Id: roomId,
                    users: [], 
                    gameRunning: false, 
                };
                rooms.push(room);
                console.log(rooms);
                console.log("Room created and pushed");
            }

            const existingUser = room.users.find(user => user.email === email);
            if(existingUser) {
                socket.emit('user-already-in-room', {message: 'User already in room'});
                return;
            }

            if (room.users.length >= 2 || room.gameRunning) {
                socket.emit('room-full-error', { message: 'Room is full or game is already in progress' });
                return;
            }

            socket.join(roomId);
            room.users.push({ socketId: socket.id, name, email, score: 0 });
            const count = room.users.length;
            console.log(room.users);
            console.log(count);
            
            io.to(roomId).emit('room-player-count',{count});
            console.log(room);
            io.to(roomId).emit('user-joined', { name, Email: email, roomId });
            console.log("user emiited");

            if (room.users.length === 2) {
                startGame(roomId);
            } else {
                socket.emit('waiting-for-opponent');
            }

            // io.to(roomId).emit('player-list', room.users.map(u => ({ name: u.name, email: u.email })));

        } catch (error) {
            console.log("Error in join-room:", error);
            socket.emit('error', { message: 'Failed to join room' });
        }
    });

    socket.on('game-details', ({word, sentence, timer}) => {
        const room = findRoomBySocketId(socket.id);
        if(room) {
            const user = room.users.find(user => user.socketId === socket.id);
             if (user) {
             user.words = [word];
            const opponent = room.users.filter(u => u.roomId === user.roomId && u.socketId !== socket.id)[0];
            console.log(opponent);
            // console.log(opponent.name);
            if(opponent) {
                io.to(opponent.socketId).emit('opponent-word', {word,sentence});
                console.log("Opponent word sended");    
                // io.to(user.roomId).emit('timer', {timer});
            }

            // user.words.push(word);
            // io.to(user.roomId).emit('-word', {word, sentence});
            // io.to(user.room)
        }
        }
    });

    socket.on('keyPressed', ({name, keyPress}) => {
        const room = findRoomBySocketId(socket.id);
        if(room) {
            const user = room.users.find(user => user.socketId === socket.id);
             if(user) {
            user.keyPressed.push(keyPress);
            const opponent = room.users.filter(u => u.roomId === user.roomId && u.socketId !== socket.id)[0];

            // if(opponent) {
            //     opponent.keyPressed.push(keyPressed);
                io.to(opponent.socketId).emit('opponent-keyPressed', {
                    name: user.name,
                    key: keyPress,
                    keyPressed: user.keyPressed  //entire array
                });
    
                console.log("User", name, "pressed key", keyPress);
            // };    
            
        }

       
        }
    })

    socket.on('reset-round', () => {
        const room = findRoomBySocketId(socket.id);
        if(room) {
        const user = room.users.find(user => user.socketId === socket.id);
        if(user) {
            user.keyPressed = [];
            const opponent = room.users.filter(u => u.roomId === user.roomId && u.socketId !== socket.id)[0];
            if(opponent) {
                opponent.keyPressed = [];
            }
            io.to(opponent.socketId).emit('reset-round-keys');
        }
        }
    });

    socket.on('update-score', ({score}) => {
        const room = findRoomBySocketId(socket.id);
        if(room) {
            const user = room.users.find(user => user.socketId === socket.id);
            if(user) {
                user.Score = score;
            const opponent = room.users.filter(u => u.roomId === user.roomId && u.socketId !== socket.id)[0];
            if(opponent) {
                io.to(opponent.socketId).emit('opponent-score', {score});
            }
        }
    }
        
        // socket.to(opponent.socketId).emit('opponent-score', {score});
    })

    function startGame(roomId) {
        const room = rooms.find(r => r.Id === roomId);
        if (!room || room.gameRunning) return;
    
        room.gameRunning = true;
        // room.words = getRandomWords(2); // Get two random words, one for each player
        // room.timer = 30;
    
        io.to(roomId).emit('game-start');
    
        let timer = 30;
                 const timerInterval = setInterval(() => {
                    if (timer > 0) {
                        timer--;
                        // console.log(`Emitting timer update for room ${roomId}: ${timer}`);
                        io.to(roomId).emit('timerUpdate', {timer: timer});
                     } else {
                         clearInterval(timerInterval);
                         io.to(roomId).emit('gameOver', 'Time is up!');
                         room.gameRunning = false;
                  }
            }, 1000);
    }

    function findRoomBySocketId(socketId) {
        console.log(rooms);
        return rooms.find(room => room.users.some(user => user.socketId === socketId));
    }

    function removeUserFromRoom(socketId) {
        const room = findRoomBySocketId(socketId);
       if (room) {
        room.users = room.users.filter(user => user.socketId !== socketId);
        console.log(`User removed from room ${room.id}. Users left: ${room.users.length}`);
        if (room.users.length === 0) {
            // clearInterval(room.timer);
            const index = rooms.findIndex(r => r.id === room.id);
            if (index !== -1) {
                rooms.splice(index, 1);
                console.log(`Room ${room.id} deleted.`);
            }
        }
    }
    }

    

    

})








// const express = require('express');
// const app = express();

// app.use(express.json());



// app.get('/',(req,res) => {
//     res.send('Hello World');
// })

// app.listen(3000, () => {
//     console.log('Server is running on Port 3000');
// })