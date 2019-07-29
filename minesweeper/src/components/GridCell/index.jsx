import React from 'react';

import './grid-cell.scss';

const GridCell = (props) => {
    let className = props.cellState.flagged ? 
        'grid-cell flagged' :
        props.cellState.revealed ? 
            'grid-cell revealed' : 
            'grid-cell';
    return (
        <div 
            onClick = {() => props.onClick(props.cellState.row, props.cellState.col)} 
            onContextMenu={(e) => props.onRightClick(e, props.cellState.row, props.cellState.col)} 
            className = {className}
        >
            {
                props.cellState.flagged ? 
                    <span><i className = "flag icon" /></span> :
                    props.cellState.bomb ?  
                        <span><i className = "bomb icon" /></span> : 
                        (props.cellState.neighbourCount > 0) && <span>{props.cellState.neighbourCount}</span>
            }
        </div>
    );
}

export default GridCell;