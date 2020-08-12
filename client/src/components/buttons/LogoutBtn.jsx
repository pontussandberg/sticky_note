import React from 'react';
import { logout } from '../../lib/db_connections'


const LogoutBtn = ({ onLogout }) => (
    <button className="logout-btn" onClick={() => logout(onLogout)}>
        <span className="logout-btn__text">Log out</span>
    </button>
);


export default LogoutBtn;