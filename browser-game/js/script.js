import {
    ENEMY_X_GAP,
    ENEMY_Y_GAP,
    SHIP_WIDTH,
    SHIP_HEIGHT,
    ENEMY_SPEED,
    PLAYER_SPEED,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    BULLET_SPEED,
    SCORE_FOR_ENEMY,
} from "./variables.js";

function Ship(x, y, color) {
    const body = document.createElement("div");
    body.classList.add("ship");

    Object.assign(body.style, {
        width: `${SHIP_WIDTH}px`,
        height: `${SHIP_HEIGHT}px`,
        left: `${x}px`,
        top: `${y}px`,
        backgroundColor: color,
    });

    this.body = body;
    this.speed = ENEMY_SPEED;

    this.move = function (dx, dy) {
        this.body.style.left = `${
            parseFloat(getComputedStyle(this.body).left) + dx
        }px`;

        this.body.style.top = `${
            parseFloat(getComputedStyle(this.body).top) + dy
        }px`;
    };
}

function Player(x, y, color) {
    Ship.call(this, x, y, color);
    this.speed = PLAYER_SPEED;
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;

    this.moveLeft = function () {
        this.move(-this.speed, 0);
    };

    this.moveRight = function () {
        this.move(this.speed, 0);
    };

    this.changePlayerWidthAndPosition = function (relation) {
        this.width /= relation;
        const newLeft = parseFloat(getComputedStyle(this.body).left) / relation;

        this.body.style.width = `${this.width}px`;
        this.body.style.left = `${newLeft}px`;
    };

    this.shoot = function () {
        const x = parseFloat(getComputedStyle(this.body).left);
        const y = parseFloat(getComputedStyle(this.body).top);
        const bullet = new Bullet(
            x + this.width / 2 - 7.5,
            y - this.height * 1.1,
        );

        const pulletInterlval = setInterval(() => {
            bullet.move();
        }, 17);

        return bullet;
    };
}
Player.prototype = Object.create(Ship.prototype);
Player.prototype.constructor = Player;

function Bullet(x, y) {
    const body = document.createElement("div");

    Object.assign(body.style, {
        width: `15px`,
        height: `15px`,
        left: `${x}px`,
        top: `${y}px`,
        backgroundColor: `white`,
        position: `absolute`,
    });

    this.body = body;
    this.speed = BULLET_SPEED;
    this.move = function () {
        this.body.style.top = `${
            parseFloat(getComputedStyle(this.body).top) - BULLET_SPEED
        }px`;
    };
}

function EnemyController() {
    this.enemies = [];
    this.enemyWidth = SHIP_WIDTH;
    this.enemyXGap = ENEMY_X_GAP;
    this.speedLevel = +document.querySelector("#speed").value;

    this.createEnemies = function (...countOfEnemies) {
        for (let i = 0; i < countOfEnemies.length; i++) {
            const lineOfEnemies = [];
            for (let j = 0; j < countOfEnemies[i]; j++) {
                const enemy = new Ship(
                    j * (this.enemyXGap + this.enemyWidth) + this.enemyXGap,
                    i * (ENEMY_Y_GAP + SHIP_HEIGHT) + ENEMY_Y_GAP,
                    "yellow",
                );
                enemy.rowIndex = i;
                enemy.columnIndex = j;
                lineOfEnemies.push(enemy);
            }
            this.enemies.push(lineOfEnemies);
        }
    };

    this[Symbol.iterator] = function () {
        const elements = this.enemies.flat();
        return {
            currentIndex: 0,
            next() {
                if (this.currentIndex < elements.length) {
                    return {
                        done: false,
                        value: elements[this.currentIndex++],
                    };
                } else {
                    return { done: true };
                }
            },
        };
    };

    this.changeEnemyWidth = function (relation) {
        this.enemyXGap = this.enemyXGap / relation;
        this.enemyWidth = this.enemyWidth / relation;

        for (let row = 0; row < this.enemies.length; row++) {
            for (let column = 0; column < this.enemies[row].length; column++) {
                const enemy = this.enemies[row][column].body;
                enemy.style.width = `${this.enemyWidth}px`;
                enemy.style.left = `${column * (this.enemyXGap + this.enemyWidth) + this.enemyXGap}px`;
            }
        }
    };

    this.runEnemies = function (fieldHeight, playerHeight, intervalId) {
        for (const enemy of this) {
            const enemyStyle = getComputedStyle(enemy.body);
            const enemyTop = parseFloat(enemyStyle.top);
            const enemyHight = parseFloat(enemyStyle.height);

            if (
                enemyTop + enemyHight + enemy.speed * this.speedLevel >
                fieldHeight - playerHeight
            ) {
                clearInterval(intervalId);
                alert("GAME OVER");
                isGameOver = true;
                return;
            }
            enemy.move(0, enemy.speed * this.speedLevel);
        }
    };
}

