import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "./UserLogin.css";
import React from "react";

const loginGenerator=()=>{
    console.log("Logging in as generator...");
    return true;
}

const loginConsumer=()=>{
    console.log("Logging in as consumer...");
    return true;
}

const loginValidator=()=>{
    console.log("Logging in as validator...");
    return true;
}

const GeneratorLogin=()=>{
    return (
    <React.Fragment>
        <h1>GENERATOR LOGIN</h1>
        <form className="login-form">        
            <input className="form-ip" name="username" type="username" placeholder="Username"/>
            <input className="form-ip" name="password" type="password" placeholder="Password"/>
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
        </form>
    </React.Fragment>);
}

const UserLogin=(props)=>{
    const {userType}=props.location.state;
    const {setIsLoggedIn,setUserType}=props;

    //for App component
    setUserType(userType);

    let Component;
    let handleLogin;
    switch(userType){
        case "generator":
            Component=GeneratorLogin;
            handleLogin=loginGenerator;
            break;
        
        case "consumer":
            Component=ConsumerLogin;
            handleLogin=loginConsumer;
            break;
        
        case "validator":
            Component=ValidatorLogin;
            handleLogin=loginValidator;
            break;
        
        default:
            break;
    }

    const handleClick=()=>{
        if(handleLogin()){
            setIsLoggedIn(true);
            props.history.push({
                pathname:'/user-dashboard',
                state:{userType}
            });
        }else{
            alert("Login Failed!");
        }
    }

    return (
    <React.Fragment>
        <div className="user-login">
            <Component/>
            <Link 
                to={{
                pathname:'/user-dashboard',
                state:{userType}
                }}
            >
                <button className="form-submit" onClick={handleClick}>Login</button>
            </Link>
        </div>
    </React.Fragment>);
}

export default UserLogin;