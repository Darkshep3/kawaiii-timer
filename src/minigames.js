let ground, BG_IMG, DRAG_IMG, BASE_IMG, PIPE_UP_IMG, PIPE_DOWN_IMG, HEART_IMG;
const WIN_WIDTH = 300;
const WIN_HEIGHT = 420;
const GROUND_HEIGHT = 80;
let health = 3;
let drag, score;
let hitboxes = false;
pipes = [];

let minigameOPEN = false;
let gameStarted = false;

function startMinigames(){
    document.getElementById('intro').style.display = 'none';
    document.getElementById('back').style.display = 'block';
    document.getElementById('settings').style.display = 'none';
    document.getElementById('timer').style.display = 'none';
    document.getElementById('minigames').style.display = 'block';
    document.getElementById('HTTYD').style.display = 'block';    
    document.getElementById("background").style.display = 'none';
    if (window._canvasInstance) {
        window._canvasInstance.remove();
        window._canvasInstance = null;
    }

    let canvas = createCanvas(WIN_WIDTH, WIN_HEIGHT);
    canvas.parent("HTTYD"); 
    canvas.id("flappy-canvas");
    window._canvasInstance = canvas;

    frameRate(30);

    pipes = [];
    health = 3;
    gameStarted = false;
    minigameOPEN = true;

    ground = new Ground();
    drag = new Drag();
    score = new Score(0);

    document.getElementById("HTTYD").style.visibility = "visible";

    showIntroTexts();

}
function preload() {
  BG_IMG = loadImage("assets/forestsky.png");
  DRAG_IMG = [
    loadImage("assets/drag-upflap.png"),
    loadImage("assets/drag-midflap.png"),
    loadImage("assets/drag-upflap.png"),
  ];

  BASE_IMG = loadImage("assets/base.png");
  PIPE_UP_IMG = loadImage("assets/pipeUp.png");
  PIPE_DOWN_IMG = loadImage("assets/pipeDown.png");
  HEART_IMG = loadImage("assets/heart.png");
}

function setup() {
    document.getElementById("HTTYD").style.visibility = "hidden";

    let canvas = createCanvas(WIN_WIDTH, WIN_HEIGHT);
    canvas.parent("HTTYD"); 
    canvas.id("flappy-canvas");

    window._canvasInstance = canvas;

    frameRate(30);

    ground = new Ground();
    drag = new Drag();
    score = new Score(0);
    document.getElementById("HTTYD").style.visibility = "visible";

}

function draw() {
    background(BG_IMG);
    pipesUpdate();
    pipes.forEach(pipe => {
        pipe.show();
        if (pipe.isCollided(drag)){
            ENDGAME();
        }
        });
    ground.update();
    ground.show();
    drag.update();
    showHearts();

    if (gameStarted) {
        score.show();
    }
}

function Ground(){
    this.velocity = 5;
    this.x1 = 0;
    this.x2 = WIN_WIDTH; 
    this.y = height - GROUND_HEIGHT;
    this.update = () => {
        this.x1 -= this.velocity;
        this.x2 -= this.velocity;
        if (this.x1 <= -width){
            this.x1 = width;
        }
        if (this.x2 <= -width){
            this.x2 = width;
        }
    };
    this.show = () => {
        image(BASE_IMG, this.x1, this.y, width, BASE_IMG.height);
        image(BASE_IMG, this.x2, this.y, width, BASE_IMG.height);
    
    };
}

