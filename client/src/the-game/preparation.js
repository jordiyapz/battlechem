/** //////Preparation////////
 * First state of the game
 * Where both players can arrange their elements
 * In this page, contain the elements tab, periodic table, element
 * Mechanism:
 *  v Drag n Drop
 *  - Snap to grid
 *  - Submission
 */

const Preparation = (args) => {
    let _pt = new PeriodicTable({x: 52, y: 130}, 38);
    let _compound = { ch4: null, ch2o: null, h2o: null, o2: null, co2: null }
    const _miniCompound = {};

    let _activeCompound = null;
    let _hasProblem = true;

    const {_cmpWrapper, _playerWrapper} = args;

    const _submitButton = new Button ( { x: 630, y: 520 }, { w: 120, h: 60 }, 'Ready!', 26, false);

    reset = () => {
        _pt = new PeriodicTable({x: 52, y: 130}, 38);
        _compound = { ch4: null, ch2o: null, h2o: null, o2: null, co2: null }
        _activeCompound = null;
        _hasProblem = true;
        init();
    }

    init = () => {
        const wrapper = _cmpWrapper;
        const {x, y} = wrapper.pos;
        const {w, h} = wrapper.dim;
        const names = "ch4,ch2o,h2o,co2,o2".split(',');
        const scale = 20;
        const posY = y + h/2 - scale*1.5 + 12;
        const dist = (w - scale*3*5) / 6;
        for (let idx = 0; idx < names.length; idx++) {
            const name = names[idx];
            const pos = { x: x + dist + (dist + 3*scale) * idx, y: posY };
            _miniCompound[name] = new MiniCompound(name, pos, scale);
        }
    };


    render = () => {
        _pt.display();
        _cmpWrapper.display();
        _playerWrapper.display();
        // _playerWrapper2.display();
        for (keys in _compound) {
            const cmp = _compound[keys];
            if (cmp) {
                cmp.display();
            }
        }
        for (keys in _miniCompound) {
            const cmp = _miniCompound[keys];
            cmp.display();
        }
        _submitButton.display();
    }
    getLcmp = () => {
        return _prepareData().lcmp;
    }

    onMousePressed = () => {
        let flag = {active: false};

        for (keys in _compound) {
            const cmp = _compound[keys];
            if (cmp) {
                cmp.onMousePressed(flag);
                if (flag.active) {
                    _activeCompound = cmp;
                    flag.active = false;
                }
            }
        }
        _activeCompoundUnregister();
        const pocket = { cmp: null, scale: _pt._scale };
        for (keys in _miniCompound) {
            const cmp = _miniCompound[keys];
            if (cmp) {
                cmp.onMousePressed(pocket);
                if (pocket.cmp) {
                    _activeCompound = pocket.cmp;
                    _compound[keys] = _activeCompound;
                    _activeCompound.onMousePressed(flag);
                    pocket.cmp = null;
                }
            }
        }

    }
    onMouseDragged = () => {
        if (_activeCompound) {
            _activeCompound.onMouseDragged(_pt.pos);
            _activeCompoundProblemChecker();
        }
    }
    onMouseReleased = () => {
        if (!_submitButton.hidden) {
            if (_activeCompound) {
                _activeCompound.onMouseReleased();
                _activeCompoundProblemChecker();
                _activeCompoundRegister();
                _activeCompound = null;
            }
            _globalProblemChecker();
            if (!_hasProblem)
                _submitButton.activate();
        }
    }
    onMouseClicked = () => {
        // not yet exported
        if (!_hasProblem) {
            if (_submitButton.clickable()) {
                const data = _prepareData();
                socket.emit('submit', data);
                _submitButton.defaultClicked();
            }
        }
    }

    /**Mechanism */
    _activeCompoundProblemChecker = () => {
        if (_activeCompound) {
            const cmp = _activeCompound;
            const anc = cmp.anchor;
            const scale = cmp.scale;
            const halfScl = scale / 2;
            for(let idx = 0; idx < 9; idx++) {
                const elmCode = cmp.struct[idx];
                if (elmCode != 0) {
                    const p = {
                        x: anc.x + halfScl + scale * (idx % 3),
                        y: anc.y + halfScl + scale * Math.floor(idx / 3)
                    }
                    const cell = _pt.getCellByPoint(p);
                    if (!cell || cell.hasElement) {
                        // There are element that is not sitting on cell
                        cmp.hasProblem = true;
                        this._hasProblem = true;
                        return;
                    }
                }
            }
            cmp.hasProblem = false;
        }
    }
    _globalProblemChecker = () => {
        _hasProblem = false;
        for (keys in _compound) {
            const cmp = _compound[keys];
            if (!cmp || cmp.hasProblem) {
                _hasProblem = true;
                break;
            }
        }
    }
    _activeCompoundRegister = () => {
        if (_activeCompound) {
            const cmp = _activeCompound;
            const anc = cmp.anchor;
            const scale = cmp.scale;
            const halfScl = scale / 2;
            if (!cmp.hasProblem) {
                cmp.struct.forEach((elmCode, idx) => {
                    if (elmCode != 0) {
                        const p = {
                            x: anc.x + halfScl + scale * (idx % 3),
                            y: anc.y + halfScl + scale * Math.floor(idx / 3)
                        }
                        const cell = _pt.getCellByPoint(p);
                        if (!cell) {
                            // There are element that is not sitting on cell
                            console.error('on _activeCompoundRegister: There are element that is not sitting on cell');
                        } else {
                            cell.hasElement = true;
                        }
                    }
                });
            }
        }
    }
    _activeCompoundUnregister = () => {
        if (_activeCompound) {
            const cmp = _activeCompound;
            const anc = cmp.anchor;
            const scale = cmp.scale;
            const halfScl = scale / 2;
            if (!cmp.hasProblem) {
                cmp.struct.forEach((elmCode, idx) => {
                    if (elmCode != 0) {
                        const p = {
                            x: anc.x + halfScl + scale * (idx % 3),
                            y: anc.y + halfScl + scale * Math.floor(idx / 3)
                        }
                        const cell = _pt.getCellByPoint(p);
                        if (!cell) {
                            // There are element that is not sitting on cell
                            console.error('on _activeCompoundRegister: There are element that is not sitting on cell');
                        } else {
                            cell.hasElement = false;
                        }
                    }
                });
            }
        }
    }
    _prepareData = () => {
        const looci = _pt.getListOfOccupiedCellId();
        // const pt = { pos: _pt.pos, scl: _pt.scale };
        const lcmp = [];
        for (key in _compound) {
            const cmp = _compound[key];
            lcmp.push({ name: cmp.getName(), pos: cmp.pos, rot: cmp.getRotation() });
        }
        return {looci, lcmp};
    }

    return {
        render,
        onMousePressed,
        onMouseDragged,
        onMouseReleased,
        onMouseClicked,
        reset,
        getLcmp,
        pt: _pt
    };
}