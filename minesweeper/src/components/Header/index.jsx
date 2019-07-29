import React from "react";

import './header.scss';

const Header = (props) => {

    const formattedTime = (timer) => {
        let min = Math.floor(timer / 60) + "";
        let sec = (timer - min * 60) + "";

        return `${min.padStart(2, '0')}:${sec.padStart(2, '0')}`;
    }

    let levelOptions = Object.entries(props.levels).map(([key, value], index) => {
        return <option key={key} value={value}>{key.charAt(0) + key.substring(1).toLocaleLowerCase()}</option>;
    });

    return (
        <div className="app-header">
            <h3 className="title header-cell left">
                Minesweeper
            </h3>
            <h3 className="header-cell center">
                <i className="bomb icon" />{props.level}
            </h3>
            <h3 className="header-cell center">
                <i className="clock outline icon" />{formattedTime(props.timer)}  
            </h3>
            <div className="header-cell right">
                <select value={props.level} onChange={props.onLevelChange}>
                    {levelOptions}
                </select> 
            </div>
        </div>
    );
}

export default Header;