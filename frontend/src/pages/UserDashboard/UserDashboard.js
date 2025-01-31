import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./UserDashboard.css";
import React, { useState } from "react";
import getWeb3 from "../../handlers/Web3Handler";
import mintTokensABI from "../../abis/MintTokens.json";
import buyCreditsABI from "../../abis/BuyCredits.json";

const contractAddress_mint="0x943833Cdf89029F2e0072B51d35715f51199F171"
const contractAddress_buy="0xDE0f9a2ED86e2bE0Be3e9A7B1fD91e51235426B2";

const GeneratorDashboard=(props)=>{
    const [web3,setWeb3]=useState(null);
    const [userWalletAddress,setUserWalletAddress]=useState("");
    const [contract,setContract]=useState(null);
    const [mintAmount,setMintAmount]=useState(0);
    const [filePath, setFilePath] = useState(null); 
    const [uploadedCID, setUploadedCID] = useState(""); 

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

            const contractInstance = new web3Instance.eth.Contract(mintTokensABI.abi, contractAddress_mint);
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
        
    const handleLogout=()=>{
        props.setIsLoggedIn(false);
        console.log(`Logged out!`);
    }

    const handleFileChange=(e)=>{
        const selectedFile = e.target.files[0];
        console.log(selectedFile);
        setFilePath(selectedFile);
    }

    const handleFileUpload = async () => {
        if(!filePath){
            console.log("Please select a file!");
            return;
        }

        const formData=new FormData();
        formData.append("file",filePath);

        try {
            const response = await fetch("http://localhost:8000/api/upload-image", {
                method: "POST",
                body: formData,
                headers: {
                    // Do not set Content-Type manually; FormData sets it correctly
                    'Accept': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setUploadedCID(data.cid);
            } else {
                const error = await response.json();
                console.log(error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <React.Fragment>
            <div>
                <h1>GENERATOR (FARMER) DASHBOARD</h1>
                
                <button onClick={handleConnectWallet}>Connect Wallet</button>
                <br/>
                <h3>User Ethereum Wallet Address : {userWalletAddress}</h3>
                <br/>

                <input type="file" accept="image/*,video/*,.pdf" onChange={handleFileChange}/>
                <br/>   
                <button type="submit" onClick={handleFileUpload}>Upload Evidence</button>
                <br/>
                
                <input type="number" 
                    placeholder="Enter amount to mint" 
                    value={mintAmount} 
                    onChange={(e)=>setMintAmount(e.target.value)}
                />
                <button onClick={handleMintTokens}>Mint Tokens</button>
                <br/><br/>
                
                <button onClick={handleLogout}>Logout</button>
            </div>
        </React.Fragment>);
}

const ConsumerDashboard=(props)=>{
    const [web3,setWeb3]=useState(null);
    const [userWalletAddress,setUserWalletAddress]=useState("");
    const [contract,setContract]=useState(null);
    const [buyAmount,setBuyAmount]=useState(0);
        
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

            const contractInstance = new web3Instance.eth.Contract(buyCreditsABI.abi, contractAddress_buy);
            setContract(contractInstance);
            console.log('Contract Initialized!', contractInstance);
        }catch(error){
            console.error("Error connecting wallet!");   
        } 
    }
        
    const buyCredits=async()=>{
        if (!web3 || !contract || !userWalletAddress) {
            console.error('Web3, contract, or user wallet not available!');
            return;
        }

        if (buyAmount <= 0) {
            console.error("Please enter a valid mint amount greater than 0.");
            return;
        }

        try{
            const amountInWei = web3.utils.toWei(buyAmount.toString(), "ether");

            await contract.methods.buyTokens(buyAmount).send({
                from: userWalletAddress, // User's wallet address
                value: amountInWei // The Ether sent to purchase the tokens
            });
        
            console.log(`${buyAmount} tokens credited to your wallet!`);
        }catch(error){
            console.error(error.message);
        }
    }
        
    const handleLogout=()=>{
        props.setIsLoggedIn(false);
        console.log("Logged out!");
    }

    return (
        <React.Fragment>
            <div>               
                <h1>CONSUMER DASHBOARD</h1>
                <button onClick={handleConnectWallet}>CONNECT WALLET</button><br/>
                <input type="number"
                 value={buyAmount} 
                 onChange={(e)=>setBuyAmount(e.target.value)}/><button onClick={buyCredits}>BUY</button>
                <br/>
                <input type="number"/><button>SELL</button>
                <br/>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </React.Fragment>);
}

const ValidatorDashboard=(props)=>{
    const [fetchedCID,setFetchedCID]=useState("");

    const handleLogout=()=>{
        props.setIsLoggedIn(false);
        console.log("Logged out!");
    }
        
    const fetchEvidence=(e)=>{
        console.log("clicked!");
    }

    const handleEvidenceChange=(e)=>{
        setFetchedCID(e.target.value);
    }

    const handleVerification=()=>{
        console.log("clicked!");
    }

    return (
        <React.Fragment>
            <div>
                <h1>VALIDATOR (GOVT. DEPT) DASHBOARD</h1>
                
                <input type="text" 
                    placeholder="Enter CID"
                    onChange={handleEvidenceChange}
                    value={fetchedCID}
                />
                <br/>   
                <button onClick={fetchEvidence}>Fetch Evidence</button>
                <br/>
                {fetchedCID && (
                <div>
                    <h3>CID:</h3>
                    <p>{fetchedCID}</p>
                </div>
                )}
                <button onClick={handleVerification}>Verify Evidence</button>
                <br/>
                <h3>Status: </h3>
                <br/>
                
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
                    <Component setIsLoggedIn={setIsLoggedIn}/>
                </div>
                <Footer/>
        </React.Fragment>
    )
}

export default UserDashboard;