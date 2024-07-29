class Shape {
    constructor(x, y, velX, velY) {
      this.x = x;
      this.y = y;
      this.velX = velX;
      this.velY = velY;
    }
  }
  class Shape {
    constructor(x, y, velX, velY) {
      this.x = x;
      this.y = y;
      this.velX = velX;
      this.velY = velY;
    }
  }
  class Ball extends Shape {
    constructor(x, y, velX, velY, size, color) {
      super(x, y, velX, velY);
      this.size = size;
      this.color = color;
      this.exists = true; // New property to track if the ball is still in play
    }
  
    draw(ctx) {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
    }
  
    update() {
      if (this.x + this.size >= window.innerWidth || this.x - this.size <= 0) {
        this.velX = -this.velX;
      }
  
      if (this.y + this.size >= window.innerHeight || this.y - this.size <= 0) {
        this.velY = -this.velY;
      }
  
      this.x += this.velX;
      this.y += this.velY;
    }
  
    collisionDetect(balls) {
      for (const ball of balls) {
        if (!(this === ball) && ball.exists) {
          const dx = this.x - ball.x;
          const dy = this.y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
  
          if (distance < this.size + ball.size) {
            ball.color = this.color = randomRGB();
          }
        }
      }
    }
  }
  class EvilCircle extends Shape {
    constructor(x, y) {
      super(x, y, 20, 20);
      this.color = 'white';
      this.size = 10;
  
      window.addEventListener('keydown', (e) => {
        switch (e.key) {
          case 'a':
            this.x -= this.velX;
            break;
          case 'd':
            this.x += this.velX;
            break;
          case 'w':
            this.y -= this.velY;
            break;
          case 's':
            this.y += this.velY;
            break;
        }
      });
    }
  
    draw(ctx) {
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.stroke();
    }
  
    checkBounds() {
      if (this.x + this.size >= window.innerWidth) {
        this.x = window.innerWidth - this.size;
      } else if (this.x - this.size <= 0) {
        this.x = this.size;
      }
  
      if (this.y + this.size >= window.innerHeight) {
        this.y = window.innerHeight - this.size;
      } else if (this.y - this.size <= 0) {
        this.y = this.size;
      }
    }
  
    collisionDetect(balls) {
      for (const ball of balls) {
        if (ball.exists) {
          const dx = this.x - ball.x;
          const dy = this.y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
  
          if (distance < this.size + ball.size) {
            ball.exists = false; // Ball is "eaten"
          }
        }
      }
    }
  }
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const balls = [];
  const numBalls = 25;
  const evilCircle = new EvilCircle(200, 200); // Initialize EvilCircle
  
  // Create some initial balls
  for (let i = 0; i < numBalls; i++) {
    const size = Math.random() * 20 + 10;
    const ball = new Ball(
      Math.random() * (window.innerWidth - size * 2) + size,
      Math.random() * (window.innerHeight - size * 2) + size,
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      size,
      randomRGB()
    );
    balls.push(ball);
  }
  
  // Create a reference to the score paragraph
  const scoreParagraph = document.querySelector('p');
  let ballCount = balls.length;
  
  function randomRGB() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  }
  
  function loop() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  
    evilCircle.draw(ctx);
    evilCircle.checkBounds();
    evilCircle.collisionDetect(balls);
  
    for (const ball of balls) {
      if (ball.exists) {
        ball.draw(ctx);
        ball.update();
        ball.collisionDetect(balls);
      }
    }
  
    // Update score
    ballCount = balls.filter(ball => ball.exists).length;
    scoreParagraph.textContent = `Ball count: ${ballCount}`;
  
    requestAnimationFrame(loop);
  }
  
  loop();
          