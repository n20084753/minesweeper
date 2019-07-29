class Cell {
    constructor(row, col) {
        this.bomb = false;
        this.row = row;
        this.col = col;
        this.revealed = false;
        this.flagged = false;
        this.neighbourCount = 0;
    }

    reveal(grid) {
        this.revealed = true;
        if (this.neighbourCount === 0) {
            this.floodFill(grid);
        }
    }

    floodFill(grid) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let row = this.row + i;
                let col = this.col + j;
                if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
                    if (!grid[row][col].bomb && !grid[row][col].revealed) {
                        grid[row][col].reveal(grid);
                    }
                }
            }
        }
    }
}

export default Cell;