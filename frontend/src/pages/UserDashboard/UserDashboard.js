    import Footer from "../../components/Footer/Footer";
    import Header from "../../components/Header/Header";
    import "./UserDashboard.css";
    import React, { useState } from "react";
    import getWeb3 from "../../handlers/Web3Handler";
    import mintTokensABI from "../../abis/MintTokens.json";

    const contractAddress="0x7e3Df9928D4eDE1AC57c983260b54797064235Cd";

    const GeneratorDashboard=()=>{
        const [web3,setWeb3]=useState(null);
        const [userWalletAddress,setUserWalletAddress]=useState("");
        const [contract,setContract]=useState(null);
        const [mintAmount,setMintAmount]=useState(0);

        const handleConnectWallet=async()=>{
            try{
                const web3Instance=await getWeb3();
                
                if(web3Instance){
                    setWeb3(web3Instance);
                    console.log('Web3 initialized!',web3Instance);
                }else{
                    console.error('Failed to initialize Web3!');
                    return;
                }
               
                const accounts = await web3Instance.eth.getAccounts();
                if (accounts.length > 0){
                    setUserWalletAddress(accounts[0]);
                    console.log(`Connected Wallet Address: ${accounts[0]}`);
                }else{
                    console.error('No accounts found!');
                    return;
                }

                const contractInstance = new web3Instance.eth.Contract(mintTokensABI.abi, contractAddress);
                setContract(contractInstance);
                console.log('Contract Initialized!', contractInstance);
            }catch(error){
                console.error("Error connecting wallet!");   
            } 
        }
        
        const handleMintTokens=async()=>{
            if (!web3 || !contract || !userWalletAddress) {
                console.error('Web3, contract, or user wallet not available!');
                return;
            }

            if (mintAmount <= 0) {
                console.error("Please enter a valid mint amount greater than 0.");
                return;
            }

            try{
                await contract.methods.mint(mintAmount).send({
                    from: userWalletAddress,
                    value: web3.utils.toWei((mintAmount * 0.01).toString(), "ether")
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
                <button onClick={handleMintTokens}>Mint Tokens</button>
            </div>
        </React.Fragment>);
    }

    const ConsumerDashboard=()=>{
        const handleConnectWallet=()=>{
            console.log('clicked!');
        }

        return (
        <React.Fragment>
            <div>               
                <h1>CONSUMER DASHBOARD</h1>
                <button onClick={handleConnectWallet}>CONNECT WALLET</button><br/>
                <input type="number"/><button>BUY</button>
                <br/>
                <input type="number"/><button>SELL</button>
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