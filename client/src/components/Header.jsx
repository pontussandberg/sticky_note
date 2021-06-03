import React from 'react';
import LogoutBtn from './buttons/LogoutBtn';
import SecondaryBtn from './buttons/SecondaryBtn';
import Hamburger from './Hamburger';
import DarkModeToggle from "react-dark-mode-toggle";

const getAuthButtons = (authorized, onLogout, onToggleLogin) => authorized
    ? <LogoutBtn onLogout={onLogout} />
    : <SecondaryBtn text='Log in' onClick={onToggleLogin} />


const Header = ({ onSidebarToggle,
                  authorized, onLogout, isMobile,
                  onLightModeToggle, isLightMode,
                  onToggleLogin, isSidebarOpen }) => {
// -->
    return (
        <header className={isSidebarOpen ? 'header' : 'header header--closed'}>
            <div className="flex flex--jc-center">
                <Hamburger
                onClick={onSidebarToggle}
                isSidebarOpen={isSidebarOpen}
                isMobile={isMobile}
                />

                <button className={isSidebarOpen ? 'toggle-button add32left' : 'hidden'} onClick={onLightModeToggle}>
                    <DarkModeToggle
                    checked={!isLightMode}
                    size={isMobile ? 50 : 60}
                    />
                </button>
            </div>

            <div className={isSidebarOpen ? 'header__login' : 'hidden'}>
                {getAuthButtons(authorized, onLogout, onToggleLogin)}
            </div>
        </header>
    )
}

export default Header;