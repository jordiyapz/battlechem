class Compound {
    constructor (pos, scale) {
        this.struct = [] // array of 9
                          // 1 = h, 2 = c, 3 = o
        this._boneList; // Object of bones in v, h, d
        this._name;

        this.cells = []; // It's own corresponding cells
        this.mini = null;

        this.pos = pos || {x: 0, y: 0};
        this.anchor = pos || {x: 0, y: 0};
        this.postAnchor = pos || {x: 0, y: 0};
        this._rotation = 0; // 0..3 = UP, RIGHT, DOWN, LEFT
        this.scale = scale || 10;
        this._elmPercent = .7;

        this._active = false;
        this._hidden = false;
        this.hasProblem = true;
        this.revealed = false;
    }

    /**Event Handler */
    onMousePressed (flag) {
        this._active = this._isMouseOver();
        // console.log(this._name, ' is ', (this._active)? '':'not ', 'active');
        if (this._active) {
            flag.active = true;
            this.postAnchor = {
                x: this.anchor.x,
                y: this.anchor.y
            };
            // console.log("Anchor saved ", this.postAnchor);
        }
    }
    onMouseDragged (ptPos) {
        if (this._active) {
            const scale = this.scale;
            this.pos.x = mouseX - scale * 1.5;
            this.pos.y = mouseY - scale * 1.5;
            this.updateAnchor(ptPos);
        }
    }
    onMouseReleased () {
        if (this._active) {
            if (this.anchor.x == this.postAnchor.x && this.anchor.y == this.postAnchor.y) {
                this._rotate();
            } else {
                if (this.hasProblem) {
                    this.anchor = this.postAnchor;
                    // console.log("Anchor loaded ", this.postAnchor);
                }
            }
            this.pos = this.anchor;
            this._active = false;
        }
    }
    onKeyPressed () {
        if (this._active && keyCode == 32) {
            this._rotate();
        }
    }

    /**Event Checker */
    _isMouseOver () {
        const {x, y} = this.pos;
        const scale = this.scale;
        const elmSize = scale * this._elmPercent;

        let output = false;
        if (mouseX.between(x, x + scale*3, true) && mouseY.between(y, y + scale*3, true))
            this.struct.forEach((elmCode, idx) => {
                if (elmCode != 0) {
                    const pos = {
                        x: x + ((idx % 3) + .5) * scale,
                        y: y + (Math.floor(idx / 3) + .5) * scale
                    }
                    const d = dist (mouseX, mouseY, pos.x, pos.y);
                    if (d < elmSize/2) {
                        output = true;
                    }
                }
            })
        return output;
    }

    /**Mechanism */
    _rotate () {
        //Rotate Struct
        const struct = this.struct;
        let temp = new Array(9);
        for (let i = 0, c = 1; i < 9; i++) {
            if (i % 3 == 0) c += 1;
            else c += 2;
            temp[(c + i) % 9] = struct[i];
        }
        this.struct = temp;

        //rotate bones
        let boneListV = this._boneList.v.slice(0);
        for (let i = 0; i < 3; i++ ) {
            this._boneList.v[i] = this._boneList.h[i].slice(0);
        }
        for (let i = 0; i < 3; i++ ) {
            this._boneList.h[i] = boneListV[i].slice(0).reverse();
        }
        temp = this._boneList.d[1].slice(0);
        this._boneList.d[1] = this._boneList.d[0];
        this._boneList.d[0] = temp.reverse();

        this._rotation = (this._rotation + 1) % 4;
    }
    _rotateN (n) {
        for (let i = 0; i < n; i++)
            this._rotate();
    }
    updateAnchor (ptPos) {
        // let x = this.pos.x + this.scale / 2 - ptPos.x;
        // x = x - x % this.scale + ptPos.x;
        let x = this.pos.x + this.scale * 1.5 - ptPos.x;
        x = x - x % this.scale + ptPos.x - this.scale;
        let y = this.pos.y + this.scale * 1.5 - ptPos.y;
        y = y - y % this.scale + ptPos.y - this.scale;
        this.anchor = {x, y};
    }

    displayShadow(anchor) {
        const anc = this.anchor;
        strokeWeight(3);
        if (this.hasProblem) {
            stroke(255, 40, 40);
            fill(255, 0, 0, 30);
        } else {
            stroke(40, 255, 40);
            fill(0, 255, 0, 30);
        }
        for (let idx = 0; idx < this.struct.length; idx++) {
            const elmCode = this.struct[idx];
            if (elmCode != 0) {
                rect(
                    anc.x + (idx % 3) * this.scale,
                    anc.y + Math.floor(idx / 3) * this.scale,
                    this.scale, this.scale
                );
            }
        }
    }
    displayBones(c) {
        const {x, y} = this.pos;
        const scale = this.scale;
        const elmSize = scale * this._elmPercent;

        c = c || 0;

        stroke(c);
        strokeWeight(3);

        const boneList = this._boneList;

        for (keys in boneList) {
            //Array of Bones
            const boneMat = boneList[keys];
            const halfLength = (keys == 'd')? 1.2 * scale / 2 - elmSize / 2 : scale / 2 - elmSize / 2;
            const boneHalfDist = 3;

            boneMat.forEach((boneArr, matIdx) => {
                boneArr.forEach((qty, arrIdx) => {
                    if (qty > 0) {
                        let pos;
                        let lineCoord;
                        switch (keys) {
                            case 'v':
                                pos = {
                                    x: x + scale * (matIdx + .5),
                                    y: y + scale * (arrIdx + 1)
                                };
                                lineCoord = [pos.x, pos.y - halfLength, pos.x, pos.y + halfLength];
                                break;
                            case 'h':
                                pos = {
                                    x: x + scale * (arrIdx + 1),
                                    y: y + scale * (matIdx + .5)
                                };
                                lineCoord = [pos.x - halfLength, pos.y, pos.x + halfLength, pos.y];
                                break;
                            case 'd':
                                pos = {
                                    x: x + scale * ((matIdx + arrIdx) % 2 + 1),
                                    y: y + scale * (arrIdx + 1)
                                };
                                if (matIdx) lineCoord = [pos.x - halfLength, pos.y + halfLength, pos.x + halfLength, pos.y - halfLength];
                                else lineCoord = [pos.x - halfLength, pos.y - halfLength, pos.x + halfLength, pos.y + halfLength];
                                break;
                        }

                        if (qty == 1)
                            line (lineCoord[0], lineCoord[1], lineCoord[2], lineCoord[3]);
                        else {
                            if (keys == 'v') {
                                line (lineCoord[0] - boneHalfDist, lineCoord[1], lineCoord[2] - boneHalfDist, lineCoord[3]);
                                line (lineCoord[0] + boneHalfDist, lineCoord[1], lineCoord[2] + boneHalfDist, lineCoord[3]);
                            } else {
                                line (lineCoord[0], lineCoord[1] - boneHalfDist, lineCoord[2], lineCoord[3] - boneHalfDist);
                                line (lineCoord[0], lineCoord[1] + boneHalfDist, lineCoord[2], lineCoord[3] + boneHalfDist);
                            }
                        }
                    }
                })
            })

        }
    }
    displayAtom (c) {
        const {x, y} = this.pos;
        const scale = this.scale;
        const elmSize = scale * this._elmPercent;
        c = c || 0;

        this.struct.forEach((elmCode, idx) => {
            if (elmCode != 0) {
                const pos = {
                    x: x + ((idx % 3) + .5) * scale,
                    y: y + (Math.floor(idx / 3) + .5) * scale
                }
                let sym;
                switch (elmCode) {
                    case 1: sym = 'H'; break;
                    case 2: sym = 'C'; break;
                    case 3: sym = 'O';
                }
                // Draw a Circle
                stroke(c);
                noFill();
                strokeWeight(3);
                ellipse(pos.x, pos.y, elmSize);

                // Display the symbol
                noStroke();
                fill (c);
                textAlign(CENTER);
                const text_size = elmSize * .8;
                textSize(text_size);
                text(sym, pos.x, pos.y + text_size * .4);
            }
        })
    }
    getName () {
        return this._name;
    }
    getRotation () {
        return this._rotation;
    }
    silent () {
        this.hasProblem = false;
        return this;
    }

    /**Common */
    display () {
        if (this._active || this.hasProblem)
            this.displayShadow();
        this.displayBones();
        this.displayAtom();
    }

}

