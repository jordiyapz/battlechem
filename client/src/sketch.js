/**Global Variables */
let gm, font;

function preload () {
    font = loadFont('../assets/AvenirLTStd-Roman.otf');
}

/**Contains only the basic p5js */
function setup() {
    createCanvas(800, 600)
        .parent('canvas-wrapper');
    gm = GameModule({font});
}

function draw() {
    background(10, 30, 180);
    gm.update();
    gm.render();
}

/**Listeners */
function mousePressed() {
    gm.onMousePressed();
    return false;
}

function mouseDragged() {
    gm.onMouseDragged();
    return false;
}

function mouseReleased() {
    gm.onMouseReleased();
    return false;
}

function mouseClicked() {
    gm.onMouseClicked();
    return false;
}

function keyPressed() {
    gm.onKeyPressed();
}