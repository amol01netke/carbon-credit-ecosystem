import "./UserRegistration.css";
import React from "react";
import { useState,useEffect } from "react";
import getWeb3 from "../../handlers/Web3Handler";

const GeneratorRegistration=()=>{
    return (
    <React.Fragment>
        <h1>GENERATOR REGISTRATION</h1>
        <form className="registration-form">
            <input className="form-ip" type="email" placeholder="Email"/>
            <input className="form-ip" type="text" placeholder="Ethereum Wallet Address"/>      
            <input className="form-ip" type="username" placeholder="Username"/>
            <input className="form-ip" type="password" placeholder="Password"/>
            <input className="form-submit" type="submit" value="Register"/>
        </form>
    </React.Fragment>);
}

const ConsumerRegistration=()=>{
    return (
    <React.Fragment>
        <h1>CONSUMER REGISTRATION</h1>
        <form className="registration-form">
            <input className="form-ip" type="email" placeholder="Email"/>
            <input className="form-ip" type="text" placeholder="Ethereum Wallet Address"/>      
            <input className="form-ip" type="username" placeholder="Username"/>
            <input className="form-ip" type="password" placeholder="Password"/>
            <input className="form-submit" type="submit" value="Register"/>
        </form>
    </React.Fragment>);
}

const ValidatorRegistration=()=>{
    return (
    <React.Fragment>
        <h1>VALIDATOR REGISTRATION</h1>
        <form className="registration-form">
            <input className="form-ip" type="email" placeholder="Email"/>
            <input className="form-ip" type="text" placeholder="Ethereum Wallet Address"/>      
            <input className="form-ip" type="username" placeholder="Username"/>
            <input className="form-ip" type="password" placeholder="Password"/>
            <input className="form-submit" type="submit" value="Register"/>
        </form>
    </React.Fragment>);
}

const UserRegistration=(props)=>{
    const [userWalletAddress,setUserWalletAddress]=useState("");

    //first hook to run
    useEffect(()=>{
        const initializeWeb3=async()=>{
            try{
                const web3=await getWeb3();
                console.log('Web 3 initialized!',web3);

                const accounts = await web3.eth.getAccounts();

                if (accounts.length > 0) {
                    setUserWalletAddress(accounts[0]);
                    console.log(`Connected Wallet Address: ${accounts[0]}`);
                }
            }catch(error){
                console.error(`Falied to initialize Web 3!`,)
            }
        };

        initializeWeb3();
    },[]);

    const {userType}=props.location.state;

    let Component;
    switch(userType){
        case "generator":
            Component=GeneratorRegistration;
            break;
        
        case "consumer":
            Component=ConsumerRegistration;
            break;
        
        case "validator":
            Component=ValidatorRegistration;
            break;
    }

    return (
    <React.Fragment>
        <div className="user-registration">
            <Component/>
        </div>
    </React.Fragment>);
}

export default UserRegistration;
