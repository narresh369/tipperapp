// About.js
import React from 'react';
import { Topbar } from "./TopBar";
import Footer from "./Footer";
const About = () => {
    return (
        <>
            <div className="about-page">
                <Topbar />
                <div style={{ marginTop: "30px", fontSize: "20px", textAlign: "center", alignItems: "center" }}>
                    <h2>About Us</h2>
                    <img src="logo2.png" style={{ height: '200px', width: '250px', textAlign: "center", alignItems: "center", marginTop: "20px", marginBottom: "20px" }} alt="Logo" className="logo" />
                    <div style={{
                        fontSize: "20px", textAlign: "center", alignItems: "center",
                        padding: "10px",
                        border: "1px solid lime",
                        borderRadius: "10px",
                        backgroundColor: "pink",
                        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        color: "black",
                        fontSize: "15px",
                        textAlign: "left",
                    }}>
                        <p style={{ marginLeft: "10px" }}
                        >Door No : 1-22-2</p>
                        <p style={{ marginLeft: "10px" }}
                        >Plot No : 155, Sector : 6</p>
                        <p style={{ marginLeft: "10px" }}
                        >MVP Colony</p>
                        <p style={{ marginLeft: "10px" }}
                        >Opposite Indoor Stadium</p>
                        <p style={{ marginLeft: "10px" }}
                        >Visakhapatnam</p>
                        <p style={{ marginLeft: "10px" }}
                        >Pin : 530017</p>
                        <p style={{ marginLeft: "10px" }}
                        >Mob : +91 9949 123456</p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default About;
