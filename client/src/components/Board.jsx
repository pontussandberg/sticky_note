import React from 'react';
import Stickie from './stickie/Stickie';

const Board = ({ stickies, isSidebarOpen, changeHeading, onStickiesUpdate, isMobile }) => {
    const renderStickie = () => {
        const x = stickies.find(x => x.isDisplayed);
        return x
            ? (<Stickie
                isSidebarOpen={isSidebarOpen}
                key={x.quillID}
                stickie={x}
                changeHeading={changeHeading}
                onStickiesUpdate={onStickiesUpdate}
            />)
            : null;
    };

    const getBoardClasses = () => isSidebarOpen && isMobile
        ? 'hidden'
        : 'board';

    return (
        <div className={getBoardClasses()}>
            {/* <div className="no-open"></div> */}
            {renderStickie()}
        </div>
    );
}

export default Board;
