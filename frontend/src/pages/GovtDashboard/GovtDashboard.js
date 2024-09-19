import "./GovtDashboard.css";
import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const GovtDashboard=()=>{
    return (
    <React.Fragment>
        <Header/>
        <div className="govt-dashboard">
            <h1>Govt Dashboard</h1>
        </div>
        <Footer/>
    </React.Fragment>);
}

export default GovtDashboard;