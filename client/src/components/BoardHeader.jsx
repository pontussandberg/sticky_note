import React from 'react';

function BoardHeader({ sortedTextDocs, displayTextDoc }) {
    const getTabClasses = (textDoc, isNextActive, isPrevActive) => {
        let classes = 'board-header__tab '

        if (textDoc.isDisplayed) {
            classes += 'active '
        }
        if (isNextActive) {
            classes += 'board-header__tab--next-active '
        }
        if (isPrevActive) {
            classes += 'board-header__tab--prev-active '
        }

        return classes
    }

    const getTabFillerClasses = () => {
        let classes = 'board-header__tab-filler '

        const lastTabIsActive = sortedTextDocs[sortedTextDocs.length - 1] && sortedTextDocs[sortedTextDocs.length - 1].isDisplayed
        if (lastTabIsActive) {
            classes += 'board-header__tab--prev-active '
        }

        return classes
    }

    const renderTabs = () => {
        //console.log(sortedTextDocs)
        return sortedTextDocs.map((textDoc, i) => {
            const isNextActive = sortedTextDocs[i + 1] && sortedTextDocs[i + 1].isDisplayed
            const isPrevActive = sortedTextDocs[i - 1] && sortedTextDocs[i - 1].isDisplayed
            return (
                <div
                onClick={() => displayTextDoc(textDoc.quillID)} key={textDoc.quillID}
                className={getTabClasses(textDoc, isNextActive, isPrevActive)}
                >
                    <span className="tab__title">{textDoc.noteHeader}</span>
                </div>
            )
        })
    }

    return (
        <div className="board-header">
            { renderTabs() }
            <div className={getTabFillerClasses()}></div>
        </div>
    );
}

export default BoardHeader;