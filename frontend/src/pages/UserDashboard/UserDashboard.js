import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./UserDashboard.css";
import React, { useState, useEffect} from "react";
import getWeb3 from "../../handlers/Web3Handler";
import mintTokensABI from "../../abis/MintTokens.json";
import buyCreditsABI from "../../abis/BuyCredits.json";
import sendTokensABI from "../../abis/SendTokens.json";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import {useWallet} from "../../context/WalletContext";

// const contractAddress_mint="0xF9F87DEaB7f7CAf4aC94015F884582831f279cCA";
// const contractAddress_buy="0xDE0f9a2ED86e2bE0Be3e9A7B1fD91e51235426B2";

const GeneratorDashboard=(props)=>{
    const [web3,setWeb3]=useState(null);
    const {generatorAddress,setGeneratorAddress}=useWallet();
    const [sequestrationType,setSequestrationType]=useState("afforestation");

    //wallet connection
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
                setGeneratorAddress(accounts[0]);
                console.log(`Connected Wallet Address: ${accounts[0]}`);
            }else{
                console.error('No accounts found!');
                return;
            }
        }catch(error){
            console.error("Error connecting wallet!");   
        } 
    }
        
    //logout
    const handleLogout=()=>{
        props.setIsLoggedIn(false);
        console.log(`Logged out!`);
    }
    
    return (
    <React.Fragment>
        <div>
            <h1>GENERATOR DASHBOARD</h1>
                
            {/*wallet connection*/}
            <br/><br/>
            <button onClick={handleConnectWallet}>Connect Wallet</button>
            <br/>
            <h3>Wallet Address : {generatorAddress}</h3>
                
                
            {/*evidence upload*/}
            <br/><br/>
            <h3>Select Carbon Sequestration Method</h3>
            <select className="select-project-type" onChange={(e)=>setSequestrationType(e.target.value)}>
                <option value="afforestation">Afforestation</option>
                <option value="renewable-energy">Renewable Energy</option>
                <option value="soil-carbon-sequestration">Soil Carbon Sequestration</option>
            </select>  
            <br/>
            <Link 
                to={{
                    pathname:'/user-evidence',
                    state:{sequestrationType}
                }}
            >
                <button>Proceed</button>
            </Link>
            
            {/*logout*/}    
            <br/><br/>
            <button onClick={handleLogout}>Logout</button>
        </div>
    </React.Fragment>
    );
}

// const ConsumerDashboard=(props)=>{
//     const [web3,setWeb3]=useState(null);
//     const [userWalletAddress,setUserWalletAddress]=useState("");
//     const [contract,setContract]=useState(null);
//     const [buyAmount,setBuyAmount]=useState(0);
        
//     const handleConnectWallet=async()=>{
//         try{
//             const web3Instance=await getWeb3();
                
//             if(web3Instance){
//                 setWeb3(web3Instance);
//                 console.log('Web3 initialized!',web3Instance);
//             }else{
//                 console.error('Failed to initialize Web3!');
//                 return;
//             }
               
//             const accounts = await web3Instance.eth.getAccounts();
//             if (accounts.length > 0){
//                 setUserWalletAddress(accounts[0]);
//                 console.log(`Connected Wallet Address: ${accounts[0]}`);
//             }else{
//                 console.error('No accounts found!');
//                 return;
//             }

//             const contractInstance = new web3Instance.eth.Contract(buyCreditsABI.abi, contractAddress_buy);
//             setContract(contractInstance);
//             console.log('Contract Initialized!', contractInstance);
//         }catch(error){
//             console.error("Error connecting wallet!");   
//         } 
//     }
        
//     const buyCredits=async()=>{
//         if (!web3 || !contract || !userWalletAddress) {
//             console.error('Web3, contract, or user wallet not available!');
//             return;
//         }

//         if (buyAmount <= 0) {
//             console.error("Please enter a valid mint amount greater than 0.");
//             return;
//         }

//         try{
//             const amountInWei = web3.utils.toWei(buyAmount.toString(), "ether");

//             await contract.methods.buyTokens(buyAmount).send({
//                 from: userWalletAddress, // User's wallet address
//                 value: amountInWei // The Ether sent to purchase the tokens
//             });
        
//             console.log(`${buyAmount} tokens credited to your wallet!`);
//         }catch(error){
//             console.error(error.message);
//         }
//     }
        
