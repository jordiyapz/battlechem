/** The game mechanism is here
 * Parted into Preparation and Gameplay
 * Using Revealing Module design pattern
 */

const GameModule = (data) => {
    console.log('Game Module Created');
    let stFun = Lobby();
    const font = data.font;
    const states = ['lobby', 'preparation', 'gameplay'];
    let pstate = 'lobby';
    let users = null;
    const _cmpWrapper = new CompoundWrapper ( { x: 60, y: 500 }, { w: 550, h: 100 } );
    let _playerWrapper, _playerWrapper2, p1Obj;

    changeState = (state, onlySwitch) => {
        if (onlySwitch == undefined)
            onlySwitch = false;
        switch (state) {
            case 'lobby':
                pstate = state;
                console.log('Welcome to the Lobby');
                stFun = Lobby();
                break;
            case 'preparation':
                if (!onlySwitch) {
                    users = stFun.users;
                    _playerWrapper = new PlayerWrapper ( { x: 0, y: 14 }, { w: 360, h: 80 }, 1, users[0]);
                }
                pstate = state;
                stFun = Preparation({_cmpWrapper, _playerWrapper});
                break;
            case 'gameplay':
                if (!onlySwitch) {
                    _playerWrapper2 = new PlayerWrapper ( { x: 440, y: 14 }, { w: 360, h: 80 }, -1, users[1]);
                }
                pstate = state;
                stFun = Gameplay ({_cmpWrapper, _playerWrapper, _playerWrapper2});
                break;
            case 'proclamation':
                stFun = HappyBday({font, pstate});
        }
        if (!onlySwitch)
            stFun.reset();
    }

    resetGame = () => {
        console.log('resetting game...');
        changeState ('lobby');
    }

    update = () => {
    }

    render = () => {
        if (stFun.render)
            stFun.render();
    }

    onMousePressed = () => {
        if (stFun.onMousePressed)
            stFun.onMousePressed();
    }

    onMouseDragged = () => {
        if (stFun.onMouseDragged)
            stFun.onMouseDragged();
    }

    onMouseReleased = () => {
        if (stFun.onMouseReleased)
            stFun.onMouseReleased();
    }

    onMouseClicked = () => {
        if (stFun.onMouseClicked)
            stFun.onMouseClicked();
    }

    onKeyPressed = () => {
        if (stFun.onKeyPressed)
            stFun.onKeyPressed();
    }

    socket.on('begin', () => {
        changeState('preparation');
    })

    socket.on('game-begin', (data) => {
        //{playersData: {looci, lcmp}, turn} = data;
        changeState('gameplay');
        stFun.setup(data);
    })

    socket.on('leave-game', () => {
        console.log('Pair has left the game');
        resetGame();
        socket.emit('req-join-game');
    })

    socket.on('force-proc', () => {
        console.log('forcing proclamation');
        changeState('proclamation');
    })
    socket.on('continue', () => {
        changeState(pstate, true);
    })

    return {
        update,
        render,
        onMousePressed,
        onMouseDragged,
        onMouseReleased,
        onMouseClicked,
        onKeyPressed
    };

};

