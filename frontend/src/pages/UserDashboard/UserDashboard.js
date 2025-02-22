import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./UserDashboard.css";
import React, { useState } from "react";
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
    const [fetchedCID,setFetchedCID]=useState("");
    const [jsonInput, setJsonInput] = useState("");
    const [genAddress,setGenAddress]=useState("");
    const [creditAmount, setCreditAmount] = useState(0);  
    const [web3,setWeb3]=useState(null);
    const [validatorAddress,setValidatorAddress]=useState(null);
    const [contract,setContract]=useState(null);

    const handleLogout=()=>{
        props.setIsLoggedIn(false);
        console.log("Logged out!");
    }
        
    const fetchLatestEvidence = async () => {
        if (!fetchedCID) {
            console.log("Please enter a CID");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8000/api/get-evidence/${fetchedCID}`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                }
            });
    
            
            const data = await response.json();
            console.log(data.walletAddress);
            setGenAddress(data.walletAddress);
            console.log(genAddress);
            
            const fileContent=data.fileContent;
            // Create a Blob from JSON
            const blob = new Blob([JSON.stringify(fileContent, null, 2)], { type: "application/json" });
    
            // Create a URL for the Blob
            const downloadUrl = URL.createObjectURL(blob);
    
            // Create an anchor element for downloading
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = `${fetchedCID}.json`; // Name file as CID.json
            document.body.appendChild(a);
            a.click(); // Trigger download
            document.body.removeChild(a); // Cleanup
    
            // Free up memory
            URL.revokeObjectURL(downloadUrl);
    
            console.log("JSON file downloaded successfully!");
    
        } catch (error) {
            console.error("Error fetching evidence:", error.message);
        }
    }

    const handleEvidenceChange=(e)=>{
        setFetchedCID(e.target.value);
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
       
    const handleVerification=async()=>{
       console.log("clicked!");

        try {
            
            const parsedData = JSON.parse(jsonInput); // Parse JSON content

            //credit calculation
            if (!parsedData.soil_tests || parsedData.soil_tests.length < 2) {
                alert("Invalid JSON format. At least two soil test records required.");
                return;
            }
    
            // Extract latest and previous carbon content
            const latestCarbon = parseFloat(parsedData.soil_tests[0].carbon_content);
            const prevCarbon = parseFloat(parsedData.soil_tests[1].carbon_content);
    
            // Calculate credits (100 per 1% increase)
            const totalCredits = Math.max(0, Math.round((latestCarbon - prevCarbon) * 100));
    
            setCreditAmount(totalCredits); // Update state
            console.log(`Allotting ${creditAmount} credits...`);
            
            try{
                await contract.methods.mint(creditAmount).send({
                    from: genAddress,
                    value: web3.utils.toWei((creditAmount * 0.01).toString(), "ether")
                });
                        
                console.log(`${creditAmount} tokens alloted!`);
            }catch(error){
                console.error(error.message);
            }
        }
        catch (error) {
            console.error("Error verifying evidence:", error);
            alert("Verification failed. Invalid JSON format.");
        }
    }

    return (
        <React.Fragment>
            <div>
                <h1>VALIDATOR DASHBOARD</h1>
                
                {/*wallet connection*/}
                <br/><br/>
                <button onClick={handleConnectWallet}>Connect Wallet</button>
                
                {/*fetch evidence
                <br/><br/>
                <input type="text" 
                    placeholder="Enter CID"
                    onChange={handleEvidenceChange}
                    value={fetchedCID}
                />
                <br/>   
                <button onClick={fetchEvidence}>Fetch Evidence</button>*/}
                
                {/*verify evidence*/}
                <br/><br/>
                {fetchedCID && (
                <div>
                    <h3>CID:</h3>
                    <p>{fetchedCID}</p>
                </div>
                )}
                <textarea
                    rows="5"
                    placeholder="Paste JSON content here..."
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                ></textarea>

                {/*approval status*/}
                <br/><br/>   
                <button onClick={handleVerification}>Verify Evidence</button>
                <br/>
                <h3>Status: </h3>
                
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