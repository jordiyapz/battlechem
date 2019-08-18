const Lobby = () => {
    const username = "Jordi Yaputra";//prompt('What is your name?');
    let users = [username];
    let STATE = 0;

    const egBtn = new EnterGameButton({ x: 340, y: 500 }, { w: 120, h: 80 });

    socket.on('connecting', () => {
        console.log('You are connected!');
        socket.emit('introduction', username);
    })
    socket.on('acquaintanceship', pairName => {
        users.push(pairName);
        STATE++;
    })

    reset = () => {
        STATE = 0;
        users = [username];
    }

    render = () => {
        switch (STATE) {
            case 0:
                fill(255);
                textSize(50);
                textAlign(CENTER);
                text('Waiting for opponent...', width/2, height/2);
                break;
            case 1:
                fill(255);
                textSize(50);
                textAlign(CENTER);
                text(users[0] + ' vs ' + users[1], width/2, height/2);
                egBtn.display();
        }

    }

    onMouseClicked = () => {
        egBtn.onMouseClicked();
    }

    return {
        render,
        onMouseClicked,
        reset,
        users
    };
}