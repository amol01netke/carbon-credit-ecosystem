import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./UserDashboard.css";
import React, { useState } from "react";
import { useEffect } from "react";
import getWeb3 from "../../handlers/Web3Handler";

const GeneratorDashboard=()=>{
    const [userWalletAddress,setUserWalletAddress]=useState("");
    
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
    //console.log(userType);

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