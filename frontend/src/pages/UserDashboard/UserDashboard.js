import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./UserDashboard.css";
import React, { useState } from "react";
import { useEffect } from "react";
import getWeb3 from "../../handlers/Web3Handler";
import mintTokensABI from "../../abis/mintTokens.json";

const contractAddress="";

const GeneratorDashboard=()=>{
    const [web3,setWeb3]=useState(null);
    const [userWalletAddress,setUserWalletAddress]=useState("");
    const [contract,setContract]=useState(null);
    const [mintAmount,setMintAmount]=useState(0);
    
    useEffect(()=>{
        const initializeWeb3=async()=>{
            try{
                const web3Instance=await getWeb3();
                setWeb3(web3Instance);
                console.log(web3Instance);
            }catch(error){
                console.error(error.message);
            }
        }

        initializeWeb3();
    },[]);

    const handleConnectWallet=async()=>{
        if(!web3){
            console.error('Web 3 is not initialized yet!');
            return;
        }

        try{
            const accounts = await web3.eth.getAccounts();

            if (accounts.length > 0) {
                setUserWalletAddress(accounts[0]);
                console.log(`Connected Wallet Address: ${accounts[0]}`);

                if(contractAddress){
                    const contractInstance = new web3.eth.Contract(mintTokensABI.abi, contractAddress);
                    setContract(contractInstance);
                }else{
                    console.error('Contract addresss is not defined!');
                }
            }else {
                console.error('Please ensure MetaMask is unlocked!');
            }
        }catch(error){
            console.error(error.message);
        }
    }
    
    const handleMintTokens=async()=>{
        if (!web3 || !contract || !userWalletAddress) {
            console.error('Web3, contract, or user wallet not available!');
            return;
        }

        try{
            const networkId=await web3.eth.net.getId();
            const deployedNetwork=mintTokensABI.networks[networkId];
            const contract=new web3.eth.Contract(mintTokensABI.abi, deployedNetwork.address);

            await contract.methods.mint(mintAmount).send({
                from: userWalletAddress,
                value: web3.utils.toWei((mintAmount * 0.01).toString(), "ether") // Sending Ether based on token price
            });
            
            console.log(`${mintAmount} tokens minted!`);
        }catch(error){
            console.error(error.message);
        }
    }
    
    return (
    <React.Fragment>
        <div>
            <h1>GENERATOR DASHBOARD</h1>
            <br></br>
            <button onClick={handleConnectWallet}>Connect Wallet</button>
            <h3>User Ethereum Wallet Address : {userWalletAddress}</h3>
            <br></br>
            <input type="number" 
                placeholder="Enter amount to mint" 
                value={mintAmount} 
                onChange={(e)=>setMintAmount(e.target.value)}
            />
            <button onClick={handleMintTokens}Mint Tokens>Mint Tokens</button>
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