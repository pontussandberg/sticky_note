import React from 'react';

function BoardHeader({ sortedTextDocs, displayTextDoc }) {
    const getTabClasses = (textDoc) => textDoc.isDisplayed
        ? 'board-header__tab active'
        : 'board-header__tab'

    const renderTabs = () => {
        //console.log(sortedTextDocs)
        return sortedTextDocs.map(textDoc =>
            <div
            onClick={() => displayTextDoc(textDoc.quillID)} key={textDoc.quillID}
            className={getTabClasses(textDoc)}
            >
                {textDoc.noteHeader}
            </div>
        )
    }

    return (
        <div className="board-header">
            { renderTabs() }
        </div>
    );
}

export default BoardHeader;