function Pipe(){
    this.SCALE = 1.1; 
    this.velocity = 6;
    this.gap = 150;

    this.x = width;
    this.y = random (175,350);

    this.scaledWidth = this.SCALE * PIPE_UP_IMG.width;
    this.scaledHeight = this.SCALE * PIPE_UP_IMG.height;
    this.topPosition = this.y - this.scaledHeight - this.gap;

    this.show = () => {
        image(PIPE_UP_IMG, this.x, this.y, this.scaledWidth, this.scaledHeight);
        image(PIPE_DOWN_IMG, this.x, this.topPosition, this.scaledWidth, this.scaledHeight);
        if (hitboxes){
            push();
            noFill();
            stroke('blue');
            rect(this.x, this.y, this.scaledWidth, this.scaledHeight); 
            rect(this.x, this.y - this.scaledHeight - this.gap, this.scaledWidth, this.scaledHeight); 
            pop();
        }
    };

    this.update = () => {
        this.x = this.x - this.velocity;
    };
    this.isOff = () => {
        return this.x < -this.scaledWidth;
    };
    this.isPassed = (drag) => {
        return drag.x > this.x + Math.floor(this.scaledWidth/2);
    };
    this.isCollided = (drag) => {
        const shrinkFactor = 0.85; 

        const dragWidth = DRAG_IMG[0].width * drag.SCALE * shrinkFactor;
        const dragHeight = DRAG_IMG[0].height * drag.SCALE * shrinkFactor;
        const dragLeft = drag.x - dragWidth / 2;
        const dragRight = drag.x + dragWidth / 2;
        const dragTop = drag.y - dragHeight / 2;
        const dragBottom = drag.y + dragHeight / 2;

        const topPipeX = this.x;
        const topPipeY = this.y - this.scaledHeight - this.gap;
        const topPipeW = this.scaledWidth;
        const topPipeH = this.scaledHeight;

        const bottomPipeX = this.x;
        const bottomPipeY = this.y;
        const bottomPipeW = this.scaledWidth;
        const bottomPipeH = this.scaledHeight;

        const isOverlap = (x1, y1, w1, h1, x2, y2, w2, h2) => {
            return (
                x1 < x2 + w2 &&
                x1 + w1 > x2 &&
                y1 < y2 + h2 &&
                y1 + h1 > y2
            );
        };

        const collideTop = isOverlap(
            dragLeft, dragTop, dragWidth, dragHeight,
            topPipeX, topPipeY, topPipeW, topPipeH
        );

        const collideBottom = isOverlap(
            dragLeft, dragTop, dragWidth, dragHeight,
            bottomPipeX, bottomPipeY, bottomPipeW, bottomPipeH
        );

        return collideTop || collideBottom;
    };

}

function pipesUpdate(){
    if (!gameStarted) return;
    if (frameCount % 60 === 0){
        const pipe = new Pipe();
        pipes.push(pipe);
    }
    for (let i = pipes.length - 1; i >= 0; i--) {
        let pipe = pipes[i];
        pipe.update();
        if (pipe.isPassed && !pipe.isPassedCounted){
            score.incrementBy(1);
            pipe.isPassedCounted = true;
        }
        if (pipe.isOff()) {
            pipes.splice(i, 1);
        }
    }
}

