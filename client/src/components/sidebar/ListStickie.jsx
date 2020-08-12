import React from 'react';
import Cross from '../svg/Cross';
import Elipse from '../svg/Elipse';
import ArrowUp from '../svg/ArrowUp';

const getListClasses = (stickie, isSidebarOpen) => {
    const classes = stickie.isDisplayed
        ? 'list-stickie list-stickie--selected'
        : 'list-stickie';

    return isSidebarOpen
        ? classes
        : classes + ' no-padding';
};

const getArrowClasses = (stickie, stickies, isSidebarOpen) =>
    stickies[0] === stickie || !isSidebarOpen
        ? 'hidden'
        : 'list-stickie__arrow';

const getDelClasses = isSidebarOpen => isSidebarOpen
    ? "list-stickie__del"
    : "hidden";

const getElipseClasses = isSidebarOpen => isSidebarOpen
    ? "hidden"
    : "list-stickie__bullet";


const ListStickie = ({
    stickie,
    stickies,
    isSidebarOpen,
    checkRemove,
    handleListClick,
    onMoveUp,
}) => (
        <li className={getListClasses(stickie, isSidebarOpen)} key={stickie.quillID}>
            <button className="list-stickie__btn" onClick={() => handleListClick(stickie.quillID)}>
                <span className={isSidebarOpen ? "" : "hidden"}>
                    {stickie.noteHeader}
                </span>
                <Elipse classes={getElipseClasses(isSidebarOpen)} />
            </button>

            <button
                className={getArrowClasses(stickie, stickies, isSidebarOpen)}
                onClick={() => onMoveUp(stickie.quillID)}
            >
                <ArrowUp />
            </button>
            <button className={getDelClasses(isSidebarOpen)} onClick={() => checkRemove(stickie)} >
                <Cross />
            </button>
        </li>
    )

export default ListStickie;