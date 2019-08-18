class Button {
    constructor (pos, dim, text, tSize, act, hid) {
        this._pos = pos;
        this._dim = dim;
        this._text = text || null;
        this._tSize = tSize || 20;
        this.active = (act != undefined)? act : true;
        this.hidden = hid || false;
    }

    _isMouseOver () {
        const {x, y} = this._pos;
        const {w, h} = this._dim;
        return (mouseX.between(x, x + w) && mouseY.between(y, y + h));
    }

    clickable () {
        return (this.active && this._isMouseOver() );
    }

    activate () {
        this.active = true;
    }
    defaultClicked () {
        this.hidden = true;
        this.active = false;
    }

    display () {
        if (!this.hidden) {
            const {x, y} = this._pos;
            const {w, h} = this._dim;
            let am = (this.active)? 0 : 180;
            stroke(0, 255 - am);
            strokeWeight(2);
            fill (120, 160, 255, 200 - am);
            rect (x, y, w, h, 20);
            stroke(51, 255 - am)
            fill (255, 255 - am);
            textSize(this._tSize);
            textAlign(CENTER);
            text(this._text, x + w / 2, y + h / 2 + 10);
        }
    }

}

class SubmitButton extends Button {
    constructor (pos, dim) {
        super (pos, dim);
    }

    // onMouseClicked () {
    //     // if (this._isMouseOver()) {
    //     //     alert('Submitted!');
    //     // }
    // }

    display (hidden) {
        const {x, y} = this._pos;
        const {w, h} = this._dim;
        let am = (hidden)? 180 : 0;
        stroke(0, 255 - am);
        strokeWeight(2);
        fill (120, 160, 255, 200 - am);
        rect (x, y, w, h, 20);
        stroke(51, 255 - am)
        fill (255, 255 - am);
        textSize(26);
        textAlign(CENTER);
        text('Ready!', x + w / 2, y + h / 2 + 10);
    }

}

class EnterGameButton extends Button {
    constructor (pos, dim) {
        super(pos, dim);
        this._active = true;
    }

    onMouseClicked () {
        if (this._active && this._isMouseOver()) {
            socket.emit('begin');
            this._active = false;
        }
    }

    display (hidden) {
        if (this._active) {
            const {x, y} = this._pos;
            const {w, h} = this._dim;
            let am = (hidden)? 180 : 0;
            stroke(0, 255 - am);
            strokeWeight(2);
            fill (120, 160, 255, 200 - am);
            rect (x, y, w, h, 20);
            stroke(51, 255 - am);
            fill (255, 255 - am);
            textSize(26);
            textAlign(CENTER);
            text('Begin', x + w / 2, y + h / 2 + 10);
        }
    }

}