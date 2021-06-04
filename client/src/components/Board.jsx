import React from 'react';
import Stickie from './stickie/Stickie';

const Board = ({ stickies, isSidebarOpen, changeHeading, onStickiesUpdate, isMobile, isSaving }) => {
    const renderStickie = () => {
        const x = stickies.find(x => x.isDisplayed);
        return x
            ? (<Stickie
                isSidebarOpen={isSidebarOpen}
                key={x.quillID}
                stickie={x}
                changeHeading={changeHeading}
                onStickiesUpdate={onStickiesUpdate}
                isSaving={isSaving}
            />)
            : null;
    };

    const getBoardClasses = () => isSidebarOpen && isMobile
        ? 'board--hidden'
        : 'board';

    return (
        <div className={getBoardClasses()}>
            {/* <div className="no-open"></div> */}
            {renderStickie()}
        </div>
    );
}

export default Board;
