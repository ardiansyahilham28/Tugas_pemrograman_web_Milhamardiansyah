const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, ShadingType
} = require('docx');
const fs = require('fs');

const codeFont = { name: 'Consolas', size: 18 };
const normalFont = { name: 'Calibri', size: 22 };
const titleFont = { name: 'Calibri', size: 32, bold: true, color: '1B2735' };
const headingFont = { name: 'Calibri', size: 26, bold: true, color: '0288D1' };

function title(text) {
  return new Paragraph({
    children: [new TextRun({ text, ...titleFont })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  });
}

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    children: [new TextRun({ text, ...headingFont })],
    heading: level,
    spacing: { before: 300, after: 150 },
  });
}

function para(text) {
  return new Paragraph({
    children: [new TextRun({ text, ...normalFont })],
    spacing: { after: 100 },
  });
}

function boldPara(label, text) {
  return new Paragraph({
    children: [
      new TextRun({ text: label, bold: true, ...normalFont }),
      new TextRun({ text, ...normalFont }),
    ],
    spacing: { after: 100 },
  });
}

function bulletItem(text) {
  return new Paragraph({
    children: [new TextRun({ text: `\u2022 ${text}`, ...normalFont })],
    spacing: { after: 60 },
    indent: { left: 720 },
  });
}

function codeBlock(code) {
  const lines = code.split('\n');
  return lines.map((line) =>
    new Paragraph({
      children: [new TextRun({ text: line || ' ', ...codeFont })],
      spacing: { after: 0, line: 260 },
      shading: { type: ShadingType.CLEAR, fill: 'F5F5F5' },
    })
  );
}

