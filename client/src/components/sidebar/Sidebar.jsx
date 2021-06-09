import React from 'react';
import AddBtn from './AddBtn';
import ListTextDoc from './ListTextDoc';
import Spinner from '../Spinner';
import Hamburger from '../Hamburger';
import Header from '../Header';


const deleteMsg = ({ noteHeader }) => `
Are your sure that you want to delete "${noteHeader}"?
This action can not be undone.
`;



const SideBar = ({
    textDocs,
    displayTextDoc,
    onRemove,
    onSidebarToggle,
    isSidebarOpen,
    onAddGuide,
    onAdd,
    onMoveUp,
    isLoading,
    isMobile,
    onLogout,
    isLightMode,
    authorized,
    onLightModeToggle,
    onToggleLoginModal,

}) => {
    const handleListClick = (quillID) => {
        displayTextDoc(quillID);

        if (isMobile && isSidebarOpen) {
            onSidebarToggle();
        }
    }

    const checkRemove = textDoc => {
        if (window.confirm(deleteMsg(textDoc))) {
            onRemove(textDoc.quillID);
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
                <Header
                isLightMode={isLightMode}
                authorized={authorized}
                onLightModeToggle={onLightModeToggle}
                isSidebarOpen={isSidebarOpen}
                onSidebarToggle={onSidebarToggle}
                isMobile={isMobile}
                onLogout={onLogout}
                onToggleLoginModal={onToggleLoginModal}
                isSidebarOpen={isSidebarOpen}
                />

                <AddBtn
                onAdd={onAdd}
                isSidebarOpen={isSidebarOpen}
                isMobile={isMobile}
                />
                <div className="sidebar__container sidebar__wrapper">
                    <div className="sidebar__list-container">
                        <ul>
                            {isLoading
                            ? <Spinner />
                            : textDocs.map(x => (
                                <ListTextDoc
                                key={x.quillID}
                                textDoc={x}
                                textDocs={textDocs}
                                isSidebarOpen={isSidebarOpen}
                                onMoveUp={onMoveUp}
                                checkRemove={checkRemove}
                                handleListClick={handleListClick}
                                />
                            ))}
                        </ul>
                    </div>
                </div>

                <footer className="sidebar__footer">
                    <button className="sidebar__guide-btn" onClick={onAddGuide} > ? </button>
                </footer>
            </div>
        </>
    );
}

export default SideBar;
