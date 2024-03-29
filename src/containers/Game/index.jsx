import React, { Component } from "react";

import './game.scss';

import Cell from './Cell';
import Header from '../../components/Header';
import GridCell from '../../components/GridCell';

const GAME_STATUS = {
    IN_PROGRESS: 0,
    FINISHED: 1
};

const LEVEL = {
    EASY: 8,
    MEDIUM: 10,
    HARD: 12
};

class Game extends Component {
    state = {
        gameStatus: GAME_STATUS.IN_PROGRESS,
        level: LEVEL.MEDIUM,
        timer: 0,
        grid: [],
        revealedCount: 0,
        result: 0, // 0 - lose  | 1 - win
    }

    componentDidMount() {
        this.startFreshGame(this.state.level);
    }

    componentWillUnmount = () => clearInterval(this.interval)
    
    // Initializes new game when changing levels or trying again
    startFreshGame(level) {
        let grid = Array.from(Array(+level), () => new Array(+level));
        this.populateGrid(grid);
        this.populateBombs(grid);
        this.countBombs(grid);
        this.setState({
            gameStatus: GAME_STATUS.IN_PROGRESS,
            level: +level,
            timer: 0,
            grid: grid,
            revealedCount: 0,
            result: 0
        });
        
        if (this.interval) {
            clearInterval(this.interval);
        }
        
        this.interval = setInterval(() => {
            this.setState({ timer: this.state.timer + 1 });
        }, 1000);
    }

    // Initializes the gird with cells
    populateGrid = (grid) => {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                grid[i][j] = new Cell(i, j);
            }
        }
    }

    // Sets (level) mines or bombs randomly in the grid
    populateBombs = (grid) => {
        var options = [];
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                options.push([i, j]);
            }
        }

        for (let i = 0; i < grid.length; i++) {
            let index = Math.floor(Math.random() * options.length);
            let [row, col] = options[index];

            options.splice(index, 1);

            grid[row][col].bomb = true;
        }
    }

    // Updates the cell's neighbour count based on number of mines that surrounding it
    countBombs = (grid) => {
        let rowLength = grid.length;
        let colLength = grid[0].length;

        for (let i = 0; i < rowLength; i++) {
            for (let j = 0; j < colLength; j++) {
                if (grid[i][j].bomb) {
                    grid[i][j].neighbourCount = -1;
                    continue;
                }

                let count = 0;
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        let row = i + x;
                        let col = j + y;
                        if (row >= 0 && row < rowLength && col >= 0 && col < colLength) {
                            if (grid[row][col].bomb) {
                                count++;
                            }
                        }
                    }
                }
                grid[i][j].neighbourCount = count;
            }
        }
    }

    // Gets the number of revealed cells in the grid
    getRevealedCellsCount = () => {
        let grid = this.state.grid;
        let revealed = 0;
        for(let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j].revealed) {
                    revealed++;
                }
            }
        }

        return revealed;
    }

    // Handles the level dropdown onChange event, Updates game level
    onLevelChange = (event) => {
        this.startFreshGame(event.target.value);
    }
    
    // Updates the gameStatus to INITIAL and resets the result to default
    resetGame = () => this.startFreshGame(this.state.level)
    
    // Win state when all the non mine or bomb areas are revelaed
    finished = () => {
        clearInterval(this.interval);
        this.setState({
            gameStatus: GAME_STATUS.FINISHED,
            result: 1
        });
    }

    // When user steps on the mone or bomb
    gameOver = () => {
        let grid = this.state.grid;

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                grid[i][j].revealed = true;
            }
        }

        this.setState({
            grid: grid,
            gameStatus: GAME_STATUS.FINISHED
        });

        clearInterval(this.interval);
    }

    // Handles the click on cell
    revealCell = (row, col) => {
        let grid = this.state.grid;

        if (grid[row][col].flagged) {
            return;
        }

        if (grid[row][col].bomb) {
            return this.gameOver();
        }
        
        grid[row][col].reveal(grid);
        
        let level = this.state.level;
        let revealedCount = this.getRevealedCellsCount();
        
        if (((level * level) - revealedCount) === level) {
            this.finished();            
        }

        this.setState({
            grid: grid,
            revealedCount: revealedCount
        });
    }

    // Handles the right click on the cell, marks the cell as flagged
    toggleFlag = (e, row, col) => {
        e.preventDefault();
        let grid = this.state.grid;

        grid[row][col].flagged = !grid[row][col].flagged;

        this.setState({ grid: grid });
    }

    // Formats the timer to mm:ss time format
    formattedTime = (timer) => {
        let min = Math.floor(timer / 60) + "";
        let sec = (timer - min * 60) + "";

        return `${min.padStart(2, '0')}:${sec.padStart(2, '0')}`;
    }

    render() {
        let grid = this.state.grid;
        let girdCells = grid.map((rowItem, rowIndex) => {
            return (
                <div key={rowIndex} className="grid-row">
                    {rowItem.map((colItem, colIndex) => {
                        return (
                            <GridCell
                                onClick={this.revealCell}
                                onRightClick={this.toggleFlag}
                                className="grid-cell"
                                cellState={colItem}
                                key={colIndex}
                            />
                        );
                    })}
                </div>
            );
        });

        return (
            <React.Fragment>
                <div className="game-container ui segment">
                    <Header 
                        timer={this.formattedTime(this.state.timer)}
                        level={this.state.level}
                        levels={LEVEL}
                        onLevelChange={this.onLevelChange}
                    />
                    <div className="grid-container">
                        {girdCells}
                    </div>                    
                    {
                        this.state.gameStatus === GAME_STATUS.FINISHED &&
                            <div className="result-container">
                                <div className="game-result">
                                <h1>
                                    <i className="clock icon"/>
                                    {
                                        this.state.result ? 
                                            (
                                                <React.Fragment>
                                                    <p>{this.formattedTime(this.state.timer)}</p>
                                                    <p>Congrats</p>
                                                </React.Fragment>
                                            ) : 
                                            (
                                                <React.Fragment>
                                                    <p>---</p>
                                                    <p>OOPS!</p>
                                                </React.Fragment>
                                            )
                                    }
                                </h1>
                                </div>
                                <div className="footer-button">
                                    <button onClick={this.resetGame} className="ui large green button">
                                        <i className="redo icon"/> Try again
                                    </button>
                                </div>
                            </div>
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default Game;