function separator() {
  return new Paragraph({
    children: [new TextRun({ text: '' })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
    spacing: { after: 200 },
  });
}

const sections = [
  {
    title: '1. Class GameObject (Base Class)',
    explanation: [
      para('GameObject adalah class dasar yang menjadi induk dari semua objek dalam game. Class ini mengelola posisi, ukuran, elemen DOM, dan status aktif setiap objek.'),
      heading('Properties:', HeadingLevel.HEADING_2),
      bulletItem('x, y - Posisi objek di area game'),
      bulletItem('width, height - Ukuran objek untuk collision detection'),
      bulletItem('element - Elemen DOM yang direpresentasikan oleh objek'),
      bulletItem('active - Status apakah objek masih aktif dalam game'),
      heading('Method:', HeadingLevel.HEADING_2),
      boldPara('createElement(className) ', '- Membuat elemen div baru dengan class tertentu, menambahkannya ke DOM, dan mengatur posisi awal.'),
      boldPara('updatePosition() ', '- Memperbarui posisi elemen DOM berdasarkan nilai x dan y.'),
      boldPara('remove() ', '- Menandai objek sebagai tidak aktif dan menghapus elemen DOM dari parent node.'),
      boldPara('collidesWith(other) ', '- Mendeteksi tabrakan antara dua objek menggunakan axis-aligned bounding box (AABB). Mengembalikan true jika kedua objek saling overlap.'),
    ],
    code: `class GameObject {
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
}`,
  },
  {
    title: '2. Class Player',
    explanation: [
      para('Player mewakili pesawat pemain yang dikendalikan oleh user. Mewarisi semua fitur dari GameObject dan menambahkan kemampuan bergerak serta menembak.'),
      heading('Constructor:', HeadingLevel.HEADING_2),
      bulletItem('Ditempatkan di tengah bawah area game (y = areaHeight - 60)'),
      bulletItem('Ukuran 50x50 px, speed 2px per frame'),
      bulletItem('shootCooldown untuk membatasi kecepatan tembakan (15 frame antar tembakan)'),
      heading('Method:', HeadingLevel.HEADING_2),
      boldPara('moveLeft() ', '- Bergerak ke kiri dengan batas tepi kiri area game. Menggunakan Math.max untuk mencegah keluar area.'),
      boldPara('moveRight() ', '- Bergerak ke kanan dengan batas tepi kanan area game. Menggunakan Math.min untuk mencegah keluar area.'),
      boldPara('shoot(bullets) ', '- Membuat objek Bullet baru di atas pesawat pemain dengan kecepatan -8 (ke atas). Menerapkan cooldown 15 frame.'),
      boldPara('update() ', '- Mengurangi shootCooldown setiap frame sampai kembali ke 0.'),
    ],
    code: `class Player extends GameObject {
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
    this.x = Math.min(
      this.gameAreaWidth - this.width / 2,
      this.x + this.speed
    );
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
}`,
  },
  {
    title: '3. Class Enemy',
    explanation: [
      para('Enemy mewakili pesawat musuh yang muncul dari atas layar dan bergerak ke bawah. Memiliki dua tipe: normal (merah) dan fast (orange).'),
      heading('Constructor:', HeadingLevel.HEADING_2),
      bulletItem('Spawn di posisi x acak, y = -30 (di luar layar atas)'),
      bulletItem('Ukuran 40x40 px'),
      bulletItem('shootTimer diacak 50-150 frame sebelum bisa menembak pertama kali'),
      heading('Tipe Enemy:', HeadingLevel.HEADING_2),
      bulletItem('normal - Kecepatan 1 + level * 0.2, skor 10'),
      bulletItem('fast - Kecepatan 2 + level * 0.3, skor 20. Muncul dengan probabilitas 20% + 5% per level'),
      heading('Method:', HeadingLevel.HEADING_2),
      boldPara('createElement() ', '- Membuat elemen dengan class enemy. Jika tipe fast, menambahkan class "fast" untuk styling orange.'),
      boldPara('update(bullets) ', '- Enemy bergerak ke bawah sesuai speed. shootTimer dikurangi tiap frame. Saat timer habis dan posisi y > 50, menembak peluru ke bawah (kecepatan +4) lalu timer di-reset acak 80-200 frame.'),
    ],
    code: `class Enemy extends GameObject {
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
}`,
  },
  {
    title: '4. Class Bullet',
    explanation: [
      para('Bullet merepresentasikan peluru yang ditembakkan oleh player atau enemy. Peluru bergerak lurus vertikal dan dihapus saat keluar area game.'),
      heading('Constructor:', HeadingLevel.HEADING_2),
      bulletItem('Ukuran 4x14 px (kecil dan panjang)'),
      bulletItem('speed - Negatif = ke atas (peluru player), Positif = ke bawah (peluru enemy)'),
      bulletItem('owner - "player" atau "enemy" untuk membedakan peluru siapa'),
      heading('Method:', HeadingLevel.HEADING_2),
      boldPara('createElement() ', '- Membuat elemen dengan class "bullet" dan class owner (player-bullet atau enemy-bullet) untuk styling warna berbeda.'),
      boldPara('update() ', '- Memperbarui posisi y berdasarkan speed. Peluru player (speed -8) bergerak ke atas, peluru enemy (speed +4) bergerak ke bawah.'),
    ],
    code: `class Bullet extends GameObject {
  constructor(x, y, speed, owner) {
    super(x, y, 4, 14);
    this.speed = speed;
    this.owner = owner;
  }

  createElement() {
    const className = 'bullet ' +
      (this.owner === 'player' ? 'player-bullet' : 'enemy-bullet');
    return super.createElement(className);
  }

  update() {
    this.y += this.speed;
    this.updatePosition();
  }
}`,
  },
  {
    title: '5. Class SpaceShooter (Main Controller)',
    explanation: [
      para('SpaceShooter adalah class utama yang mengontrol seluruh alur permainan. Mengelola input keyboard, game loop, spawning musuh, deteksi tabrakan, scoring, level up, dan game over.'),
      heading('Constructor:', HeadingLevel.HEADING_2),
      bulletItem('Mengambil referensi elemen DOM: gameArea, overlay, startBtn, score, lives, level'),
      bulletItem('Menyimpan dimensi area game (areaWidth, areaHeight)'),
      bulletItem('Inisialisasi state: score=0, lives=3, level=1, running=false'),
      bulletItem('spawnInterval = 90 (frame antar spawn musuh)'),
      bulletItem('Mendaftarkan event listener: klik tombol start, keydown, keyup'),
      heading('Input Handling:', HeadingLevel.HEADING_2),
      boldPara('handleKeyDown(e) ', '- Menyimpan status key pressed. Spasi memicu tembakan player. preventDefault pada spasi agar halaman tidak scroll.'),
      boldPara('handleKeyUp(e) ', '- Menandai key dilepas.'),
      heading('Game Flow:', HeadingLevel.HEADING_2),
      boldPara('start() ', '- Reset semua state, buat player baru, sembunyikan overlay, mulai gameLoop.'),
      boldPara('clearAll() ', '- Hapus semua musuh, peluru, dan player dari DOM dan array. Cancel animation frame sebelumnya.'),
      boldPara('updateHUD() ', '- Memperbarui tampilan skor, nyawa, dan level di HUD.'),
      heading('Spawning & Effects:', HeadingLevel.HEADING_2),
      boldPara('spawnEnemy() ', '- Membuat musuh di posisi x acak. Probabilitas tipe fast naik 5% per level. Kecepatan musuh naik per level.'),
      boldPara('createExplosion(x, y) ', '- Membuat efek ledakan (div dengan animasi CSS) lalu dihapus setelah 400ms.'),
      heading('Collision Detection:', HeadingLevel.HEADING_2),
      boldPara('checkCollisions() ', '- Loop semua peluru aktif:'),
      bulletItem('Peluru player vs musuh -> hapus keduanya, tambah skor, buat explosion, cek level up'),
      bulletItem('Peluru enemy vs player -> hapus peluru, kurangi nyawa, buat explosion, cek game over'),
      bulletItem('Musuh vs player langsung -> hapus musuh, kurangi nyawa, buat explosion, cek game over'),
      heading('Level System:', HeadingLevel.HEADING_2),
      boldPara('checkLevelUp() ', '- Level = floor(skor / 100) + 1. Spawn interval berkurang 8 per level (minimum 40).'),
      heading('Game Loop:', HeadingLevel.HEADING_2),
      boldPara('gameLoop() ', '- Dipanggil setiap frame via requestAnimationFrame:'),
      bulletItem('Baca input keyboard (ArrowLeft/ArrowRight atau A/D) untuk gerak player'),
      bulletItem('Update player (cooldown tembakan)'),
      bulletItem('Spawn musuh berdasarkan spawnTimer dan spawnInterval'),
      bulletItem('Update semua musuh, hapus yang sudah keluar layar bawah'),
      bulletItem('Update semua peluru, hapus yang sudah keluar area'),
      bulletItem('Tambahkan elemen DOM peluru baru yang belum dirender'),
      bulletItem('Jalankan checkCollisions()'),
      bulletItem('Panggil gameLoop() lagi via requestAnimationFrame'),
      boldPara('gameOver() ', '- Hentikan game, tampilkan overlay "Game Over" dengan skor akhir, ubah tombol jadi "Main Lagi".'),
    ],
    code: `class SpaceShooter {
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
    const speed = isFast
      ? 2 + this.level * 0.3
      : 1 + this.level * 0.2;
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

      if (bullet.owner === 'enemy' && bullet.active
          && bullet.collidesWith(this.player)) {
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
    this.overlay.querySelector('p').textContent =
      'Skor akhir: ' + this.score;
    this.startBtn.textContent = 'Main Lagi';
  }

  gameLoop() {
    if (!this.running) return;

    if (this.keys['ArrowLeft'] || this.keys['KeyA'])
      this.player.moveLeft();
    if (this.keys['ArrowRight'] || this.keys['KeyD'])
      this.player.moveRight();

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

new SpaceShooter();`,
  },
];

async function main() {
  const children = [];

  // Title page
  children.push(
    new Paragraph({ children: [], spacing: { after: 600 } }),
    title('PENJELASAN SCRIPT.JS'),
    new Paragraph({
      children: [new TextRun({ text: 'Space Shooter Game', font: 'Calibri', size: 26, color: '0288D1' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Pemrograman Web 1 - Pertemuan 17', font: 'Calibri', size: 22, color: '666666' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    separator()
  );

  // Intro
  children.push(
    heading('Tentang Game'),
    para('Space Shooter adalah game bergenre shoot-em-up sederhana yang dibangun menggunakan vanilla JavaScript, HTML, dan CSS. Pemain mengendalikan pesawat di bagian bawah layar, bergerak ke kiri/kanan, dan menembak musuh yang muncul dari atas layar.'),
    heading('Arsitektur Kode'),
    para('Script menggunakan pendekatan Object-Oriented Programming (OOP) dengan 4 class yang mewarisi dari class dasar GameObject, dan 1 class controller utama SpaceShooter.'),
    heading('Alur Permainan', HeadingLevel.HEADING_2),
    bulletItem('Pemain menekan tombol "Mulai Game" untuk memulai'),
    bulletItem('Player muncul di tengah bawah layar'),
    bulletItem('Musuh spawn secara berkala dari atas layar'),
    bulletItem('Pemain gerak dengan Arrow Keys / A,D dan tembak dengan Spasi'),
    bulletItem('Skor bertambah saat musuh berhasil ditembak (normal: 10, fast: 20)'),
    bulletItem('Level naik setiap 100 skor, musuh makin cepat dan sering spawn'),
    bulletItem('Nyawa berkurang saat peluru enemy mengenai player atau musuh menabrak player'),
    bulletItem('Game berakhir saat nyawa = 0'),
    separator()
  );

  // Sections
  for (const section of sections) {
    children.push(heading(section.title));
    for (const item of section.explanation) {
      children.push(item);
    }
    children.push(new Paragraph({ children: [], spacing: { after: 100 } }));
    children.push(boldPara('Kode: ', ''));
    children.push(...codeBlock(section.code));
    children.push(separator());
  }

  // Closing
  children.push(
    heading('Kesimpulan'),
    para('Script ini mendemonstrasikan penerapan konsep OOP dalam JavaScript menggunakan class, inheritance (extends), constructor chaining (super), encapsulation, dan polymorphism. Game loop menggunakan requestAnimationFrame untuk animasi smooth 60fps. Collision detection menggunakan metode AABB (Axis-Aligned Bounding Box).'),
    para('Seluruh game berjalan murni client-side tanpa backend, menggunakan manipulasi DOM langsung untuk rendering dan animasi.'),
  );

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1000, bottom: 1000, left: 1200, right: 1200 },
        },
      },
      children,
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('Penjelasan_Script_SpaceShooter.docx', buffer);
  console.log('Done: Penjelasan_Script_SpaceShooter.docx');
}

main().catch(console.error);
