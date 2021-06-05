import React from 'react';
import Cross from '../svg/Cross';
import Elipse from '../svg/Elipse';
import ArrowUp from '../svg/ArrowUp';

const getListClasses = (textDoc, isSidebarOpen) => {
    const classes = textDoc.isDisplayed
        ? 'list-text-doc list-text-doc--selected'
        : 'list-text-doc';

    return isSidebarOpen
        ? classes
        : classes + ' no-padding list-text-doc--closed';
};

const getArrowClasses = (textDoc, textDocs, isSidebarOpen) =>
    textDocs[0] === textDoc || !isSidebarOpen
        ? 'hidden'
        : 'list-text-doc__arrow';

const getDelClasses = isSidebarOpen => isSidebarOpen
    ? "list-text-doc__del"
    : "hidden";

const getElipseClasses = isSidebarOpen => isSidebarOpen
    ? "hidden"
    : "list-text-doc__bullet";


const ListTextDoc = ({
    textDoc,
    textDocs,
    isSidebarOpen,
    checkRemove,
    handleListClick,
    onMoveUp,
}) => (
        <li className={getListClasses(textDoc, isSidebarOpen)} key={textDoc.quillID}>
            <button className="list-text-doc__btn" onClick={() => handleListClick(textDoc.quillID)}>
                <span className={isSidebarOpen ? "" : "hidden"}>
                    {textDoc.noteHeader}
                </span>
                <Elipse classes={getElipseClasses(isSidebarOpen)} />
            </button>

            <button
                className={getArrowClasses(textDoc, textDocs, isSidebarOpen)}
                onClick={() => onMoveUp(textDoc.quillID)}
            >
                <ArrowUp />
            </button>
            <button className={getDelClasses(isSidebarOpen)} onClick={() => checkRemove(textDoc)} >
                <Cross />
            </button>
        </li>
    )

export default ListTextDoc;