import React from 'react';

const SecondaryBtn = ({ text, onClick }) => (
    <button onClick={onClick} className="secondary-btn">
        <span className="secondary-btn__text">{text}</span>
    </button>
);


export default SecondaryBtn;