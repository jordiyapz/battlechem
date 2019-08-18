class Wrapper {
    constructor (pos, dim, text, options) {
        this.pos = pos;
        this.dim = dim;
        this.text = text;
    }

    display () {
        const {x, y} = this.pos;
        const {w, h} = this.dim;
        stroke(0);
        strokeWeight(2);
        fill(60, 160, 255, 170);
        rect(x, y, w, h);
        noStroke();
        textSize(18);
        textAlign(LEFT);
        fill(0);
        text(this.text, x + 10, y + 22);
    }
}

class CompoundWrapper extends Wrapper {
    constructor (pos, dim) {
        super (pos, dim);
    }

    display () {
        const {x, y} = this.pos;
        const {w, h} = this.dim;
        stroke(0);
        strokeWeight(2);
        fill(60, 160, 255, 170);
        rect(x, y, w, h);
        noStroke();
        textSize(18);
        textAlign(LEFT);
        fill(0);
        text('Molecules :', x + 10, y + 22);
    }
}

class PlayerWrapper extends Wrapper {
    constructor (pos, dim, tilt, username) {
        super (pos, dim);
        this._tilt = tilt || 1;
        this._tiltAmount = 70;
        this._username = username;
    }

    display () {
        const {x, y} = this.pos;
        const {w, h} = this.dim;
        stroke(0);
        strokeWeight(1);
        fill(120, 160, 255, 200);
        if (this._tilt > 0) {
            quad (x, y, x + w, y, x + w + -this._tilt * this._tiltAmount, y + h, x, y + h);
        } else {
            quad (x, y, x + w, y, x + w, y + h, x - this._tilt * this._tiltAmount, y + h);
        }
        fill(255);
        textSize (40);
        if (this._tilt > 0) {
            textAlign(LEFT);
            text(this._username, x + 10, y + h / 2 + 14);
        } else if (this._tilt < 0) {
            textAlign(RIGHT);
            text(this._username, x + w - 10, y + h / 2 + 14);
        }
    }
}

