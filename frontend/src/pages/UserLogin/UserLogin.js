import "./UserLogin.css";
import React from "react";

const GeneratorLogin=()=>{
    return (
    <React.Fragment>
        <h1>GENERATOR LOGIN</h1>
        <form className="login-form">        
            <input className="form-ip" type="username" placeholder="Username"/>
            <input className="form-ip" type="password" placeholder="Password"/>
            <input className="form-submit" type="submit" value="Login"/>
        </form>
    </React.Fragment>);
}

const ConsumerLogin=()=>{
    return (
    <React.Fragment>
        <h1>CONSUMER LOGIN</h1>
        <form className="login-form">        
            <input className="form-ip" type="username" placeholder="Username"/>
            <input className="form-ip" type="password" placeholder="Password"/>
            <input className="form-submit" type="submit" value="Login"/>
        </form>
    </React.Fragment>);
}

const ValidatorLogin=()=>{
    return (
    <React.Fragment>
        <h1>VALIDATOR LOGIN</h1>
        <form className="login-form">        
            <input className="form-ip" type="username" placeholder="Username"/>
            <input className="form-ip" type="password" placeholder="Password"/>
            <input className="form-submit" type="submit" value="Login"/>
        </form>
    </React.Fragment>);
}

const UserLogin=(props)=>{
    const {userType}=props.location.state;

    let Component;
    switch(userType){
        case "generator":
            Component=GeneratorLogin;
            break;
        
        case "consumer":
            Component=ConsumerLogin;
            break;
        
        case "validator":
            Component=ValidatorLogin;
            break;
    }

    return (
    <React.Fragment>
        <div className="user-login">
            <Component/>
        </div>
    </React.Fragment>);
}

export default UserLogin;