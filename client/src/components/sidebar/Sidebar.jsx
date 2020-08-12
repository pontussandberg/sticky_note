import React from 'react';
import AddBtn from './AddBtn';
import ListStickie from './ListStickie';
import Spinner from '../Spinner';


const deleteMsg = ({ noteHeader }) => `
Are your sure that you want to delete "${noteHeader}"? 
This action can not be undone.
`;



const SideBar = ({
    stickies,
    displayStickie,
    onRemove,
    onSidebarToggle,
    isSidebarOpen,
    onAddGuide,
    onAdd,
    onMoveUp,
    isLoading,
    isMobile,
    authorized,
}) => {
    const handleListClick = (quillID) => {
        displayStickie(quillID);

        if (isMobile && isSidebarOpen) {
            onSidebarToggle();
        }
    }

    const checkRemove = stickie => {
        if (window.confirm(deleteMsg(stickie))) {
            onRemove(stickie.quillID);
        }
    }

    const getSidebarClasses = () => isSidebarOpen && isMobile
        ? 'sidebar sidebar--open-mobile'
        : isSidebarOpen
            ? "sidebar"
            : "sidebar sidebar--closed"

    return (
        <>
            <div className={getSidebarClasses()}>
                <AddBtn onAdd={onAdd} isSidebarOpen={isSidebarOpen} isMobile={isMobile} />
                <div className="sidebar__list-container">
                    <ul>
                        {isLoading
                            ? <Spinner />
                            : stickies.map(x => (
                                <ListStickie
                                    key={x.quillID}
                                    stickie={x}
                                    stickies={stickies}
                                    isSidebarOpen={isSidebarOpen}
                                    onMoveUp={onMoveUp}
                                    checkRemove={checkRemove}
                                    handleListClick={handleListClick}
                                />
                            ))}
                    </ul>
                </div>
                <footer className="sidebar__footer">
                    <button className="sidebar__guide-btn" onClick={onAddGuide} > ? </button>
                </footer>
            </div>
        </>
    );
}

export default SideBar;
