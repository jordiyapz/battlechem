const Gameplay = (args) => {
    const players = [null, null];
    let turn = 0;
    let turnCt = 0;
    let pegs = 0;
    let gameover = false;
    const _cmpWrapper = new Wrapper ( { x: 60, y: 500 }, { w: 450, h: 100 }, 'Molecules:');
    const _pegWrapper = new Wrapper ( { x: 510, y: 500 }, { w: 230, h: 100 }, 'Pegs:');

    setup = (data) => {
        const pWrappers = [args._playerWrapper, args._playerWrapper2];
        const scale = 38;
        const {playersData} = data;
        turn = data.turn;

        const _createCompound = (name, pos, scale, rot) => {
            name = name.toLowerCase();
            let cmp = null;
            switch (name) {
                case 'h2o':
                    cmp = new H2O(pos, scale, rot);
                    break;
                case 'ch4':
                    cmp = new CH4(pos, scale, rot);
                    break;
                case 'co2':
                    cmp = new CO2(pos, scale, rot);
                    break;
                case 'ch2o':
                    cmp = new CH2O(pos, scale, rot);
                    break;
                case 'o2':
                    cmp = new O2(pos, scale, rot);
            }
            return cmp;
        }
        playersData.forEach( (playerData, id) => {
            const pt = new PeriodicTable({x: 52, y: 130}, scale);
            // pt.setTable(playerData.looci);
            const compound = {};
            playerData.lcmp.forEach (cmpObj => {
                const name = cmpObj.name.toLowerCase();
                const cmp = compound[name] = _createCompound(name, cmpObj.pos, scale, cmpObj.rot).silent();

                const anc = cmp.anchor;
                const halfScl = scale / 2;
                cmp.struct.forEach((elmCode, idx) => {
                    if (elmCode != 0) {
                        const p = {
                            x: anc.x + halfScl + scale * (idx % 3),
                            y: anc.y + halfScl + scale * Math.floor(idx / 3)
                        }
                        const cell = pt.getCellByPoint(p);
                        if (!cell) {
                            console.error('on _activeCompoundRegister: There are element that is not sitting on cell');
                        } else {
                            cmp.cells.push(cell);
                            cell.hasElement = true;
                        }
                    }
                });

            })

            players[id] = new PlayerData(pt, compound, pWrappers[id]).init(_cmpWrapper);
        })

        // players.forEach((player, id) => {
        //     let ct = 0;
        //     player.pt._table.forEach ( (cell, idx) => {
        //         if (cell.hasElement) ct++;
        //     })
        //     console.log(`Player [${id}]'s periodic tabel has ${ct} element/s`);
        // })
        pegs = 3;

    }

    reset = () => {
        for (let i = 0; i < 2; i++) {
            players[i] = null;
            turn = Math.round(random(1));
            turnCt = 0;
            pegs = 0;
        }
    }

    onMouseClicked = () => {
        if (!gameover) {
            if (turn == 0 && pegs > 0) {
                const player = players[turn];
                player.pt.hitSender();
            }
        }
    }

    render = () => {
        const player = players[turn];
        _cmpWrapper.display();
        _pegWrapper.display();
        if (player) {
            player.wrapper.display();
            player.pt.display();
            const comp = player.compound;
            const mc = player.miniCompound;
            for (name in comp) {
                const cmp = comp[name];
                if (cmp.revealed)
                    comp[name].display();
                mc[name].display();
            }
        }
        if (gameover) {
            background(190, 170, 60, 100);
            fill (51);
            textAlign(CENTER, CENTER);
            textSize(60);
            text('GAME OVER', width/2, height/2);
        }
    }

    socket.on('hitting', (cellId) => {
        const player = players[turn];
        const cell = player.pt._table[cellId];
        cell.hitted = true;
        pegs--;
        if (cell.hasElement) {
            pegs++
            _checkCompoundReveal();
        }
        if (turn == 0 && pegs <= 0) {
            setTimeout (() => {
                socket.emit('tell-all', 'switch-turn');
            }, 500)

        }
    })

    socket.on('switch-turn', () => {
        pegs = 3;
        turn = (turn + 1) % 2;
    })

    _checkCompoundReveal = () => {
        const player = players[turn];
        let gameFinished = true;
        for (name in player.compound) {
            const cmp = player.compound[name];
            if (!cmp.revealed) {
                let willReveal = true;
                for (let i = 0; i < cmp.cells.length; i++) {
                    if (!cmp.cells[i].hitted) {
                        willReveal = false;
                        break;
                    }
                }
                if (willReveal) {
                    cmp.cells.forEach(cell => {
                        cell.revealed = true;
                    })
                    cmp.revealed = true;
                    cmp.mini.available = false;
                } else {
                    gameFinished = false;
                }
            }
        }
        if (gameFinished) {
            console.log('Game Over!');
            gameover = true;
        }
    }

    return {
        setup,
        reset,
        onMouseClicked,
        render
    }
}