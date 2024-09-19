import "./FarmerDashboard.css";
import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const FarmerDashboard=()=>{
    return (
    <React.Fragment>
        <Header/>
        <div className="farmer-dashboard">
            <h1>Farmer Dashboard</h1>
        </div>
        <Footer/>
    </React.Fragment>);
}

export default FarmerDashboard;