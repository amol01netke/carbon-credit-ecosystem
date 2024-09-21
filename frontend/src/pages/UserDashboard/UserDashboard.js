import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./UserDashboard.css";
import React from "react";

const Generator=()=>{
    return (
        <React.Fragment>
            <div className="generator">
                Generator
            </div>
        </React.Fragment>);
}

const Consumer=()=>{
    return (
    <React.Fragment>
        <div className="consumer">
            Consumer
        </div>
    </React.Fragment>);
}

const Validator=()=>{
    return (
    <React.Fragment>
        <div className="validator">               
            Validator
        </div>
    </React.Fragment>);
}

const Unknown=()=>{
    return (
    <React.Fragment>
        <div className="unkown">               
            Unkown User Type
        </div>
    </React.Fragment>);
}

const UserDashboard=(props)=>{
    const {userType}=props.location.state;

    let Component;
    switch(userType){
        case "generator":
            Component=Generator;
            break;
        case "consumer":
            Component=Consumer;
            break;
        case "validator":
            Component=Validator;
            break;
        default:
            Component=Unknown;
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