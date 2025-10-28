const player = document.querySelector("#player");
const mirror = document.querySelector("#mirrorPlayer");
const realGoal = document.querySelector("#realGoal");
const mirrorGoal = document.querySelector("#mirrorGoal");
const obstacles = [
    document.querySelector("#realOb1"),
    document.querySelector("#realOb2"),
    document.querySelector("#mirrorOb1"),
    document.querySelector("#mirrorOb2"),
];
const statusText = document.querySelector("#status");

let keys = {};
let gameOver = false;
let gameClear = false;

let playerPos = { x: 100, y: 200 };
let mirrorPos = { x: 700, y: 400 };

let realGoalPos = { x: 700, y: 200 };
let mirrorGoalPos = { x: 100, y: 400 };

let realObs1 = { x: 400, y: 190 };
let realObs2 = { x: 500, y: 190 };
let mirrorObs1 = { x: 400, y: 370 };
let mirrorObs2 = { x: 500, y: 370 };

document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

const speed = 2;

function update() {
    if (gameOver || gameClear) return;

    if (keys["ArrowRight"]) {
        playerPos.x += speed;
        mirrorPos.x -= speed;
    }
    if (keys["ArrowLeft"]) {
        playerPos.x -= speed;
        mirrorPos.x += speed;
    }
    if (keys["ArrowUp"]) {
        playerPos.y -= speed;
        mirrorPos.y += speed;
    }
    if (keys["ArrowDown"]) {
        playerPos.y += speed;
        mirrorPos.y -= speed;
    }

    player.style.left = `${playerPos.x}px`;
    player.style.top = `${playerPos.y}px`;
    mirror.style.left = `${mirrorPos.x}px`;
    mirror.style.top = `${mirrorPos.y}px`;

    document.querySelector("#realOb1").style.left = `${realObs1.x}px`;
    document.querySelector("#realOb1").style.top = `${realObs1.y}px`;
    document.querySelector("#realOb2").style.left = `${realObs2.x}px`;
    document.querySelector("#realOb2").style.top = `${realObs2.y}px`;
    document.querySelector("#mirrorOb1").style.left = `${mirrorObs1.x}px`;
    document.querySelector("#mirrorOb1").style.top = `${mirrorObs1.y}px`;
    document.querySelector("#mirrorOb2").style.left = `${mirrorObs2.x}px`;
    document.querySelector("#mirrorOb2").style.top = `${mirrorObs2.y}px`;

    realGoal.style.left = `${realGoalPos.x}px`;
    realGoal.style.top = `${realGoalPos.y}px`;
    mirrorGoal.style.left = `${mirrorGoalPos.x}px`;
    mirrorGoal.style.top = `${mirrorGoalPos.y}px`;

    for (let o of [realObs1, realObs2, mirrorObs1, mirrorObs2]) {
        if (collision(playerPos, o, 20, 40, 40) || collision(mirrorPos, o, 20, 40, 40)) {
            gameOver = true;
            statusText.textContent = "GAME OVER";
            return;
        }
    }

    if (
        collision(playerPos, realGoalPos, 20, 25, 25) &&
        collision(mirrorPos, mirrorGoalPos, 20, 25, 25)
    ) {
        gameClear = true;
        statusText.textContent = "LEVEL CLEAR!";
    }
}

function collision(a, b, sizeA, sizeBw, sizeBh) {
    return (
        a.x < b.x + sizeBw &&
        a.x + sizeA > b.x &&
        a.y < b.y + sizeBh &&
        a.y + sizeA > b.y
    );
}

function loop() {
    update();
    requestAnimationFrame(loop);
}

loop();
