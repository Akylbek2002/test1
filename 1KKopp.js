const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Paddle properties
const paddleWidth = 12;
const paddleHeight = 90;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

// Ball properties
const ballSize = 14;
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = (Math.random() - 0.5) * 7;

// AI properties
const aiSpeed = 5;

// Game loop
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight); // Left paddle
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight); // Right paddle

    // Draw ball
    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom
    if (ballY <= 0 || ballY + ballSize >= canvas.height) {
        ballSpeedY = -ballSpeedY;
        ballY = Math.max(0, Math.min(canvas.height - ballSize, ballY));
    }

    // Ball collision with left paddle
    if (
        ballX <= paddleWidth &&
        ballY + ballSize > leftPaddleY &&
        ballY < leftPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
        // Add a bit of angle based on where it hit the paddle
        ballSpeedY += ((ballY + ballSize / 2) - (leftPaddleY + paddleHeight / 2)) / 25;
        ballX = paddleWidth; // Prevent sticking
    }

    // Ball collision with right paddle (AI)
    if (
        ballX + ballSize >= canvas.width - paddleWidth &&
        ballY + ballSize > rightPaddleY &&
        ballY < rightPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
        ballSpeedY += ((ballY + ballSize / 2) - (rightPaddleY + paddleHeight / 2)) / 25;
        ballX = canvas.width - paddleWidth - ballSize; // Prevent sticking
    }

    // Ball out of bounds (reset)
    if (ballX < 0 || ballX > canvas.width) {
        resetBall();
    }

    // AI for right paddle
    if (rightPaddleY + paddleHeight / 2 < ballY + ballSize / 2) {
        rightPaddleY += aiSpeed;
    } else if (rightPaddleY + paddleHeight / 2 > ballY + ballSize / 2) {
        rightPaddleY -= aiSpeed;
    }
    // Clamp AI paddle
    rightPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddleY));

    requestAnimationFrame(draw);
}

function resetBall() {
    ballX = canvas.width / 2 - ballSize / 2;
    ballY = canvas.height / 2 - ballSize / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = (Math.random() - 0.5) * 7;
}

// Mouse control for left paddle
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    leftPaddleY = mouseY - paddleHeight / 2;
    // Clamp paddle
    leftPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddleY));
});

// Start game loop
draw();