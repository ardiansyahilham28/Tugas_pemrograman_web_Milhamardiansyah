class GameObject {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.element = null;
    this.active = true;
  }

  createElement(className) {
    this.element = document.createElement('div');
    this.element.className = className;
    this.updatePosition();
    return this.element;
  }

  updatePosition() {
    if (this.element) {
      this.element.style.left = this.x + 'px';
      this.element.style.top = this.y + 'px';
    }
  }

  remove() {
    this.active = false;
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  collidesWith(other) {
    return (
      this.x - this.width / 2 < other.x + other.width / 2 &&
      this.x + this.width / 2 > other.x - other.width / 2 &&
      this.y - this.height / 2 < other.y + other.height / 2 &&
      this.y + this.height / 2 > other.y - other.height / 2
    );
  }
}

class Player extends GameObject {
  constructor(gameAreaWidth, gameAreaHeight) {
    super(gameAreaWidth / 2, gameAreaHeight - 60, 50, 50);
    this.gameAreaWidth = gameAreaWidth;
    this.speed = 2;
    this.shootCooldown = 0;
  }

  createElement() {
    return super.createElement('player');
  }

  moveLeft() {
    this.x = Math.max(this.width / 2, this.x - this.speed);
    this.updatePosition();
  }

  moveRight() {
    this.x = Math.min(this.gameAreaWidth - this.width / 2, this.x + this.speed);
    this.updatePosition();
  }

  shoot(bullets) {
    if (this.shootCooldown > 0) return;
    bullets.push(new Bullet(this.x, this.y - 20, -8, 'player'));
    this.shootCooldown = 15;
  }

  update() {
    if (this.shootCooldown > 0) this.shootCooldown--;
  }
}

class Enemy extends GameObject {
  constructor(x, speed, type = 'normal') {
    super(x, -30, 40, 40);
    this.speed = speed;
    this.type = type;
    this.shootTimer = Math.random() * 100 + 50;
  }

  createElement() {
    const el = super.createElement('enemy');
    if (this.type === 'fast') el.classList.add('fast');
    return el;
  }

  update(bullets) {
    this.y += this.speed;
    this.updatePosition();

    this.shootTimer--;
    if (this.shootTimer <= 0 && this.y > 50) {
      bullets.push(new Bullet(this.x, this.y + 20, 4, 'enemy'));
      this.shootTimer = Math.random() * 120 + 80;
    }
  }
}

class Bullet extends GameObject {
  constructor(x, y, speed, owner) {
    super(x, y, 4, 14);
    this.speed = speed;
    this.owner = owner;
  }

  createElement() {
    const className = 'bullet ' + (this.owner === 'player' ? 'player-bullet' : 'enemy-bullet');
    return super.createElement(className);
  }

  update() {
    this.y += this.speed;
    this.updatePosition();
  }
}

class SpaceShooter {
  constructor() {
    this.gameArea = document.getElementById('gameArea');
    this.overlay = document.getElementById('overlay');
    this.startBtn = document.getElementById('startBtn');
    this.scoreEl = document.getElementById('score');
    this.livesEl = document.getElementById('lives');
    this.levelEl = document.getElementById('level');

    this.areaWidth = this.gameArea.clientWidth;
    this.areaHeight = this.gameArea.clientHeight;

    this.player = null;
    this.enemies = [];
    this.bullets = [];
    this.keys = {};
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.running = false;
    this.frameId = null;
    this.spawnTimer = 0;
    this.spawnInterval = 90;

    this.startBtn.addEventListener('click', () => this.start());
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
  }

  handleKeyDown(e) {
    this.keys[e.code] = true;
    if (e.code === 'Space') e.preventDefault();
    if (e.code === 'Space' && this.running) {
      this.player.shoot(this.bullets);
    }
  }

  handleKeyUp(e) {
    this.keys[e.code] = false;
  }

