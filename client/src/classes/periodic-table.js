class PeriodicTable {
    constructor (pos, scale) {
        this._table = [];
        this.pos = pos || {x: 0, y: 0};
        this._scale = scale || 20;
        this._generateTable();
    }

    _generateTable () {
        const symbols = "H,He,Li,Be,B,C,N,O,F,Ne,Na,Mg,Al,Si,P,S,Cl,Ar,K,Ca,Sc,Ti,V,Cr,Mn,Fe,Co,Ni,Cu,Zn,Ga,Ge,As,Se,Br,Kr,Rb,Sr,Y,Zr,Nb,Mo,Tc,Ru,Rh,Pd,Ag,Cd,In,Sn,Sb,Te,I,Xe,Cs,Ba,La,Ce,Pr,Nd,Pm,Sm,Eu,Gd,Tb,Dy,Ho,Er,Tm,Yb,Lu,Hf,Ta,W,Re,Os,Ir,Pt,Au,Hg,Tl,Pb,Bi,Po,At,Rn,Fr,Ra,Ac,Th,Pa,U,Np,Pu,Am,Cm,Bk,Cf,Es,Fm,Md,No,Lr,Rf,Db,Sg,Bh,Hs,Mt,Ds,Rg,Uub,Uut,Uuq,Uup,Uuh,Uus,Uuo".split(',');
        const {x, y} = this.pos;
        const size = this._scale;
        let elmCt = 1;
        // const numOfElement = [2, 8, 8, 18, 18, 18, 18, 14, 14];
        for (let j = 0; j < 9; j++) {
            for (let i = 0; i < 18; i++) {
                const pos = {x: x + i*size, y: y + j*size};
                let addElm = true;
                let elmNum = elmCt;
                switch (j) {
                    case 0:
                        if (i.between(1, 17)) continue;
                        break;
                    case 1:
                    case 2:
                        if (i.between(2, 12)) continue;
                        break;
                    case 5:
                        if (i >= 3) elmNum += 14;
                        break;
                    case 6:
                        if (i < 3) elmNum += 14;
                        else elmNum += 28;
                        break;
                    case 7:
                        if (i.between(3, 17)) elmNum -= 33;
                        else continue;
                        break;
                    case 8:
                        if (i.between(3, 17)) elmNum -= 15;
                        else continue;
                        break;
                }

                if (addElm) {
                    this._table.push(new Cell(pos, size, elmNum, symbols[elmNum - 1]));
                    elmCt++;
                }

            }
        }
    }
    display () {
        const {x, y} = this.pos;
        const wid = this._scale * 18;
        const hei = this._scale * 3;
        this._table.forEach(cell => {
            let content = false;
            if (cell.isMouseOver())
                content = true;
            cell.display({content});
        })
    }
    getCellByPoint (point) {
        const id = this.getCellIdByPoint(point);
        if (id < 0)
            return null;
        return this._table[id];
    }
    getCellIdByPoint (point) {
        const table = this._table;
        const len = table.length;
        for (let i = 0; i < len; i++) {
            if (table[i].isPointInside(point))
                return i;
        }
        return -1;
    }
    getListOfOccupiedCellId () {
        let occupiedCellId = [];
        this._table.forEach((cell, idx) => {
            if (cell.hasElement)
                occupiedCellId.push(idx);
        });
        return occupiedCellId;
    }
    setTable (looci) {
        looci.forEach((cellId) => {
            this._table[cellId].hasElement = true;
        })
    }
    checkHit () {
        const cell = this.getCellByPoint({ x: mouseX, y: mouseY });
        let score = -1;
        if (cell) {
            cell.hitted = true;
            if (cell.hasElement) score = 1;
            else score = 0;
        }
        return score;
    }
    hitSender () {
        const cellId = this.getCellIdByPoint({ x: mouseX, y: mouseY });
        if (cellId > -1 && !this._table[cellId].hitted){
            socket.emit('tell-all', 'hitting', cellId);
        }
    }
}

class Cell {
    constructor (pos, size, num, sym) {
        this._pos = pos || {x: 0, y: 0};
        this._size = size || 10;
        this.num = num || 1;
        this.symbol = sym || 'H';
        this.hasElement = false;
        this.hitted = false;
        this.revealed = false;
    }

    isMouseOver () {
        return this.isPointInside({x: mouseX, y: mouseY});
    }

    isPointInside (p) {
        const {x, y} = this._pos;
        return (p.x.between(x, x + this._size) && p.y.between(y, y + this._size));
    }

    display (option) {
        const {x, y} = this._pos;
        const size = this._size;
        fill(255, 255, 255, 100);
        stroke(0, 0, 200, 50);
        strokeWeight(1);
        rect(x, y, size, size);

        if (this.hitted && !this.revealed) {
            if (this.hasElement) {
                fill(255,0,0);
                ellipse (x + size/2, y + size/2, size*.7, size*.7);
            } else {
                stroke(0);
                strokeWeight(1);
                const gap = 8;
                line(x + gap, y + gap, x - gap + size, y - gap + size);
                line(x + gap, y + gap + size, x - gap + size, y - gap);
            }
        }

        if (option.content) {
            noStroke();
            fill (0, 0, 0, 50);
            textSize(6);
            textAlign(LEFT);
            text(this.num, x + 2, y + 8);
            textSize(16);
            textAlign(CENTER);
            text(this.symbol, x + size / 2, y + size / 2 + 8);
        }
    }
}