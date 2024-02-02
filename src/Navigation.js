// components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from './routes'; // Assuming you have a routes file

const Navigation = () => {
    return (
        <nav>
            <ul>
                {routes.map((route, index) => (
                    <li key={index}>
                        <Link to={route.path}>
                            {route.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navigation;
