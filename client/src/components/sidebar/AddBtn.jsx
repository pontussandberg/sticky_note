import React from 'react';
import Plus from '../svg/Plus';

const getContainerClasses = (isMobile, isSidebarOpen) =>
    isMobile && !isSidebarOpen
        ? 'add-btn--mobile-menu-closed'
        : 'add-btn-container';

const getTextClasses = (isSidebarOpen) => isSidebarOpen
    ? 'add-btn__text'
    : 'hidden'

const getBtnClasses = (isSidebarOpen, isMobile) => !isSidebarOpen && isMobile
    ? 'add-btn add-btn--closed-mobile'
    : 'add-btn'

const AddBtn = ({ onAdd, isMobile, isSidebarOpen }) => (
    <div className={getContainerClasses(isMobile, isSidebarOpen)}>
        <button className={getBtnClasses(isSidebarOpen, isMobile)} onClick={onAdd}>
            <span className={getTextClasses(isSidebarOpen)}>New</span>
            <Plus />
        </button>
    </div>
);

export default AddBtn;