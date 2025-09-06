class SnakeGame {
    constructor(canvasId, scoreId, highScoreId, startBtnId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById(scoreId);
        this.highScoreElement = document.getElementById(highScoreId);
        this.startBtn = document.getElementById(startBtnId);
        
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        this.snake = [];
        this.dx = 0;
        this.dy = 0;
        this.foodX = 0;
        this.foodY = 0;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameRunning = false;
        this.gameSpeed = 100;
        
        this.init();
    }
    
    init() {
        this.highScoreElement.textContent = this.highScore;
        this.draw();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.startBtn.addEventListener('click', () => this.startGame());
    }
    
    startGame() {
        this.gameSpeed = 100;
        this.initGame();
        this.gameLoop();
    }
    
    initGame() {
        this.snake = [{x: 10, y: 10}];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.scoreElement.textContent = this.score;
        this.generateFood();
        this.gameRunning = true;
        this.startBtn.textContent = 'RESTART';
    }
    
    generateFood() {
        this.foodX = Math.floor(Math.random() * this.tileCount);
        this.foodY = Math.floor(Math.random() * this.tileCount);
        
        for (let segment of this.snake) {
            if (segment.x === this.foodX && segment.y === this.foodY) {
                this.generateFood();
                return;
            }
        }
    }
    
    draw() {
        this.ctx.fillStyle = '#0a0f0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawGrid();
        this.drawSnake();
        this.drawFood();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
    }
    
    drawSnake() {
        for (let i = 0; i < this.snake.length; i++) {
            const segment = this.snake[i];
            
            if (i === 0) {
                this.ctx.fillStyle = '#00FF00';
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#00FF00';
            } else {
                this.ctx.fillStyle = `rgba(0, 255, 0, ${1 - (i / this.snake.length) * 0.5})`;
                this.ctx.shadowBlur = 5;
                this.ctx.shadowColor = '#00FF00';
            }
            
            this.ctx.fillRect(
                segment.x * this.gridSize + 2, 
                segment.y * this.gridSize + 2, 
                this.gridSize - 4, 
                this.gridSize - 4
            );
        }
        this.ctx.shadowBlur = 0;
    }
    
    drawFood() {
        this.ctx.fillStyle = '#F8D866';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#F8D866';
        this.ctx.fillRect(
            this.foodX * this.gridSize + 2, 
            this.foodY * this.gridSize + 2, 
            this.gridSize - 4, 
            this.gridSize - 4
        );
        this.ctx.shadowBlur = 0;
    }
    
    update() {
        if (!this.gameRunning) return;
        
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        if (head.x === this.foodX && head.y === this.foodY) {
            this.score++;
            this.scoreElement.textContent = this.score;
            this.generateFood();
            
            if (this.gameSpeed > 50) {
                this.gameSpeed -= 1;
            }
        } else {
            this.snake.pop();
        }
    }
    
    checkCollision(head) {
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            return true;
        }
        
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                return true;
            }
        }
        
        return false;
    }
    
    gameOver() {
        this.gameRunning = false;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreElement.textContent = this.highScore;
            localStorage.setItem('snakeHighScore', this.highScore);
        }
        
        this.startBtn.textContent = 'START GAME';
    }
    
    gameLoop() {
        this.update();
        this.draw();
        
        if (this.gameRunning) {
            setTimeout(() => this.gameLoop(), this.gameSpeed);
        }
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning) return;
        
        switch(e.key) {
            case 'ArrowUp':
                if (this.dy === 0) {
                    this.dx = 0;
                    this.dy = -1;
                }
                break;
            case 'ArrowDown':
                if (this.dy === 0) {
                    this.dx = 0;
                    this.dy = 1;
                }
                break;
            case 'ArrowLeft':
                if (this.dx === 0) {
                    this.dx = -1;
                    this.dy = 0;
                }
                break;
            case 'ArrowRight':
                if (this.dx === 0) {
                    this.dx = 1;
                    this.dy = 0;
                }
                break;
        }
    }
}

export default SnakeGame;