function Renderer(gameField) {
    this.gameField = gameField;

    this.renderElement = function (element) {
        this.gameField.append(element);
    };
}

function Game() {
    this.enemyController = new EnemyController();
    this.renderer = new Renderer(
        document.getElementsByClassName("inner-game-field")[0],
    );
    this.width = this.renderer.gameField.clientWidth;
    this.height = this.renderer.gameField.clientHeight;
    this.player = new Player(this.width / 2, this.height - SHIP_HEIGHT);
    this.bullets = [];
    this.scoreTable = document.getElementById("score");
    this.speedSelect = document.querySelector("#speed");

    this.run = function () {
        const observer = new ResizeObserver(entries => {
            let relation = this.width / entries[0].contentRect.width;
            this.width = entries[0].contentRect.width;
            this.enemyController.changeEnemyWidth(relation);
            this.player.changePlayerWidthAndPosition(relation);
        });
        observer.observe(this.renderer.gameField);

        this.enemyController.createEnemies(20, 18, 16, 14);

        for (const enemy of this.enemyController) {
            this.renderer.renderElement(enemy.body);
        }

        const intervalId = setInterval(() => {
            this.enemyController.runEnemies(
                this.height,
                parseFloat(getComputedStyle(this.player.body).height),
                intervalId,
            );
        }, 17);

        this.renderer.renderElement(this.player.body);

        setInterval(() => {
            this.runCollisionSystem();
        }, 17);

        document.addEventListener("keydown", event => {
            const playerLeft = parseFloat(
                getComputedStyle(this.player.body).left,
            );
            const playerWidth = parseFloat(
                getComputedStyle(this.player.body).width,
            );

            if (
                event.key.toLowerCase() === "a" &&
                0 <= playerLeft - this.player.speed
            ) {
                this.player.moveLeft();
            }

            if (
                event.key.toLowerCase() === "d" &&
                playerLeft + playerWidth + this.player.speed <= this.width
            ) {
                this.player.moveRight();
            }

            if (event.code === "Space") {
                const bullet = this.player.shoot();
                this.renderer.renderElement(bullet.body);
                this.bullets.push(bullet);
            }
        });

        this.speedSelect.addEventListener("change", () => {
            this.enemyController.speedLevel = +this.speedSelect.value;
        });
    };

    this.runCollisionSystem = function () {
        for (
            let indexBullet = 0;
            indexBullet < this.bullets.length;
            indexBullet++
        ) {
            const bullet = this.bullets[indexBullet];
            const bulletHeight = parseFloat(
                getComputedStyle(bullet.body).height,
            );
            const bulletWidth = parseFloat(getComputedStyle(bullet.body).width);
            const bulletX = parseFloat(getComputedStyle(bullet.body).left);
            const bulletY = parseFloat(getComputedStyle(bullet.body).top);

            for (const enemy of this.enemyController) {
                const enemyHeight = parseFloat(
                    getComputedStyle(enemy.body).height,
                );
                const enemyWidth = parseFloat(
                    getComputedStyle(enemy.body).width,
                );
                const enemyX = parseFloat(getComputedStyle(enemy.body).left);
                const enemyY = parseFloat(getComputedStyle(enemy.body).top);

                const isHit =
                    bulletX < enemyX + enemyWidth &&
                    bulletX + bulletWidth > enemyX &&
                    bulletY < enemyY + enemyHeight &&
                    bulletY + bulletHeight > enemyY;

                if (isHit) {
                    this.bullets.splice(indexBullet, 1);
                    bullet.body.remove();
                    enemy.body.remove();
                    this.scoreTable.textContent =
                        Number(this.scoreTable.textContent) + 10;
                    return;
                }

                if (bulletY < 0) {
                    this.bullets.splice(indexBullet, 1);
                    bullet.body.remove();
                    return;
                }
            }
        }
    };
}

const startBtn = document.getElementsByClassName("start-btn")[0];
let isGameOver = true;

startBtn.addEventListener("click", event => {
    event.currentTarget.blur();
    if (isGameOver) {
        document
            .getElementsByClassName("inner-game-field")[0]
            .replaceChildren();
        isGameOver = !isGameOver;
        new Game().run();
    }
});
