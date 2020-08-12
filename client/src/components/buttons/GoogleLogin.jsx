import React from 'react';
import GoogleLogo from '../svg/GoogleLogo';

const GoogleLogin = () => (
    <a className="google-btn" href="/auth/google">
        <span className="google-btn__logo"><GoogleLogo /></span>
        <div className="google-btn__text"><div className="css-f04y3h">Log in with Google</div></div>
    </a>
)

export default GoogleLogin;