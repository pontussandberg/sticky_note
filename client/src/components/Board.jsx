import React from 'react';
import TextEditor from './editors/TextEditor';
import BoardHeader from './BoardHeader';



const Board = ({ textDocs, isSidebarOpen, changeHeading,
                onTextDocUpdate, isSaving, displayTextDoc,
                closeTab, isMobile }) => {

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

    const renderBoardHeader = () => {
        if (isMobile) {
            return null
        }

        return (
            <BoardHeader
            closeTab={closeTab}
            displayTextDoc={displayTextDoc}
            sortedTextDocs={sortedTabPosTextDocs()}
            />
        )
    }

    return (
        <div className="board">
            {renderBoardHeader()}
            {renderEditor()}
        </div>
    );
}

export default Board;
