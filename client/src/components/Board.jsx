import React from 'react';
import TextEditor from './editors/TextEditor';
import BoardHeader from './BoardHeader';



const Board = ({ textDocs, isSidebarOpen, changeHeading,
                onTextDocUpdate, isSaving, displayTextDoc,
                closeTab }) => {

    const sortedTabPosTextDocs = () => {
        const filtered = textDocs.filter(textDoc => typeof textDoc.tabPos === 'number' && textDoc.tabPos >= 0)

        const compare = (a, b) => {
            if (a.tabPos < b.tabPos) {
                return -1;
            }
            if (a.tabPos > b.tabPos) {
                return 1;
            }
            return 0;
        }

        if (filtered.length) {
            return filtered.sort( compare )
        }
        return []
    }

    const renderEditor = () => {
        const currDisplayedDoc = textDocs.find(x => x.isDisplayed)

        if (currDisplayedDoc) {
            return (
            <TextEditor
            isSidebarOpen={isSidebarOpen}
            key={currDisplayedDoc.quillID}
            textDoc={currDisplayedDoc}
            changeHeading={changeHeading}
            onTextDocUpdate={onTextDocUpdate}
            isSaving={isSaving}
            />)
        }

        return null
    }

    return (
        <div className="board">
            <BoardHeader closeTab={closeTab} displayTextDoc={displayTextDoc} sortedTextDocs={sortedTabPosTextDocs()} />
            {renderEditor()}
        </div>
    );
}

export default Board;
