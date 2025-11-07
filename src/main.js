const DESIGN_W = 800;
const DESIGN_H = 600;
let GAME_SCALE = 1;

function fitToScreen() {
    const s = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H);
    GAME_SCALE = s;
    const root = document.getElementById('gameRoot');
    if (root) root.style.transform = `scale(${s})`;
}
window.addEventListener('resize', fitToScreen);
fitToScreen();

document.addEventListener('touchmove', (e) => { e.preventDefault(); }, { passive: false });

const player = document.querySelector("#player");
const mirror = document.querySelector("#mirrorPlayer");
const realGoal = document.querySelector("#realGoal");
const mirrorGoal = document.querySelector("#mirrorGoal");
const statusText = document.querySelector("#status");

let gameOver = false;
let gameClear = false;

let playerPos = { x: 100, y: 200 };
let mirrorPos = { x: 675, y: 425 };

let realGoalPos = { x: 700, y: 200 };
let mirrorGoalPos = { x: 75, y: 425 };

function setPositions() {
    player.style.left = `${playerPos.x}px`;
    player.style.top = `${playerPos.y}px`;
    mirror.style.left = `${mirrorPos.x}px`;
    mirror.style.top = `${mirrorPos.y}px`;
    realGoal.style.left = `${realGoalPos.x}px`;
    realGoal.style.top = `${realGoalPos.y}px`;
    mirrorGoal.style.left = `${mirrorGoalPos.x}px`;
    mirrorGoal.style.top = `${mirrorGoalPos.y}px`;
}

function clamp() {
    playerPos.x = Math.max(0, Math.min(780, playerPos.x));
    playerPos.y = Math.max(0, Math.min(280, playerPos.y));
    mirrorPos.x = Math.max(0, Math.min(780, mirrorPos.x));
    mirrorPos.y = Math.max(300, Math.min(580, mirrorPos.y));
}

let dragging = false;
let last = { x: 0, y: 0 };

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

    const dx = (e.clientX - last.x) / GAME_SCALE;
    const dy = (e.clientY - last.y) / GAME_SCALE;
    last.x = e.clientX;
    last.y = e.clientY;

    playerPos.x += dx;
    playerPos.y += dy;
    mirrorPos.x -= dx;
    mirrorPos.y -= dy;

    clamp();
    setPositions();
});

const stopDrag = () => (dragging = false);
player.addEventListener("pointerup", stopDrag);
player.addEventListener("pointercancel", stopDrag);
player.addEventListener("pointerleave", stopDrag);

const obstacles = Array.from(document.querySelectorAll(".obstacle"));
const obstacleRects = obstacles.map(el => ({
    x: el.offsetLeft,
    y: el.offsetTop,
    w: el.offsetWidth,
    h: el.offsetHeight
}));

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

    for (const r of obstacleRects) {
        if (collision(playerPos, r, 20, r.w, r.h) || collision(mirrorPos, r, 20, r.w, r.h)) {
            gameOver = true;
            statusText.innerHTML = 'GAME OVER<br><button id="retry" class="gameBtn">Retry</button>';
            document.getElementById("retry").onclick = () => location.reload();
            return;
        }
    }

    if (
        collision(playerPos, realGoalPos, 20, 25, 25) &&
        collision(mirrorPos, mirrorGoalPos, 20, 25, 25)
    ) {
        gameClear = true;

        const currentPage = window.location.pathname.split("/").pop();

        if (currentPage === "level3.html") {
            statusText.innerHTML = `
      🎉 GAME COMPLETE! 🎉<br><br>
      <a href="start.html" class="gameBtn">Home</a>
    `;
        } else {
            statusText.innerHTML = `
      LEVEL CLEAR!<br>
      <button id="next" class="gameBtn">next</button>
    `;
            document.getElementById("next").onclick = () => (location.href = "start" + (parseInt(currentPage.match(/\d+/)) + 1) + ".html");
        }
    }

}

function loop() {
    update();
    requestAnimationFrame(loop);
}

setPositions();
loop();
