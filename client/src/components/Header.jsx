import React from 'react';
import GoogleLogin from './buttons/GoogleLogin';
import LogoutBtn from './buttons/LogoutBtn';
import SecondaryLink from './buttons/SecondaryLink';

const getAuthButtons = (authorized, isSidebarOpen, onLogout, isMobile) => authorized
    ? <LogoutBtn onLogout={onLogout} />
    : isMobile
        ? <SecondaryLink text='Log in' path='/login' />
        : <GoogleLogin isSidebarOpen={isSidebarOpen} />

const Header = ({ onSidebarToggle, isSidebarOpen, authorized, onLogout, isMobile }) => (
    <header className="header">
        <button className="header__hamburger" onClick={onSidebarToggle}>
            <svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" width="26px" height="26px">
                <path d="M 0 4 L 0 6 L 26 6 L 26 4 Z M 0 12 L 0 14 L 26 14 L 26 12 Z M 0 20 L 0 22 L 26 22 L 26 20 Z" />
            </svg>
        </button>

        <h1 className="header__heading">STICKY NOTE</h1>

        {getAuthButtons(authorized, isSidebarOpen, onLogout, isMobile)}
    </header>
);

export default Header;