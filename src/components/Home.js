// Home.js
import React from 'react';
import { Topbar } from "./TopBar";
import Footer from "./Footer";
import './Home.css'; // Import your CSS file for styling

const Home = () => {
    return (
        <>
            <Topbar />
            <div className="home-page">
                <div className="home-content">
                    <h2 style={{ color: "white" }}>Welcome to Tipper Services</h2>
                    <img src="logo2.png" alt="Logo" className="logo" />
                    <div className="content-container">
                        <p>
                            These services play a crucial role in various industries, particularly in construction, mining, and waste management.
                        </p>
                        <p>
                            Tippers are designed to carry and transport materials such as sand, gravel, soil, rocks, or debris from one location to another.
                        </p>
                        <p>
                            Here are a few key aspects of our tipper services:
                        </p>
                        <ul>
                            <li>👉 Material Transportation.</li>
                            <li>👉 Construction Industry.</li>
                            <li>👉 Mining and Quarrying.</li>
                            <li>👉 Waste Management.</li>
                            <li>👉 Efficiency & Productivity with Safety Considerations.</li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Home;