class MiniCompound extends Compound {
    constructor (name, pos, scale) {
        super(pos, scale);
        this._construct (name);
        this.available = true;
    }

    _construct (name) {
        let cmp = this._createCompound(name);
        if (!cmp)
            console.log('Error! Mini Compound construct name');
        this.struct = cmp.struct.slice(0);
        this._boneList = cmp._boneList;
        cmp._boneList = null;
        this._name = cmp._name.slice(0);
    }

    _createCompound(name, pos, scale, rot) {
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

    display() {
        const c = this.available? 0 : color(40, 100);
        this.displayBones(c);
        this.displayAtom(c);
    }

    onMousePressed(pocket) {
        const {x, y} = this.pos;
        const scl = this.scale;
        if (this.available && this._isMouseOver()) {
            this.available = false;

            const pos = {
                x: mouseX - pocket.scale * 1.5,
                y: mouseY - pocket.scale * 1.5
            }
            pocket.cmp = this._createCompound(this._name, pos, pocket.scale);
        }
    }

    _isMouseOver () {
        const {x, y} = this.pos;
        const scl = this.scale;
        return (mouseX.between(x, x + scl*3) && mouseY.between(y, y + scl*3));
    }

}

class H2O extends Compound {
    constructor (pos, scale, rot) {
        super(pos, scale);
        this.struct = [
            0, 0, 0,
            0, 3, 1,
            0, 1, 0
        ];
        this._boneList = {
            v: [[0, 0], [0, 1], [0, 0]],
            h: [[0, 0], [0, 1], [0, 0]],
            d: [[0, 0], [0, 0]],
        };
        this._name = 'H2O';
        if (rot != undefined)
            this._rotateN (rot);
    }
}
class CH4 extends Compound {
    constructor (pos, scale, rot) {
        super(pos, scale);
        this.struct = [
            0, 1, 0,
            1, 2, 1,
            0, 1, 0
        ];
        this._boneList = {
            v: [[0, 0], [1, 1], [0, 0]],
            h: [[0, 0], [1, 1], [0, 0]],
            d: [[0, 0], [0, 0]],
        };
        this._name = 'CH4';
        if (rot != undefined)
            this._rotateN (rot);
    }
}
class CO2 extends Compound {
    constructor (pos, scale, rot) {
        super(pos, scale);
        this.struct = [
            0, 0, 0,
            3, 2, 3,
            0, 0, 0
        ];
        this._boneList = {
            v: [[0, 0], [0, 0], [0, 0]],
            h: [[0, 0], [2, 2], [0, 0]],
            d: [[0, 0], [0, 0]],
        };
        this._name = 'CO2';
        if (rot != undefined)
            this._rotateN (rot);
    }
}
class CH2O extends Compound {
    constructor (pos, scale, rot) {
        super(pos, scale);
        this.struct = [
            0, 3, 0,
            0, 2, 0,
            1, 0, 1
        ];
        this._boneList = {
            v: [[0, 0], [2, 0], [0, 0]],
            h: [[0, 0], [0, 0], [0, 0]],
            d: [[0, 1], [0, 1]],
        };
        this._name = 'CH2O';
        if (rot != undefined)
            this._rotateN (rot);
    }
}
class O2 extends Compound {
    constructor (pos, scale, rot) {
        super(pos, scale);
        this.struct = [
            0, 0, 0,
            0, 3, 3,
            0, 0, 0
        ];
        this._boneList = {
            v: [[0, 0], [0, 0], [0, 0]],
            h: [[0, 0], [0, 2], [0, 0]],
            d: [[0, 0], [0, 0]],
        };
        this._name = 'O2';
        if (rot != undefined)
            this._rotateN (rot);
    }
}