import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./UserDashboard.css";
import React, { useState, useEffect} from "react";
import getWeb3 from "../../handlers/Web3Handler";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import {useWallet} from "../../context/WalletContext";

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
    
    //returend data
    const [reportCID,setReportCID]=useState("");
    const [latitude,setLatitude]=useState("");
    const [longitude,setLongitude]=useState("");
    const [showIframe, setShowIframe] = useState(false);
    
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

    //view evidence
    const viewEvidence =async () => {
        setTimeout(() => {
            setShowIframe(true);
        }, 2000);
    };

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
                
                console.log(data.metadata.fileCID,data.metadata.latitude,data.metadata.longitude);

                setReportCID(data.metadata.fileCID);
                setLatitude(data.metadata.latitude);
                setLongitude(data.metadata.longitude);
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
                
                {/*gps validator*/}
                {localStorage.getItem("validator-role") === "gps-validator" && (
                    <div>
                        <button onClick={viewEvidence}>Satellite View</button>
                        <br/><br/>
                        {showIframe ? 
                        (
                            <>
                                <iframe    
                                src={`
                                    https://www.bing.com/maps/embed?h=400&w=500&cp=${latitude}~${longitude}&lvl=15&sty=a&typ=d&FORM=MBEDV8`}
                                width="50%" 
                                height="400px">
                                </iframe>
                            </>
                        ) : 
                        (
                            <>
                                <iframe 
                                    width="50%" 
                                    height="400px">
                                </iframe>
                            </>
                        )}
                        <br/>
                        <button>Verify </button>
                    </div>
                )}
                
                {/*report validator*/}
                {localStorage.getItem("validator-role") === "report-validator" && (
                    <div>
                        <button onClick={viewEvidence}>View Report</button>
                        <br/><br/>
                        {showIframe ? 
                        (
                            <>
                                <iframe 
                                    src={`https://ipfs.io/ipfs/${reportCID}`} 
                                    width="50%" 
                                    height="400px">
                                </iframe>
                            </>
                        ) :
                        (
                            <>
                                <iframe 
                                    width="50%" 
                                    height="400px">
                                </iframe>
                            </>
                        )}
                        <br/>
                        <button>Verify</button>
                    </div>
                )}
                
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