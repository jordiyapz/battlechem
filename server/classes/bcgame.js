class BCGame {
    constructor (p1, p2) {
        this._players = [p1, p2];
        this._records = [null, null];

        this._broadcaster();

        this._listenForceProclamation();
        this._listenContinue();

        this._players.forEach((p) => {
            p.game = this;
        })
        this._beAcquaintance();
        this._tellAll('log', 'You are paired');

        this._listenBegin ();
        this._listenSubmit ();
    }

    _beAcquaintance () {
        this._players.forEach( (p, idx) => {
            p.socket.emit('acquaintanceship', this._players[idx % 2].name);
        })
    }

    _tellAll (event, args) {
        this._players.forEach( (p) => {
            p.socket.emit(event, args);
        })
    }
    _broadcaster () {
        this._players.forEach( (player) => {
            player.socket.on('tell-all', (header, args) => {
                this._tellAll(header, args);
            })
        })
    }

    _listenBegin () {
        let ct = 0;
        this._players.forEach((p, idx) => {
            p.socket.on('begin', () => {
                ct++;
                console.log(ct);
                if (ct >= 2) {
                    this._tellAll ('begin');
                    console.log('begin sent to all players');
                    ct = 0;
                }
            })
        })
    }
    _listenSubmit () {
        const players = this._players;
        let ct = 0;
        const playersData = [null, null];
        players.forEach((player, idx) => {
            player.socket.on('submit', (data) => {
                // const {looci, lcmp} = data;
                // this._records[idx] = new Record (looci);
                playersData[idx] = data;
                ct++;
                if (ct >= 2) {
                    const turn = Math.round(Math.random());
                    players.forEach((p, i) => {
                        p.socket.emit('game-begin', {
                            playersData: [playersData[(i + 1) % 2], playersData[i]],
                            turn: (turn == i)? 0 : 1
                        });
                    })
                }
            })
        })
    }
    _listenForceProclamation () {
        const players = this._players;
        players.forEach((player, idx) => {
            player.socket.on('force-proclamation', () => {
                this._tellAll('force-proc')
            })
        })
    }
    _listenContinue () {
        const players = this._players;
        players.forEach((player, idx) => {
            player.socket.on('continue', () => {
                this._tellAll('continue')
            })
        })
    }

    forceLeaveGame () {
        this._players.forEach( p => {
            p.socket.emit('leave-game');
            p.game = null;
        })
    }
}

module.exports = BCGame;