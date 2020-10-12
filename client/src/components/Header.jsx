import React from 'react';
import LogoutBtn from './buttons/LogoutBtn';
import SecondaryBtn from './buttons/SecondaryBtn';
import Hamburger from './Hamburger';
import DarkModeToggle from "react-dark-mode-toggle";

const getAuthButtons = (authorized, onLogout, onToggleLogin) => authorized
    ? <LogoutBtn onLogout={onLogout} />
    : <SecondaryBtn text='Log in' onClick={onToggleLogin} />


const getHeaderClasses = (isSidebarOpen, isMobile) => !isSidebarOpen && isMobile
    ? 'hidden'
    : 'header'

const Header = ({ onSidebarToggle, isSidebarOpen,
                authorized, onLogout, isMobile,
                onLightModeToggle, isLightMode, onToggleLogin }) => (

    <header className={getHeaderClasses(isSidebarOpen, isMobile)}>

        <Hamburger onClick={onSidebarToggle} />

        <h1 className="header__heading">STICKY NOTE</h1>

        <button className='toggle-button' onClick={onLightModeToggle}>
            <DarkModeToggle 
                checked={!isLightMode}
                size={isMobile ? 50 : 60}
            />
        </button>
        {getAuthButtons(authorized, onLogout, onToggleLogin)}
    </header>
);

export default Header;