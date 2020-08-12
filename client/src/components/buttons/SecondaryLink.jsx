import React from 'react';
import { Link } from 'react-router-dom';

const SecondaryLink = ({ text, path }) => (
    <Link to={path} className="secondary-link">
        <span className="secondary-link__text">{text}</span>
    </Link>
);


export default SecondaryLink;