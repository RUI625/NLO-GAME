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

const villainImg4 = new Image();
villainImg4.src = 'villain4.png';

const powerUpImg = new Image();
powerUpImg.src = 'powerup.png';

const gameOverImg = new Image();
gameOverImg.src = 'gameover.png';

const timeExtendImg = new Image();
timeExtendImg.src = 'timeextend.png';

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
let powerUps = [];
let gameOverItems = [];
let timeExtendItems = [];
let villainSpeed = 2;
let score = 0;
let timeLeft = 20; // 20秒のタイマー
let powerUpActive = false;
let powerUpDuration = 10; // パワーアップの持続時間
let shotsFired = 0;
let powerUpHits = 0;
let timeExtended = false;
let timeExtendItemCreated = false;
let timeExtendHits = 0;
let gameOver = false;

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
        } else if (villain.type === 4) {
            ctx.drawImage(villainImg4, villain.x, villain.y, villain.width, villain.height);
        }
        villain.y += villainSpeed;

        if (villain.y > canvas.height) {
            villains.splice(index, 1);
        }
    });
}

function drawPowerUps() {
    powerUps.forEach((powerUp, index) => {
        ctx.drawImage(powerUpImg, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        powerUp.y += villainSpeed;

        if (powerUp.y > canvas.height) {
            powerUps.splice(index, 1);
        }
    });
}

function drawGameOverItems() {
    gameOverItems.forEach((item, index) => {
        ctx.drawImage(gameOverImg, item.x, item.y, item.width, item.height);
        item.y += villainSpeed;

        if (item.y > canvas.height) {
            gameOverItems.splice(index, 1);
        }
    });
}

function drawTimeExtendItems() {
    timeExtendItems.forEach((item, index) => {
        ctx.drawImage(timeExtendImg, item.x, item.y, item.width, item.height);
        item.y += villainSpeed;

        if (item.y > canvas.height) {
            timeExtendItems.splice(index, 1);
        }
    });
}

function createVillain() {
    const x = Math.random() * (canvas.width - 50);
    const type = Math.floor(Math.random() * 3) + 1;
    let width, height;

    if (type === 1) {
        width = 50;
        height = 50;
    } else if (type === 2) {
        width = 55;
        height = 55;
    } else if (type === 3) {
        width = 65;
        height = 65;
    }

    villains.push({ x: x, y: 0, width: width, height: height, type: type, hits: type });
}

function createPowerUp() {
    const x = Math.random() * (canvas.width - 50);
    powerUps.push({ x: x, y: 0, width: 50, height: 50 });
}

function createGameOverItem() {
    const x = Math.random() * (canvas.width - 50);
    gameOverItems.push({ x: x, y: 0, width: 50, height: 50 });
}

function createTimeExtendItem() {
    if (!timeExtendItemCreated) {
        const x = Math.random() * (canvas.width - 50);
        timeExtendItems.push({ x: x, y: 0, width: 50, height: 50 });
        timeExtendItemCreated = true;
    }
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
                villain.hits -= powerUpActive ? 2 : 1;
                carrots.splice(carrotIndex, 1);
                if (villain.hits <= 0) {
                    if (villain.type === 1) {
                        score += 10;
                    } else if (villain.type === 2) {
                        score += 20;
                    } else if (villain.type === 3) {
                        score += 50;
                    } else if (villain.type === 4) {
                        score += 100;
                    }
                    villains.splice(villainIndex, 1);
                }
            }
        });

        powerUps.forEach((powerUp, powerUpIndex) => {
            if (
                carrot.x < powerUp.x + powerUp.width &&
                carrot.x + carrot.width > powerUp.x &&
                carrot.y < powerUp.y + powerUp.height &&
                carrot.y + carrot.height > powerUp.y
            ) {
                powerUpHits++;
                carrots.splice(carrotIndex, 1);
                if (powerUpHits >= 5) {
                    powerUps.splice(powerUpIndex, 1);
                    powerUpActive = true;
                    setTimeout(() => {
                        powerUpActive = false;
                    }, powerUpDuration * 1000);
                }
            }
        });

        gameOverItems.forEach((item, itemIndex) => {
            if (
                carrot.x < item.x + item.width &&
                carrot.x + carrot.width > item.x &&
                carrot.y < item.y + item.height &&
                carrot.y + carrot.height > item.y
            ) {
                gameOver = true;
            }
        });
    });

    gameOverItems.forEach((item, itemIndex) => {
        if (
            rabbit.x < item.x + item.width &&
            rabbit.x + rabbit.width > item.x &&
            rabbit.y < item.y + item.height &&
            rabbit.y + rabbit.height > item.y
        ) {
            gameOver = true;
        }
    });

    timeExtendItems.forEach((item, itemIndex) => {
        if (
            rabbit.x < item.x + item.width &&
            rabbit.x + rabbit.width > item.x &&
            rabbit.y < item.y + item.height &&
            rabbit.y + rabbit.height > item.y
        ) {
            timeExtendHits++;
            carrots.splice(itemIndex, 1);
            if (timeExtendHits >= 3) {
                timeExtendItems.splice(itemIndex, 1);
                timeLeft += 10;
                timeExtended = true;
                setTimeout(() => {
                    timeExtended = false;
                }, 1000);
                setTimeout(createVillain4, 1000);
            }
        }
    });
}

function createVillain4() {
    const x = Math.random() * (canvas.width - 50);
    villains.push({ x: x, y: 0, width: 65, height: 65, type: 4, hits: 10 });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

function drawTime() {
    ctx.fillStyle = timeExtended ? 'red' : 'black';
    ctx.font = timeExtended ? 'bold 20px Arial' : '20px Arial';
    ctx.fillText('Time: ' + timeLeft, 10, 50);
}

function drawGameOver() {
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = 'bold 50px Arial';
        ctx.fillText('GAME OVER', canvas.width / 2 - 150, canvas.height / 2);
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRabbit();
    drawCarrots();
    drawVillains();
    drawPowerUps();
    drawGameOverItems();
    drawTimeExtendItems();
    moveRabbit();
    detectCollisions();
    drawScore();
    drawTime();
    drawGameOver();

    if (timeLeft > 0 && !gameOver) {
        requestAnimationFrame(update);
    } else if (timeLeft <= 0) {
        gameOver = true;
    }
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        rabbit.dx = rabbit.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        rabbit.dx = -rabbit.speed;
    } else if (e.key === ' ') {
        carrots.push({ x: rabbit.x + rabbit.width / 2 - 15, y: rabbit.y, width: 30, height: 30, speed: 7 });
        shotsFired++;
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

function touchStart(e) {
    const touchX = e.touches[0].clientX;
    if (touchX > rabbit.x + rabbit.width / 2) {
        rabbit.dx = rabbit.speed;
    } else {
        rabbit.dx = -rabbit.speed;
    }
}

function touchEnd(e) {
    rabbit.dx = 0;
}

window.onload = function() {
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    canvas.addEventListener('touchstart', touchStart);
    canvas.addEventListener('touchend', touchEnd);

    setInterval(createVillain, 1000);
    setInterval(createGameOverItem, 3000); // 3秒ごとに即時ゲームオーバーアイテムを生成
    setTimeout(createPowerUp, 10000); // 10秒後にパワーアップアイテムを生成
    setTimeout(createTimeExtendItem, 13000); // 13秒後に時間延長アイテムを生成
    setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
        }
    }, 1000);
    update();
};