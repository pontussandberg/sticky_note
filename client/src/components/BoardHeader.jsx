import React from 'react';

function BoardHeader({ sortedTextDocs, displayTextDoc, closeTab }) {
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

    const handleCloseTab = (event, quillID) => {
        event.stopPropagation()
        closeTab(quillID)
    }

    const renderBorderRight = (isActive, isNextActive, isLastTab) => {
        const borderRightClasses = isActive || isNextActive || isLastTab ? 'hidden' : 'tab__border-right'

        return <div className={borderRightClasses}></div>
    }

    const renderTabs = () => {
        return sortedTextDocs.map((textDoc, i) => {
            const isNextActive = sortedTextDocs[i + 1] && sortedTextDocs[i + 1].isDisplayed
            const isPrevActive = sortedTextDocs[i - 1] && sortedTextDocs[i - 1].isDisplayed
            const isLastTab = i === sortedTextDocs.length - 1

            return (
                <div
                    onClick={() => displayTextDoc(textDoc.quillID)} key={textDoc.quillID}
                    className={getTabClasses(textDoc, isNextActive, isPrevActive)}
                >
                    {/* Title */}
                    <span className="tab__title">{textDoc.noteHeader}</span>

                    {/* Border */}
                    {renderBorderRight(textDoc.isDisplayed, isNextActive, isLastTab)}

                    {/* Close action */}
                    <div onClick={(event) => handleCloseTab(event, textDoc.quillID)} className="tab__close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="9.9" height="9.9" viewBox="0 0 9.9 9.9">
                            <g id="Group_8" data-name="Group 8" transform="translate(-1177.793 -705.237)">
                                <rect id="Rectangle_10" data-name="Rectangle 10" width="13" height="1" rx="0.5" transform="translate(1178.5 705.237) rotate(45)" fill="#fff" />
                                <rect id="Rectangle_11" data-name="Rectangle 11" width="13" height="1" rx="0.5" transform="translate(1177.793 714.43) rotate(-45)" fill="#fff" />
                            </g>
                        </svg>
                    </div>
                </div>
            )
        })
    }

    return (
        <div className="board-header">
            { renderTabs()}
            <div className={getTabFillerClasses()}></div>
        </div>
    );
}

export default BoardHeader;