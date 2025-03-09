import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./UserDashboard.css";
import React, { useState, useEffect} from "react";
import getWeb3 from "../../handlers/Web3Handler";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import {useWallet} from "../../context/WalletContext";
import MultiValidatorABI from "../../../src/abis/MutliValidator.json";

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
            <h3>Select Sequestration Method</h3>
            <select className="select-project-type" onChange={(e)=>setSequestrationType(e.target.value)}>
                <option value="afforestation">Afforestation</option>
                <option value="soil-sequestration">Soil Sequestration</option>
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
    const [evidenceType, setEvidenceType]=useState(""); 
    const [reportCID,setReportCID]=useState("");    
    const [showIframe, setShowIframe] = useState(false);
    const [VerificationStatus, setVerificationStatus]=useState("Not Verified");
    const [isEvidenceVerified, setIsEvidenceVerified]=useState(false);
    const [sequestrationTons, setSequestrationTons]=useState("");
    const [approvalStatus, setApprovalStatus] = useState("Not Approved");
    
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

    //view soil evidence
    const viewSoilEvidence =async () => {
        setTimeout(() => {
            setShowIframe(true);
        }, 2000);
    };

    //verify soil evidence
    const verifySoilEvidence=async()=>{
        try{
            const response = await fetch("http://localhost:8000/api/verify-soil-evidence",{
                method:"POST",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({ reportCID }) 
            });

            if(response.ok){
                const data = await response.json();
                console.log(data);

                if(data.status==="verified"){
                    setIsEvidenceVerified(true);
                    setVerificationStatus(data.status);
                    setSequestrationTons(data.sequestrationTons);
                }
            }
        }catch(error){
            console.log("Error : ",error);
        }
    }   

    //fund contract
    const fundContract = async () => {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const validatorAddress = accounts[0]; // Validator's address
            const contractAddress = "0x575b6c422Cf18c3ab988b62C969C0854d8F4b10D"; // Contract address
            const amountToSend = web3.utils.toWei('1', 'ether'); // Fund the contract with 5 ETH
    
            // Get and log the balance of the validator before the transaction
            const validatorBalanceBefore = await web3.eth.getBalance(validatorAddress);
            console.log("Validator balance before funding:", web3.utils.fromWei(validatorBalanceBefore, "ether"), "ETH");
    
            // Get and log the balance of the contract before the transaction
            const contractBalanceBefore = await web3.eth.getBalance(contractAddress);
            console.log("Contract balance before funding:", web3.utils.fromWei(contractBalanceBefore, "ether"), "ETH");
    
            // Send ETH to the contract to fund it
            await web3.eth.sendTransaction({
                from: validatorAddress,
                to: contractAddress,
                value: amountToSend
            });
    
            // Get and log the balance of the validator after the transaction
            const validatorBalanceAfter = await web3.eth.getBalance(validatorAddress);
            console.log("Validator balance after funding:", web3.utils.fromWei(validatorBalanceAfter, "ether"), "ETH");
    
            // Get and log the balance of the contract after the transaction
            const contractBalanceAfter = await web3.eth.getBalance(contractAddress);
            console.log("Contract balance after funding:", web3.utils.fromWei(contractBalanceAfter, "ether"), "ETH");
    
        } catch (error) {
            console.error("Error funding contract:", error);
        }
    };

    //approve soil evidence
    const approveSoilEvidence = async () => {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const validatorAddress = accounts[0];
            console.log(validatorAddress);
    
            const contract = new web3.eth.Contract(MultiValidatorABI.abi, "0x575b6c422Cf18c3ab988b62C969C0854d8F4b10D");
            await contract.methods.voteToApprove("0xb569b633c55c1de66A817904A2dCA2c2BdB60169", 0)
                .send({ from: validatorAddress});
    
            console.log("Evidence approved and ETH sent!");
        } catch (error) {
            console.error("Error approving evidence:", error);
        }
    };
    

    //view afforestation evidence
    const viewAfforestationEvidence=()=>{

    }

    //verify afforestation evidence
    const verifyAfforestationEvidence=async()=>{

    }
    
    //logout
    const handleLogout=()=>{
        props.setIsLoggedIn(false);
        console.log("Logged out!");
    }

    useEffect(() => {
        const initializeWebSocket = async () => {
            await handleConnectWallet();

            const socket = new WebSocket("ws://localhost:8080");
            socket.onmessage = async (event) => {
                const data = JSON.parse(event.data);
                console.log(data);
                setEvidenceType(data.evidenceType);
                if(data.evidenceType==="afforestation"){
                    
                }
                else if(data.evidenceType==="soil"){
                    setReportCID(data.cid);
                }
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
                <br/>
                <button onClick={handleConnectWallet}>Connect Wallet</button>
                <br/>
                <h3>Wallet Address : {validatorAddress}</h3>

                {/*soil evidence  */}               
                {evidenceType==="soil" && (
                    <div className="soil-evidence-section">
                        {/*disply evidence details*/}
                        <br/>
                        <p>Uploader : {}</p>
                        <p>Evidence Type : {evidenceType}</p>
                        <p>Evidence CID : {reportCID}</p>
                        
                        {/*view evidence*/}
                        <br/>
                        <button onClick={viewSoilEvidence}>View Evidence</button>
                        <br/>
                        {showIframe ? 
                        (
                            <>
                                <iframe 
                                    src={`https://ipfs.io/ipfs/${reportCID}`} 
                                    width="50%" 
                                    height="300px">
                                </iframe>
                            </>
                        ) :
                        (
                            <>
                                <iframe 
                                    width="50%" 
                                    height="300px">
                                </iframe>
                            </>
                        )}

                        {/*verify evidence*/}
                        <br/>
                        <p>Verification Status : {VerificationStatus}</p>
                        <button onClick={verifySoilEvidence}>Verify Evidence</button>

                        
                        {/**token Allocation */}
                        <br/><br/>
                        {isEvidenceVerified && (
                            <>
                                <p>Sequestration Tons: {sequestrationTons}</p>
                                <p>Approval Status : {approvalStatus}</p>
                                <button onClick={fundContract}>Fund Contract</button>
                                <br/>
                                <button onClick={approveSoilEvidence}>Approve</button> 
                                <span>{" "}</span>
                                <button onClick={approveSoilEvidence}>Reject</button>
                            </>
                        )}
                    </div>
                )}
                
                {/*afforestation evidence  */}               
                {evidenceType==="afforestation" && (
                    <div>
                        <button onClick={viewAfforestationEvidence}>View Evidence</button>
                        <br/><br/>
                        {showIframe ? 
                        (
                            <>
                            </>
                        ) :
                        (
                            <>
                            </>
                        )}
                        <br/>
                        <button onClick={verifyAfforestationEvidence}>Verify</button>
                    </div>
                )}
                
                {/*logout*/}
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