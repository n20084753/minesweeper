import React from 'react';

import './game-initializer.scss';

const GameInitializer = (props) => {
    let levelOptions = Object.entries(props.levels).map(([key, value], index) => {
        let className = value === props.currentLevel ? "ui button active" : "ui button";
        return (
            <button 
                key = {value} 
                onClick = {() => props.onSelectLevel(value)} 
                className = {className} >
                {key}
            </button>
        );
    });

    return (
        <React.Fragment>
            <div className = "game-init-container">
                <h3>Choose Level</h3>
                <div className = "large ui vertical buttons">
                    {levelOptions}
                </div>
                <br/><br/>
                <div className = "footer-button">
                    <button 
                        onClick = {props.onStart} 
                        className = "ui large red button" >
                        Start Game
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
}

export default GameInitializer