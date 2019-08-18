class PlayerData {
    constructor (periodicTab, compound, wrapper) {
        this.pt = periodicTab
        this.compound = compound
        this.wrapper = wrapper;
        this.miniCompound = {};
    }

    init (mcwrapper) {
        const wrapper = mcwrapper;
        const {x, y} = wrapper.pos;
        const {w, h} = wrapper.dim;
        const scale = 20;
        const posY = y + h/2 - scale*1.5 + 12;
        const dist = (w - scale*3*5) / 6;
        let idx = 0;
        for (name in this.compound) {
            const cmp = this.compound[name];
            const pos = { x: x + dist + (dist + 3*scale) * idx, y: posY };
            cmp.mini= this.miniCompound[name] = new MiniCompound(name, pos, scale);
            idx++;
        }
        return this;
    }
}