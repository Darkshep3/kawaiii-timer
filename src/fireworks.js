const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d', { alpha: true });

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let ghostParticles = [];

function startFlare() {
  const x = Math.random() * (canvas.width - 30) + 30;
  const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
  fireworks.push(new Firework(x, canvas.height - 50, color));
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = {
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 8
    };
    this.alpha = 1;
    this.friction = 0.99;

    this.ghostCooldown = 0;
    this.ghostSpawnInterval = 5;
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  update() {
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
    this.velocity.y += 0.03;
    if (this.alpha < 0) this.alpha = 0;

    if (this.ghostCooldown > 0) {
      this.ghostCooldown--;
    }

    if (this.alpha > 0.05 && this.ghostCooldown === 0) {
      ghostParticles.push(new GhostParticle(this.x, this.y, this.color, this.alpha * 0.7));
      this.ghostCooldown = this.ghostSpawnInterval;
    }
  }
}

class GhostParticle {
  constructor(x, y, color, alpha = 0.7) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.alpha = alpha;
    this.radius = 2;
    this.fadeSpeed = 0.03;
  }

  update() {
    this.alpha -= this.fadeSpeed;
    if (this.alpha < 0) this.alpha = 0;
  }

  draw() {
    if (this.alpha <= 0) return;
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
}

class Firework {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = { x: 0, y: Math.random() * -2.5 - 0.77 };
    this.particles = [];
    this.lifespan = 180;
    this.hasExploded = false;

    this.ghostCooldown = 0;
    this.ghostSpawnInterval = 5;
  }

  draw() {
    if (this.hasExploded) return;

    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  explode() {
    for (let i = 0; i < 50; i++) {
      this.particles.push(new Particle(this.x, this.y, this.color));
    }
  }

  update() {
    this.lifespan--;

    if (this.lifespan <= 0 && !this.hasExploded) {
      this.explode();
      this.velocity = { x: 0, y: 0 };
      this.hasExploded = true;
    } else if (this.lifespan > 0) {
      this.y += this.velocity.y;

      if (this.ghostCooldown > 0) {
        this.ghostCooldown--;
      }
      if (this.ghostCooldown === 0) {
        ghostParticles.push(new GhostParticle(this.x, this.y, this.color, 0.6));
        this.ghostCooldown = this.ghostSpawnInterval;
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update();
      p.draw();
      if (p.alpha <= 0) this.particles.splice(i, 1);
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((firework, index) => {
    firework.update();
    firework.draw();

    if (firework.lifespan <= 0 && firework.particles.length === 0) {
      fireworks.splice(index, 1);
    }
  });

  ghostParticles.forEach((ghost, i) => {
    ghost.update();
    ghost.draw();
    if (ghost.alpha <= 0) ghostParticles.splice(i, 1);
  });
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

animate();
