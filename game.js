const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const rabbitImg = new Image();
rabbitImg.src = 'rabbit.png';

const carrotImg = new Image();
carrotImg.src = 'carrot.png';

const villainImg1 = new Image();
villainImg1.src = 'villain1.png';

const villainImg2 = new Image();
villainImg2.src = 'villain2.png';

const villainImg3 = new Image();
villainImg3.src = 'villain3.png';

let rabbit = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0
};

let carrots = [];
let villains = [];
let villainSpeed = 2;
let score = 0;
let timeLeft = 20; // 20秒のタイマー

function drawRabbit() {
    ctx.drawImage(rabbitImg, rabbit.x, rabbit.y, rabbit.width, rabbit.height);
}

function drawCarrots() {
    carrots.forEach((carrot, index) => {
        ctx.drawImage(carrotImg, carrot.x, carrot.y, carrot.width, carrot.height);
        carrot.y -= carrot.speed;

        if (carrot.y < 0) {
            carrots.splice(index, 1);
        }
    });
}

function drawVillains() {
    villains.forEach((villain, index) => {
        if (villain.type === 1) {
            ctx.drawImage(villainImg1, villain.x, villain.y, villain.width, villain.height);
        } else if (villain.type === 2) {
            ctx.drawImage(villainImg2, villain.x, villain.y, villain.width, villain.height);
        } else if (villain.type === 3) {
            ctx.drawImage(villainImg3, villain.x, villain.y, villain.width, villain.height);
        }
        villain.y += villainSpeed;

        if (villain.y > canvas.height) {
            villains.splice(index, 1);
        }
    });
}

function createVillain() {
    const x = Math.random() * (canvas.width - 50);
    const type = Math.floor(Math.random() * 3) + 1;
    villains.push({ x: x, y: 0, width: 50, height: 50, type: type, hits: type });
}

function moveRabbit() {
    rabbit.x += rabbit.dx;

    if (rabbit.x < 0) {
        rabbit.x = 0;
    }

    if (rabbit.x + rabbit.width > canvas.width) {
        rabbit.x = canvas.width - rabbit.width;
    }
}

function detectCollisions() {
    carrots.forEach((carrot, carrotIndex) => {
        villains.forEach((villain, villainIndex) => {
            if (
                carrot.x < villain.x + villain.width &&
                carrot.x + carrot.width > villain.x &&
                carrot.y < villain.y + villain.height &&
                carrot.y + carrot.height > villain.y
            ) {
                villain.hits -= 1;
                carrots.splice(carrotIndex, 1);
                if (villain.hits <= 0) {
                    if (villain.type === 1) {
                        score += 10;
                    } else if (villain.type === 2) {
                        score += 20;
                    } else if (villain.type === 3) {
                        score += 30;
                    }
                    villains.splice(villainIndex, 1);
                }
            }
        });
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

function drawTime() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Time: ' + timeLeft, 10, 50);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRabbit();
    drawCarrots();
    drawVillains();
    moveRabbit();
    detectCollisions();
    drawScore();
    drawTime();

    if (timeLeft > 0) {
        requestAnimationFrame(update);
    } else {
        alert('Game Over! Your score: ' + score);
    }
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        rabbit.dx = rabbit.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        rabbit.dx = -rabbit.speed;
    } else if (e.key === ' ') {
        carrots.push({ x: rabbit.x + rabbit.width / 2 - 15, y: rabbit.y, width: 30, height: 30, speed: 7 });
    }
}

function keyUp(e) {
    if (
        e.key === 'ArrowRight' ||
        e.key === 'Right' ||
        e.key === 'ArrowLeft' ||
        e.key === 'Left'
    ) {
        rabbit.dx = 0;
    }
}

window.onload = function() {
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    setInterval(createVillain, 1000);
    setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
        }
    }, 1000);
    update();
};