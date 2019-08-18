/**This is where the socket global variables take place */

const socket = io();

// socket.on('leave-game', () => {
//     const gm = GameModule();
//     gm.reset();
//     console.log('hehe');
// })

socket.on('log', (data) => {
    console.log(data);
})

// socket.on('begin', () => {
//     gm.changeState('preparation');
//     console.log('gm changed');
// })

function forceProc () {
    socket.emit('force-proclamation');
    console.log('force proclamation event sent!');
}