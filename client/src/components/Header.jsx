import React from 'react';
import GoogleLogin from './buttons/GoogleLogin';
import LogoutBtn from './buttons/LogoutBtn';
import SecondaryLink from './buttons/SecondaryLink';
import Hamburger from './Hamburger';

const getAuthButtons = (authorized, isSidebarOpen, onLogout, isMobile) => authorized
    ? <LogoutBtn onLogout={onLogout} />
    : isMobile
        ? <SecondaryLink text='Log in' path='/login' />
        : <GoogleLogin isSidebarOpen={isSidebarOpen} />

const getHeaderClasses = (isSidebarOpen, isMobile) => !isSidebarOpen && isMobile
    ? 'hidden'
    : 'header'

const Header = ({ onSidebarToggle, isSidebarOpen, authorized, onLogout, isMobile }) => (
    <header className={getHeaderClasses(isSidebarOpen, isMobile)}>

        <Hamburger onClick={onSidebarToggle} />

        <h1 className="header__heading">STICKY NOTE</h1>

        {getAuthButtons(authorized, isSidebarOpen, onLogout, isMobile)}
    </header>
);

export default Header;