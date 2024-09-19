import "./IndustryDashboard.css";
import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const IndustryDashboard=()=>{
    return (
    <React.Fragment>
        <Header/>
        <div className="industry-dashboard">
            <h1>Industry Dashboard</h1>
        </div>
        <Footer/>
    </React.Fragment>);
}

export default IndustryDashboard;