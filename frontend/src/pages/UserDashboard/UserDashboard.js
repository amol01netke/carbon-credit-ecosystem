import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./UserDashboard.css";
import React, { useState, useEffect} from "react";
import getWeb3 from "../../handlers/Web3Handler";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import {useWallet} from "../../context/WalletContext";
import AllocateTokens from "../../abis/AllocateTokens.json";

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
    const {generatorAddress}=useWallet();
    const [fetchedCID,setFetchedCID]=useState("");
    const [reportCID,setReportCID]=useState("");
    const [tokens,setTokens]=useState(0);

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

    //verify evidence
    // const verifyEvidence=async()=>{
    //     try{
    //         const response = await fetch(`http://localhost:8000/api/verify-evidence/${fetchedCID}`, {
    //             method: "GET"
    //         });

    //         if(response.ok){
    //             const data = await response.json();
    //             console.log(data);
    //             setTokens(data.tokens);
    //         }
    //     } catch(error){
    //         console.log(error);
    //     }
    // }

    const [showIframe, setShowIframe] = useState(false);

    const viewReport = () => {
        if (reportCID) {
            setShowIframe(true);
        } else {
            alert("No CID available. Please wait for it to load.");
        }
    };

    const verifyReportData=async()=>{}

    //allocate tokens
    const allocateTokens = async () => {
        try {
            if (!web3) {
                console.error("Web3 is not initialized! Connect wallet first.");
                return;
            }

            const accounts = await web3.eth.getAccounts();
            const contractAddress = "0xDfb0fA24f46465A9D14Ed744369E98D01a08B707"; // Replace with deployed contract address
            const contract = new web3.eth.Contract(AllocateTokens.abi, contractAddress);

            // Convert tokens to Ether (1 Token = 0.01 ETH)
            const ethAmount = web3.utils.toWei((tokens * 0.01).toString(), "ether");

            // Call Smart Contract function with Ether transfer
            // await contract.methods
            //     .approveAndTransferEther(fetchedCID, "0x6e6Fa5e57141a86bDE7B15Bd1AecFB1C9305dC3d", tokens)
            //     .send({ from: accounts[0], value: ethAmount });

            web3.eth.sendTransaction({
                from: validatorAddress,
                to: "0x7e767E1C781aDfd032627d4F8774C8ceFd5C89A3",
                value: ethAmount // Send 0.01 ETH
            }).then(console.log);

            console.log(`Successfully transferred ${ethAmount} ETH to ${generatorAddress}!`);

        } catch (error) {
            console.error("Smart Contract Execution Failed:", error);
        }
    };

    //logout
    const handleLogout=()=>{
        props.setIsLoggedIn(false);
        console.log("Logged out!");
    }

    useEffect(() => {
        if (reportCID) {
            const timer = setTimeout(() => {
                setShowIframe(true);
            }, 2000); // 2-second delay
    
            return () => clearTimeout(timer); // Cleanup timeout when component unmounts
        }
    }, [reportCID]);
    //WebSocket for real-time evidence updates
    useEffect(() => {
        const initializeWebSocket = async () => {
            await handleConnectWallet();

            const socket = new WebSocket("ws://localhost:8080");
            socket.onmessage = async (event) => {
                const data = JSON.parse(event.data);
                setFetchedCID(data.cid1);
                setReportCID(data.cid2);
                console.log(data);
            };
            
            socket.onclose = () => console.log("WebSocket Disconnected");
        };
        initializeWebSocket();
    }, []);


    return (
        <React.Fragment>
            <div>
                <h1>VALIDATOR DASHBOARD</h1>
                {/*role*/}
                <br/>
                <h3>Role : {localStorage.getItem("validator-role")}</h3>
                
                {/*wallet connection*/}
                <br/>
                <button onClick={handleConnectWallet}>Connect Wallet</button>
                <br/>
                <h3>Wallet Address : {validatorAddress}</h3>
            
                {/*fetch evidence - verify evidence*/}
                <br/><br/>
                <h3>Fetched CID : {fetchedCID}</h3>
                
            
                {/* PDF Viewer for Report Validator */}
                {localStorage.getItem("validator-role") === "report-validator" && (
                    <div>
                        <h3>Submitted Report CID : {reportCID}</h3>
                        <br/>
                        {showIframe ? (
                            <>
                                <iframe 
                                    src={`https://ipfs.io/ipfs/${reportCID}`} 
                                    width="50%" 
                                    height="400px">
                                </iframe>
                                <br/>
                            </>
                        ) : (
                            <p>Loading report...</p> // Show loading message before iframe appears
                        )}
                    </div>
                )}
                
                {/*allocate tokens*
                <br/><br/>
                <h3>Tokens to allocate : {tokens} </h3>
                <br/>
                <button onClick={allocateTokens}>Allocate Tokens</button>
                    */}

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