  start() {
    this.clearAll();
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.spawnInterval = 90;
    this.running = true;

    this.updateHUD();
    this.overlay.classList.add('hidden');

    this.player = new Player(this.areaWidth, this.areaHeight);
    this.gameArea.appendChild(this.player.createElement());

    this.gameLoop();
  }

  clearAll() {
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.enemies.forEach((e) => e.remove());
    this.bullets.forEach((b) => b.remove());
    if (this.player) this.player.remove();
    this.enemies = [];
    this.bullets = [];
    this.player = null;
  }

  updateHUD() {
    this.scoreEl.textContent = this.score;
    this.livesEl.textContent = this.lives;
    this.levelEl.textContent = this.level;
  }

  spawnEnemy() {
    const x = Math.random() * (this.areaWidth - 60) + 30;
    const isFast = Math.random() < 0.2 + this.level * 0.05;
    const speed = isFast ? 2 + this.level * 0.3 : 1 + this.level * 0.2;
    const enemy = new Enemy(x, speed, isFast ? 'fast' : 'normal');
    this.gameArea.appendChild(enemy.createElement());
    this.enemies.push(enemy);
  }

  createExplosion(x, y) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.left = x + 'px';
    explosion.style.top = y + 'px';
    this.gameArea.appendChild(explosion);
    setTimeout(() => explosion.remove(), 400);
  }

  checkCollisions() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      if (!bullet.active) continue;

      if (bullet.owner === 'player') {
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const enemy = this.enemies[j];
          if (enemy.active && bullet.collidesWith(enemy)) {
            this.createExplosion(enemy.x, enemy.y);
            bullet.remove();
            enemy.remove();
            this.bullets.splice(i, 1);
            this.enemies.splice(j, 1);
            this.score += enemy.type === 'fast' ? 20 : 10;
            this.updateHUD();
            this.checkLevelUp();
            break;
          }
        }
      }

      if (bullet.owner === 'enemy' && bullet.active && bullet.collidesWith(this.player)) {
        bullet.remove();
        this.bullets.splice(i, 1);
        this.lives--;
        this.updateHUD();
        this.createExplosion(this.player.x, this.player.y);
        if (this.lives <= 0) this.gameOver();
      }
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (enemy.active && enemy.collidesWith(this.player)) {
        enemy.remove();
        this.enemies.splice(i, 1);
        this.lives--;
        this.updateHUD();
        this.createExplosion(this.player.x, this.player.y);
        if (this.lives <= 0) this.gameOver();
      }
    }
  }

  checkLevelUp() {
    const newLevel = Math.floor(this.score / 100) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.spawnInterval = Math.max(40, 90 - this.level * 8);
      this.updateHUD();
    }
  }

  gameOver() {
    this.running = false;
    cancelAnimationFrame(this.frameId);
    this.clearAll();

    this.overlay.classList.remove('hidden');
    this.overlay.querySelector('h1').textContent = 'Game Over';
    this.overlay.querySelector('p').textContent = 'Skor akhir: ' + this.score;
    this.startBtn.textContent = 'Main Lagi';
  }

  gameLoop() {
    if (!this.running) return;

    if (this.keys['ArrowLeft'] || this.keys['KeyA']) this.player.moveLeft();
    if (this.keys['ArrowRight'] || this.keys['KeyD']) this.player.moveRight();

    this.player.update();

    this.spawnTimer++;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnEnemy();
      this.spawnTimer = 0;
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(this.bullets);
      if (enemy.y > this.areaHeight + 50) {
        enemy.remove();
        this.enemies.splice(i, 1);
      }
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.update();
      if (bullet.y < -20 || bullet.y > this.areaHeight + 20) {
        bullet.remove();
        this.bullets.splice(i, 1);
      } else if (bullet.active && !bullet.element) {
        this.gameArea.appendChild(bullet.createElement());
      }
    }

    this.checkCollisions();
    this.frameId = requestAnimationFrame(() => this.gameLoop());
  }
}

new SpaceShooter();
