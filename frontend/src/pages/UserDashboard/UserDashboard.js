import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./UserDashboard.css";
import React, { useState, useEffect} from "react";
import getWeb3 from "../../handlers/Web3Handler";
import mintTokensABI from "../../abis/MintTokens.json";
import buyCreditsABI from "../../abis/BuyCredits.json";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import {useWallet} from "../../context/WalletContext";

const contractAddress_mint="0xF9F87DEaB7f7CAf4aC94015F884582831f279cCA";
const contractAddress_buy="0xDE0f9a2ED86e2bE0Be3e9A7B1fD91e51235426B2";

const GeneratorDashboard=(props)=>{
    const [web3,setWeb3]=useState(null);
    const {userWalletAddress,setUserWalletAddress}=useWallet();
    const [contract,setContract]=useState(null);
    const [mintAmount,setMintAmount]=useState(0);
    const [filePath, setFilePath] = useState(null); 
    const [uploadedCID, setUploadedCID] = useState("");
    const [sequestrationType,setSequestrationType]=useState("afforestation");

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
            <h3>User Ethereum Wallet Address : {userWalletAddress}</h3>
                
                
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

                {/*wallet connection*/}
                <br/><br/>
                <button onClick={handleConnectWallet}>Connect Wallet</button>
                
                {/*token transfer*/}
                <br/><br/>
                <input type="number"
                 value={buyAmount} 
                 onChange={(e)=>setBuyAmount(e.target.value)}/>
                <br/>
                <button onClick={buyCredits}>Buy</button>
                
                {/*logout*/}
                <br/><br/>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </React.Fragment>);
}

const ValidatorDashboard=(props)=>{
    const [jsonInput, setJsonInput] = useState("");
    const [genAddress,setGenAddress]=useState("");
    const [creditAmount, setCreditAmount] = useState(0);  
    const [web3,setWeb3]=useState(null);
    const [validatorAddress,setValidatorAddress]=useState(null);
    const [contract,setContract]=useState(null);
    const [fetchedCID, setFetchedCID] = useState("");

    //fetch and verify the evidence
    const fetchAndVerifyEvidence=async(cid)=>{
        try{
            const response = await fetch(`http://localhost:8000/api/fetch-user-evidence/${cid}`, {
                method: "GET"
            });

            const data = await response.json();
            
            if (response.ok && data.status==="OK") {
                console.log("Evidence is verified.. now let us allot tokens to generator !",data);
            } else {
                console.error("Evidence is not proper !",data);
            }
        }catch(error){
            console.error("Error while fetching !",error);
        }
    }

    //check if any file is uploaded in the server
    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");

        socket.onopen = () => {
            console.log("Connected to WebSocket server!");
        };

        socket.onmessage = async(event) => {
            const data = JSON.parse(event.data);
            console.log("New Evidence Received:", data);
            setFetchedCID(data.cid);
            
            //fetch the pdf and verify it
            await fetchAndVerifyEvidence(data.cid);
        };

        socket.onclose = () => {
            console.log("WebSocket Disconnected");
        };

        return () => {
            socket.close();
        };
    }, []);

    const handleLogout=()=>{
        props.setIsLoggedIn(false);
        console.log("Logged out!");
    }

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

            const contractInstance = new web3Instance.eth.Contract(mintTokensABI.abi, contractAddress_mint);
            setContract(contractInstance);
            console.log('Contract Initialized!', contractInstance);
        }catch(error){
            console.error("Error connecting wallet!");   
        } 
    }

    return (
        <React.Fragment>
            <div>
                <h1>VALIDATOR DASHBOARD</h1>
                
                {/*wallet connection*/}
                <br/><br/>
                <button onClick={handleConnectWallet}>Connect Wallet</button>
                
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
    );
}

export default UserDashboard;