class Game2048 {
    constructor() {
        this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
        this.timer = 0;
        this.started = false;
        this.gameOver = false;
        this.startTime = null;

        this.boardElement = document.getElementById("game-board");
        this.timerElement = document.getElementById("timer");
        this.messageElement = document.getElementById("message");

        this.init();
    }

    init() {
        this.spawnTile();
        this.spawnTile();
        this.render();
        this.listenForInput();
    }

    startTimer() {
        if (!this.started) {
            this.started = true;
            this.startTime = Date.now();
            this.updateTimer();
        }
    }

    updateTimer() {
        if (!this.gameOver) {
            this.timer = Math.floor((Date.now() - this.startTime) / 1000);
            this.timerElement.textContent = `Tid: ${this.timer}s`;
            requestAnimationFrame(() => this.updateTimer());
        }
    }

    spawnTile() {
        let emptyCells = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c] === 0) emptyCells.push({ r, c });
            }
        }

        if (emptyCells.length > 0) {
            let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    move(direction) {
        if (this.gameOver) return;
        this.startTimer();

        let moved = false;
        let prevBoard = JSON.stringify(this.board);

        let rotate = (board) => board[0].map((_, c) => board.map(row => row[c])).reverse();
        let rotateBack = (board) => board.map((_, c) => board.map(row => row[c])).reverse();

        if (direction === "ArrowUp") this.board = rotate(this.board);
        if (direction === "ArrowDown") {
            this.board = rotate(this.board);
            this.board = rotate(this.board);
            this.board = rotate(this.board);
        }
        if (direction === "ArrowRight") {
            this.board = rotate(this.board);
            this.board = rotate(this.board);
        }

        for (let row of this.board) {
            let filtered = row.filter(v => v);
            for (let i = 0; i < filtered.length - 1; i++) {
                if (filtered[i] === filtered[i + 1]) {
                    filtered[i] *= 2;
                    filtered[i + 1] = 0;
                    if (filtered[i] === 2048) this.win();
                }
            }
            row.length = 0;
            row.push(...filtered.filter(v => v), ...Array(4 - filtered.filter(v => v).length).fill(0));
        }

        if (direction === "ArrowUp") this.board = rotateBack(this.board);
        if (direction === "ArrowDown") {
            this.board = rotateBack(this.board);
            this.board = rotateBack(this.board);
            this.board = rotateBack(this.board);
        }
        if (direction === "ArrowRight") {
            this.board = rotateBack(this.board);
            this.board = rotateBack(this.board);
        }

        if (JSON.stringify(this.board) !== prevBoard) {
            moved = true;
            this.spawnTile();
            this.render();
        }

        if (!moved) this.checkGameOver();
    }

    render() {
        this.boardElement.innerHTML = "";
        this.board.forEach((row, r) => row.forEach((value, c) => {
            if (value) {
                let tile = document.createElement("div");
                tile.className = "tile";
                tile.textContent = value;
                tile.setAttribute("data-value", value);
                tile.style.transform = `translate(${c * 110}px, ${r * 110}px)`;
                this.boardElement.appendChild(tile);
            }
        }));
    }

    checkGameOver() {
        if (this.board.flat().every(v => v !== 0)) {
            this.messageElement.textContent = "Game Over!";
            this.gameOver = true;
        }
    }

    win() {
        this.gameOver = true;
        this.messageElement.textContent = "🎉 Du vandt!";
        saveTime(this.timer);
    }

    listenForInput() {
        document.addEventListener("keydown", (e) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                this.move(e.key);
            }
        });
    }
}

new Game2048();
