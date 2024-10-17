import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./UserDashboard.css";
import React from "react";

const GeneratorDashboard=()=>{
    return (
    <React.Fragment>
        <div>
            <h1>GENERATOR DASHBOARD</h1>
        </div>
    </React.Fragment>);
}

const ConsumerDashboard=()=>{
    return (
    <React.Fragment>
        <div>               
            <h1>CONSUMER DASHBOARD</h1>
        </div>
    </React.Fragment>);
}

const ValidatorDashboard=()=>{
    return (
    <React.Fragment>
        <div className="validator">               
            <h1>VALIDATOR DASHBOARD</h1>
        </div>
    </React.Fragment>);
}


const UserDashboard=(props)=>{
    const {userType}=props.location.state;

    let Component;
    switch(userType){
        case "generator":
            Component=GeneratorDashboard;
            break;

        case "consumer":
            Component=ConsumerDashboard;
            break;
        
        case "validator":
            Component=ValidatorDashboard;
            break;
        
        default:
            break;
    }

    return (
        <React.Fragment>
            <Header/>
            <div className="user-dashboard">
                <Component/>
            </div>
            <Footer/>
        </React.Fragment>
    )
}

export default UserDashboard;