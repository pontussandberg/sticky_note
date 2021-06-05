import React from 'react';
import TextEditor from './editors/TextEditor';
import BoardHeader from './BoardHeader';

const Board = ({ textDocs, isSidebarOpen, changeHeading, onTextDocUpdate, isSaving }) => {
    const renderEditor = () => {
        const currDisplayedDoc = textDocs.find(x => x.isDisplayed);
        return currDisplayedDoc
            ? (<TextEditor
                isSidebarOpen={isSidebarOpen}
                key={currDisplayedDoc.quillID}
                textDoc={currDisplayedDoc}
                changeHeading={changeHeading}
                onTextDocUpdate={onTextDocUpdate}
                isSaving={isSaving}
            />)
            : null;
    };


    return (
        <div className="board">
            <BoardHeader />
            {renderEditor()}
        </div>
    );
}

export default Board;
