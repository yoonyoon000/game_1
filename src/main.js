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

//드래그하는거
const game = document.getElementById("game");
let dragging = false;
let last = { x: 0, y: 0 };

function clampPlayer() {
    playerPos.x = Math.max(0, Math.min(780, playerPos.x));
    playerPos.y = Math.max(0, Math.min(280, playerPos.y));
    mirrorPos.x = Math.max(0, Math.min(780, mirrorPos.x));
    mirrorPos.y = Math.max(300, Math.min(580, mirrorPos.y));
}

function setPositions() {
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
}

player.addEventListener("pointerdown", (e) => {
    if (gameOver || gameClear) return;
    dragging = true;
    last.x = e.clientX;
    last.y = e.clientY;
    player.setPointerCapture?.(e.pointerId);
    e.preventDefault();
});

player.addEventListener("pointermove", (e) => {
    if (!dragging || gameOver || gameClear) return;

    const dx = e.clientX - last.x;
    const dy = e.clientY - last.y;
    last.x = e.clientX;
    last.y = e.clientY;

    playerPos.x += dx;
    playerPos.y += dy;

    mirrorPos.x -= dx;
    mirrorPos.y -= dy;

    clampPlayer();
    setPositions();
});
//여기까지

//부딪혔을때
player.addEventListener("pointerup", () => {
    dragging = false;
});
player.addEventListener("pointercancel", () => {
    dragging = false;
});

function collision(a, b, sizeA, sizeBw, sizeBh) {
    return (
        a.x < b.x + sizeBw &&
        a.x + sizeA > b.x &&
        a.y < b.y + sizeBh &&
        a.y + sizeA > b.y
    );
}

function update() {
    if (gameOver || gameClear) return;

    for (let o of [realObs1, realObs2, mirrorObs1, mirrorObs2]) {
        if (collision(playerPos, o, 20, 40, 40) || collision(mirrorPos, o, 20, 40, 40)) {
            gameOver = true;
            statusText.innerHTML = 'GAME OVER<br><button id="retry">Retry</button>';
            document.getElementById("retry").onclick = () => location.reload();
            return;
        }
    }

    if (
        collision(playerPos, realGoalPos, 20, 25, 25) &&
        collision(mirrorPos, mirrorGoalPos, 20, 25, 25)
    ) {
        gameClear = true;
        statusText.innerHTML = 'LEVEL CLEAR!<br><button id="next">Next</button>';
        document.getElementById("next").onclick = () => (location.href = "level.html");
    }
}

function loop() {
    update();
    requestAnimationFrame(loop);
}

setPositions();
loop();
