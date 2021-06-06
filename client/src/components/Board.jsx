import React from 'react';
import TextEditor from './editors/TextEditor';
import BoardHeader from './BoardHeader';



const Board = ({ textDocs, isSidebarOpen, changeHeading,
                onTextDocUpdate, isSaving, displayTextDoc }) => {

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
            const x = filtered.sort( compare )
            console.log(x)
            return x
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
            <BoardHeader displayTextDoc={displayTextDoc} sortedTextDocs={sortedTabPosTextDocs()} />
            {renderEditor()}
        </div>
    );
}

export default Board;
