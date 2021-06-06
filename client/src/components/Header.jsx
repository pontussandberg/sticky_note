import React from 'react';
import LogoutBtn from './buttons/LogoutBtn';
import SecondaryBtn from './buttons/SecondaryBtn';
import Hamburger from './Hamburger';
import DarkModeToggle from "react-dark-mode-toggle";

const getAuthButtons = (authorized, onLogout, onToggleLoginModal) => authorized
    ? <LogoutBtn onLogout={onLogout} />
    : <SecondaryBtn text='Log in' onClick={onToggleLoginModal} />


const Header = ({ onSidebarToggle,
                  authorized, onLogout, isMobile,
                  onLightModeToggle, isLightMode,
                  onToggleLoginModal, isSidebarOpen }) => {
// -->
    return (
        <header className={isSidebarOpen ? 'header' : 'header header--closed'}>
            <div className="flex flex--jc-center">
                <Hamburger
                onClick={onSidebarToggle}
                isSidebarOpen={isSidebarOpen}
                isMobile={isMobile}
                />

                <div
                className={isSidebarOpen ? 'toggle-button add32left' : 'hidden'}
                onClick={onLightModeToggle}
                >
                    <DarkModeToggle
                    checked={!isLightMode}
                    size={isMobile ? 50 : 60}
                    />
                </div>
            </div>

            <div className={isSidebarOpen ? 'header__login' : 'hidden'}>
                {getAuthButtons(authorized, onLogout, onToggleLoginModal)}
            </div>
        </header>
    )
}

export default Header;