function Drag(){
    this.img_count = 0;
    this.SCALE = 1.1;
    this.hasJumped = false;
    
    this.y = WIN_HEIGHT/2;
    this.x = WIN_WIDTH/3;
    this.tilt = -5;
    
    this.tick_count = 0;
    this.gravity = 0.099;
    this.velocity = 0;
    this.FLAP_INTERVAL = 2;

    this.jump_height = this.y + 8;

    this.show = (i) => {
        imageMode(CENTER);
        image(
            DRAG_IMG[i], 
            0,
            0,
            this.SCALE * DRAG_IMG[i].width,
            this.SCALE * DRAG_IMG[i].height
        );
    };

    this.update = () => {
        let displacement = 0;
        if (this.hasJumped) {
            displacement = this.getDisplacement();
            this.y -= displacement;
            this.updateTiltBasedOnDisplacement(displacement);
        }

        this.updateImgCount();

        if (this.y + (this.SCALE * DRAG_IMG[0].height) / 2 > height - GROUND_HEIGHT) {
            ENDGAME();
            return;
        }


        if (this.y < -30){
            this.y = -30;
            displacement = 0;
        }
        
        push();
        translate(this.x, this.y);
        rotate(radians(this.tilt));
        this.updateImage();
        pop();
        if (hitboxes){
            push();
            noFill();
            stroke('red');
            const shrinkFactor = 0.85;
            rectMode(CENTER);
            rect(this.x, this.y, DRAG_IMG[0].width * this.SCALE * shrinkFactor, DRAG_IMG[0].height * this.SCALE * shrinkFactor);
            pop();
        }
    };


    this.updateImage = () => {
        if (this.tilt > 80){
            this.show(1);
        }
        else {
            if (this.img_count <= this.FLAP_INTERVAL){
                this.show(0);
            }
            else if (this.img_count <= this.FLAP_INTERVAL * 2){
                this.show(1);
            }
            else if (this.img_count <= this.FLAP_INTERVAL * 3){
                this.show(2);
            }
            else if (this.img_count <= this.FLAP_INTERVAL * 4){
                this.show(1);
            }
        }
    };
    this.updateImgCount = () => {
        this.img_count += 1;
        if (this.img_count > this.FLAP_INTERVAL * 4){
            this.img_count = 0;
        }
    };

    this.jump = () => {
        this.velocity = 2;
        this.tick_count = 0;
        this.jump_height = this.y;
        this.hasJumped = true;
        this.tilt = -25;
    };

    this.getDisplacement = () => {
        this.tick_count += 1;
        let displacement = this.velocity - 0.4 * this.gravity * this.tick_count ** 2;
        this.velocity -= this.gravity * this.tick_count;
        
        if (this.velocity < 0){
            this.velocity = 0;
        }
        if (displacement >= 5){
            displacement = 5;
        }
        if (displacement > 0){
            displacement += 10;
        }
        return displacement;
    };
    this.updateTiltBasedOnDisplacement = (displacement) => {
        if (!this.hasJumped) return; 

        if (displacement < 0) {
            if (this.tilt < 90) {
                this.tilt += 2;
            }
            if (this.tilt > 90) {
                this.tilt = 90;
            }
        }
    }
};
function keyPressed(){
    if (key === " " && minigameOPEN){
        drag.jump();
    }
    if (key === " " && minigameOPEN && !gameStarted){
        gameStarted = true;
        hideIntroTexts();
    }
    if (key === "h" && minigameOPEN){
        hitboxes = !hitboxes;
    }
}
function mouseClicked(){
    if (minigameOPEN)
        drag.jump();
    if (minigameOPEN && !gameStarted){
        gameStarted = true;
        hideIntroTexts();
    }
}
function ENDGAME() {
    score.reset();
    pipes = [];
    health--;
    drag.y = WIN_HEIGHT / 2;
    drag.x = WIN_WIDTH / 3;
    drag.tilt = -5;
    drag.velocity = 0;
    drag.tick_count = 0;
    drag.hasJumped = false;
    drag.img_count = 0;

    ground.x1 = 0;
    ground.x2 = WIN_WIDTH;

    gameStarted = false;
    showIntroTexts();

    if (health == 0){
        if (window._canvasInstance) {
            window._canvasInstance.remove();
            window._canvasInstance = null;
        }
        document.getElementById('intro').style.display = 'block';
        document.getElementById('minigames').style.display = 'none';
        document.getElementById('back').style.display = 'none';
        document.getElementById("background").style.display = 'block';
    }
}

function Score(currentScore = 0){
    this.currentScore = currentScore;

    this.show = () => {
        textSize(32);
        textAlign(CENTER, TOP);

        const x = width / 2;
        const y = 20;

        fill(0, 0, 0, 150);
        text(this.currentScore.toString(), x + 2, y + 2);

        fill(255, 255, 255);
        text(this.currentScore.toString(), x, y);
    };
    this.incrementBy = (amount) => {
        this.currentScore += amount;
    };
    this.reset = () => {
        this.currentScore = 0;
    };
}
function showHearts() {
    const HEART_SIZE = 24;
    const PADDING = 8;
    for (let i = 0; i < health; i++) {
        image(HEART_IMG, PADDING + i * (HEART_SIZE + PADDING), PADDING, HEART_SIZE, HEART_SIZE);
    }
}
function showIntroTexts() {
  document.getElementById("game-title").style.display = "block";
  document.getElementById("press-start").style.display = "block";
}

function hideIntroTexts() {
  document.getElementById("game-title").style.display = "none";
  document.getElementById("press-start").style.display = "none";
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pauseAnimation(); 
  } else {
    resumeAnimation(); 
  }
});