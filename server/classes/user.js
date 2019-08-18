class User {
    constructor (name, socket) {
        this.name = name;
        this.socket = socket;
        this.game = null;
    }
}

module.exports = User;