// Pricing.js
import React from 'react';
import { Topbar } from "./TopBar";

const Pricing = () => {
    return (
        <div className="pricing-page">

            <Topbar />
            <div className="pricing-page" style={{fontSize: "25px", textAlign: "center", alignItems: "center" }}>
                <h2>Welcome to the Pricing Page</h2>
                <p>This is a sample Pricing page content.</p>
            </div>
        </div>

    );
};

export default Pricing;
