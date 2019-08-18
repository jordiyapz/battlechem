class Vehicle {
    constructor(x, y) {
        this.pos = createVector(random(width), random(height));
        this.target = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.acc = createVector();
        this.r = 8;
        this.maxSpeed = 5;
        this.maxForce = .5;
    }

    behavior() {
        let seek = this.arrive(this.target);


        const mouse = createVector(mouseX, mouseY);
        let flee = this.flee(mouse);

        seek.mult(1);
        flee.mult(5);

        this.applyForce(seek);
        this.applyForce(flee);
    }

    arrive(targ) {
        const desire = p5.Vector.sub(targ, this.pos);
        const d = desire.mag();
        let speed = this.maxSpeed;
        const c = 30;
        if (d < c) {
            speed = map(speed, 0, c, 0, this.maxSpeed);
        }
        desire.setMag(speed);
        let steer = p5.Vector.sub(desire, this.vel);
        steer.limit(this.maxForce);
        return steer;
    }

    flee(targ) {
        const desire = p5.Vector.sub(targ, this.pos);
        const d = desire.mag();
        let steer = createVector(0, 0);
        if (d < 50) {
            desire.setMag(this.maxSpeed);
            desire.mult(-2);
            steer = p5.Vector.sub(desire, this.vel);
            steer.limit(this.maxForce);
            return steer;
        }
        return steer;
    }

    applyForce(f) {
        this.acc.add(f);
    }

    update() {
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.acc.mult(0);
    }

    show() {
        stroke(255);
        strokeWeight(this.r);
        point(this.pos.x, this.pos.y);
    }
}