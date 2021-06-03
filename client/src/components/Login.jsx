import React, { useEffect, useRef } from 'react';
import GoogleLogin from './buttons/GoogleLogin';
import Cross from './svg/Cross';

const Login = ({ onToggleLoginModal }) => {
    const containerElem = useRef(null)

    useEffect(() => {
        containerElem.current.addEventListener('click', (e) => {
            if(e.target.id === 'login-container') {
                onToggleLoginModal()
            }
        })
        return () => {
            containerElem.current.addEventListener('click', (e) => {
                if(e.target.id === 'login-container') {
                    onToggleLoginModal()
                }
            })
        }
    }, [])

    return (
        <div id='login-container' ref={containerElem} className='login-container'>
            <div className='login-container__login'>
                <button className='login__cross-btn' onClick={onToggleLoginModal}>
                    <Cross/>
                </button>
                <h2 className='login__title'>
                    Log in
                </h2>
                <h3 className='login__description'>
                    Log in to store your notes on the cloud and share them between all your logged in devices.
                </h3>
                <div className='login__oauth'>
                    <GoogleLogin />
                </div>
            </div>
        </div>
    )
};


export default Login;