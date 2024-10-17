import "./UserRegistration.css";
import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const registerGenerator=()=>{
    console.log("registering generator...");
    return true;
}

const registerConsumer=()=>{
    console.log("registering consumer...");
    return true;
}

const registerValidator=()=>{
    console.log("registering validator...");
    return true;
}

const GeneratorRegistration=()=>{
    return (
    <React.Fragment>
        <h1>GENERATOR REGISTRATION</h1>
        <form className="registration-form" onSubmit={registerGenerator}>
            <input className="form-ip" type="email" placeholder="Email"/>
            <input className="form-ip" type="text" placeholder="Ethereum Wallet Address"/>      
            <input className="form-ip" type="username" placeholder="Username"/>
            <input className="form-ip" type="password" placeholder="Password"/>
        </form>
    </React.Fragment>);
}

const ConsumerRegistration=()=>{
    return (
    <React.Fragment>
        <h1>CONSUMER REGISTRATION</h1>
        <form className="registration-form" onSubmit={registerConsumer}>
            <input className="form-ip" type="email" placeholder="Email"/>
            <input className="form-ip" type="text" placeholder="Ethereum Wallet Address"/>      
            <input className="form-ip" type="username" placeholder="Username"/>
            <input className="form-ip" type="password" placeholder="Password"/>
        </form>
    </React.Fragment>);
}

const ValidatorRegistration=()=>{
    return (
    <React.Fragment>
        <h1>VALIDATOR REGISTRATION</h1>
        <form className="registration-form" onSubmit={registerValidator}>
            <input className="form-ip" type="email" placeholder="Email"/>
            <input className="form-ip" type="text" placeholder="Ethereum Wallet Address"/>      
            <input className="form-ip" type="username" placeholder="Username"/>
            <input className="form-ip" type="password" placeholder="Password"/>
        </form>
    </React.Fragment>);
}

const UserRegistration=(props)=>{
    const {userType}=props.location.state;
    const {setIsLoggedIn, setUserType}=props;

    //for App
    setUserType(userType);

    let Component;
    let handleRegistration;
    switch(userType){
        case "generator":
            Component=GeneratorRegistration;
            handleRegistration=registerGenerator;
            break;
        
        case "consumer":
            Component=ConsumerRegistration;
            handleRegistration=registerConsumer;
            break;
        
        case "validator":
            Component=ValidatorRegistration;
            handleRegistration=registerValidator;
            break;
        
        default:
            break;
    }

    const handleClick=()=>{
        if(handleRegistration()){
            setIsLoggedIn(true);
            props.history.push({
                pathname:'/user-dashboard',
                state:{userType}
            });
        }else{
            alert("Registration Failed!");
        }
    }

    return (
    <React.Fragment>
        <div className="user-registration">
            <Component/>
            <Link 
                to={{
                pathname:'/user-dashboard',
                state:{userType}
                }}
            >
                <button className="form-submit" onClick={handleClick}>Register</button>
            </Link>
        </div>
    </React.Fragment>);
}

export default UserRegistration;