//     const handleLogout=()=>{
//         props.setIsLoggedIn(false);
//         console.log("Logged out!");
//     }

//     return (
//         <React.Fragment>
//             <div>               
//                 <h1>CONSUMER DASHBOARD</h1>

//                 {/*wallet connection*/}
//                 <br/><br/>
//                 <button onClick={handleConnectWallet}>Connect Wallet</button>
                
//                 {/*token transfer*/}
//                 <br/><br/>
//                 <input type="number"
//                  value={buyAmount} 
//                  onChange={(e)=>setBuyAmount(e.target.value)}/>
//                 <br/>
//                 <button onClick={buyCredits}>Buy</button>
                
//                 {/*logout*/}
//                 <br/><br/>
//                 <button onClick={handleLogout}>Logout</button>
//             </div>
//         </React.Fragment>);
// }

const ValidatorDashboard=(props)=>{
    const [web3,setWeb3]=useState(null);
    const [validatorAddress,setValidatorAddress]=useState(null); 
    const {generatorAddress}=useWallet();
       
    //wallet connection
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
                setValidatorAddress(accounts[0]);
                console.log(`Connected Wallet Address: ${accounts[0]}`);
            }else{
                console.error('No accounts found!');
                return;
            }
        }catch(error){
            console.error("Error connecting wallet!");   
        } 
    }
    
    //send tokens to generator
    const sendTokens=async(generatorAddress, tokenAmount)=>{
        if (!web3 || !validatorAddress) {
            console.error("Web3 or validator address is not initialized!");
            return;
        }
    
        const contractAddress = "0x205Cc4e87A3A66e5465c665C0c41586572DBAaCc"; // Replace with your actual contract address
        const abi = [  // Contract ABI (Generated after deploying)
            {
                "inputs": [
                    { "internalType": "address", "name": "recipient", "type": "address" },
                    { "internalType": "uint256", "name": "amount", "type": "uint256" }
                ],
                "name": "sendTokens",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ];
    
        try {
            const contract = new web3.eth.Contract(sendTokensABI, contractAddress);
    
            // Call sendTokens function from smart contract
            await contract.methods.sendTokens(generatorAddress, tokenAmount).send({ from: "0x68439c463650d124b1d820f270b521AdB70D2695" });
    
            console.log(`✅ Sent ${tokenAmount} tokens to Generator: ${generatorAddress}`);
        } catch (error) {
            console.error("❌ Error sending tokens:", error);
        }
    }

    //verify evidence
    const verifyEvidence=async(cid)=>{
        try{
            const response = await fetch(`http://localhost:8000/api/verify-evidence/${cid}`, {
                method: "GET"
            });

            const data = await response.json();
            
            if (response.ok && data.status==="OK") {
                console.log(data);
                sendTokens(data.tokens);
            } else {
                console.error("Evidence is not proper !",data);
            }
        }catch(error){
            console.error("Error while fetching !",error);
        }
    }

    //logout
    const handleLogout=()=>{
        props.setIsLoggedIn(false);
        console.log("Logged out!");
    }

    //WebSocket for real-time evidence updates
    useEffect(() => {
        const initializeWebSocket = async () => {
            await handleConnectWallet();

            const socket = new WebSocket("ws://localhost:8080");
            socket.onmessage = async (event) => {
                const data = JSON.parse(event.data);
                await verifyEvidence(data.cid);
            };
            
            socket.onclose = () => console.log("WebSocket Disconnected");
        };
        initializeWebSocket();
    }, []);

    return (
        <React.Fragment>
            <div>
                <h1>VALIDATOR DASHBOARD</h1>
                
                {/*wallet connection*/}
                <br/><br/>
                <button onClick={handleConnectWallet}>Connect Wallet</button>
                <br/>
                <h3>Wallet Address : {validatorAddress}</h3>
            
                {/*fetch evidence - verify evidence -  allocate tokens*/}

                {/*logout*/}
                <br/><br/>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </React.Fragment>);
}

const UserDashboard=(props)=>{
    const {userType}=props.location.state;
    const {setIsLoggedIn}=props;
  
    let Component;
    switch(userType){
        case "generator":
            Component=GeneratorDashboard;
            break;

        // case "consumer":
        //     Component=ConsumerDashboard;
        //     break;
            
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
                <Component setIsLoggedIn={setIsLoggedIn}/>
            </div>
        <Footer/>
    </React.Fragment>
    );
}

export default UserDashboard;