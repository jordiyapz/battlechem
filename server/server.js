const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const PORT = 7000;

const clientPath = `${__dirname}/../client`;
const libPath = `${__dirname}/../../libraries`;
app.use(express.static(clientPath));
app.use(express.static(libPath));

const server = http.createServer(app); //express app handles all the request and put it into http server
const io = socketIO(server); //Call socket.io server to use the current http server and take it's handler

const BCGame = require ('./classes/bcgame');
const User = require ('./classes/user');

const users = [];
const waitingList = [];

io.on('connection', (socket) => {
    let user = null;
    console.log(`Socket [${socket.id}] is connected`);
    socket.emit('connecting');
    socket.on('introduction', (username) => {
        user = new User (username, socket);
        users.push(user);
        pairer(user);
    })
    socket.on('req-join-game', () => {
        pairer(user);
    })
    socket.on('disconnecting', () => {
        if (user) {
            let pair = null;
            if (user.game) {
                const game = user.game;
                pair = game._players.filter((p) => {
                    return p != user;
                })
                // console.log(pair);
                game.forceLeaveGame();
            }
            let i = waitingList.findIndex( (u) => u == user );
            waitingList.splice(i, 1);
            i = users.findIndex( (u) => u == user );
            users.splice(i, 1);
        }
    })
})

function pairer (user) {
    if (waitingList.length > 0) {
        const pair = waitingList.shift();
        console.log('Paired: ', pair.name, ' n ', user.name);
        new BCGame (pair, user);
    } else {
        waitingList.push(user);
        console.log('Pushed ', user.socket.id, ' to the waiting list');
    }
    // console.log('Waiting List Length: ', waitingList.length);
}

server.on('error', err => console.error('Server error: ', err));
server.listen(PORT, () => {
    console.log('Server started on ', PORT)
})