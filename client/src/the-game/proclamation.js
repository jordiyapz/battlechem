const HappyBday = (data) => {
    const {font, pstate} = data;
    // const btn = new Button({x: width/2 - 80, y: 470}, {w: 160, h: 80}, 'Continue', 30, 0, 1);

    let points;

    let vehicles = [];


    reset = () => {
        vehicles = [];
        points = font.textToPoints('HBD', 100, 200, 182)
            .concat(font.textToPoints('ICHA', 100, 360, 162));
        points.forEach((pt) => {
            const vehicle = new Vehicle(pt.x, pt.y);
            vehicles.push(vehicle);
        });
        // setTimeout(() => {
        //     btn.hidden = false;
        //     btn.active = true;
        // }, 5000)
    }

    render = () => {
        const len = vehicles.length;
        for (let i = 0; i < len; i++) {
            const v = vehicles[i];
            v.behavior();
            v.update();
            v.show();
        };
        // btn.display();
    }

    onMouseClicked = () => {
        if (btn.clickable()) {
            console.log('continue');
            socket.emit('continue');
        }
    }

    return {
        reset,
        render,
        onMouseClicked
    };
}