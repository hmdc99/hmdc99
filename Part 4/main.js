<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bouncing Balls Demo</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
        }
        canvas {
            display: block;
        }
        p {
            position: absolute;
            margin: 0;
            top: 35px;
            right: 5px;
            color: #aaa;
        }
    </style>
</head>
<body>
    <h1>Bouncing Balls</h1>
    <p>Ball count: </p>
    <canvas></canvas>

    <script>
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Helper function to generate random RGB colors
        function randomRGB() {
            return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        }

        // Shape class
        class Shape {
            constructor(x, y, velX, velY) {
                this.x = x;
                this.y = y;
                this.velX = velX;
                this.velY = velY;
            }
        }

        // Ball class inheriting from Shape
        class Ball extends Shape {
            constructor(x, y, velX, velY, size, color) {
                super(x, y, velX, velY);
                this.size = size;
                this.color = color;
                this.exists = true;
            }

            draw() {
                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
                ctx.fill();
            }

            update() {
                if ((this.x + this.size) >= canvas.width || (this.x - this.size) <= 0) {
                    this.velX = -this.velX;
                }

                if ((this.y + this.size) >= canvas.height || (this.y - this.size) <= 0) {
                    this.velY = -this.velY;
                }

                this.x += this.velX;
                this.y += this.velY;
            }

            collisionDetect() {
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

        // EvilCircle class inheriting from Shape
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

            draw() {
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 3;
                ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
                ctx.stroke();
            }

            checkBounds() {
                if ((this.x + this.size) >= canvas.width) {
                    this.x = canvas.width - this.size;
                }
                if ((this.x - this.size) <= 0) {
                    this.x = this.size;
                }
                if ((this.y + this.size) >= canvas.height) {
                    this.y = canvas.height - this.size;
                }
                if ((this.y - this.size) <= 0) {
                    this.y = this.size;
                }
            }

            collisionDetect() {
                for (const ball of balls) {
                    if (ball.exists) {
                        const dx = this.x - ball.x;
                        const dy = this.y - ball.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < this.size + ball.size) {
                            ball.exists = false;
                            score--;
                        }
                    }
                }
            }
        }

        // Create balls
        const balls = [];
        while (balls.length < 25) {
            const size = Math.random() * 20 + 10;
            const ball = new Ball(
                Math.random() * (canvas.width - size * 2) + size,
                Math.random() * (canvas.height - size * 2) + size,
                Math.random() * 4 - 2,
                Math.random() * 4 - 2,
                size,
                randomRGB()
            );
            balls.push(ball);
        }

        // Create an evil circle
        const evilCircle = new EvilCircle(100, 100);

        // Score variable
        let score = balls.length;

        // Reference to the score paragraph
        const scoreDisplay = document.querySelector('p');

        // Function to update the score display
        function updateScore() {
            scoreDisplay.textContent = `Ball count: ${score}`;
        }

        // Animation loop function
        function loop() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (const ball of balls) {
                if (ball.exists) {
                    ball.draw();
                    ball.update();
                    ball.collisionDetect();
                }
            }

            evilCircle.draw();
            evilCircle.checkBounds();
            evilCircle.collisionDetect();

            updateScore(); // Update the score display

            requestAnimationFrame(loop);
        }

        // Start the animation
        loop();
    </script>
</body>
</html>
