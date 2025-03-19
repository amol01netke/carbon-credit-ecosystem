import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./UserDashboard.css";
import React, { useState, useEffesct} from "react";
import getWeb3 from "../../handlers/Web3Handler";
import {useWallet} from "../../context/WalletContext";
import MultiValidatorABI from "../../abis/MutliValidator.json";
import MintTokensABI from "../../abis/MintTokens.json";
import ammABI from "../../abis/AMM.json";

const Afforestation=()=>{
    const [latitude, setLatitude]=useState(null);
    const [longitude, setLongitude]=useState(null);
    
    //fetch co-ordinates
    const fetchLocation=()=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    console.error("Error fetching location:", error);
                    alert("Unable to fetch location. Please allow location access.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    //handle submit
    const handleSubmit=async()=>{

    }

    return (
        <div>
           <form onSubmit={handleSubmit}>
                {/*GPS*/}
                <br/>
                <label>Latitude : {latitude} | Longitude : {longitude}</label>
                <br/>
                <button type="button" onClick={fetchLocation}>Fetch Location </button>

                {/*submit*/}
                <br /><br/>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

const SoilSequestration = () => {
    const [report, setReport] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");
        setWs(socket);

        socket.onopen = () => console.log("WebSocket connected!");
        socket.onerror = (error) => console.error("WebSocket Error:", error);
        socket.onclose = () => console.log("WebSocket Disconnected!");

        return () => socket.close();
    }, []);
    
    //soil test report
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setReport(file);
            setPreviewURL(URL.createObjectURL(file)); // Create preview URL
        } else {
            alert("Please upload a valid PDF file.");
        }
    };

    //form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!report) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", report);

        try {
            const response = await fetch("http://localhost:8000/api/upload-soil-evidence", {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Response : ", data);
            } else {
                const error = await response.json();
                console.error("Error:", error);
            }
        } catch (error) {
            console.error("Request Failed:", error);
        }
    };

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit} className="soil-form">
                {/*soil test report*/}
                <br/>
                <label>Upload Soil Test Report</label>
                <br />
                <input type="file" onChange={handleFileChange} />
                <br/>
                <iframe src={previewURL} width="50%" height="300px"></iframe>
                
                {/*submit*/}
                <br /><br/>
                <button type="submit">Submit</button>
            </form>
        </React.Fragment>
    );
};

const GeneratorDashboard=(props)=>{
    const [web3,setWeb3]=useState(null);
    const {generatorAddress,setGeneratorAddress}=useWallet();
    const [sequestrationType,setSequestrationType]=useState("select");
    const [tokensReceived, setTokensReceived]=useState(0);
    const [listAmount,setListAmount]=useState("");
    const [pricePerCCT,setPricePerCCT]=useState("");

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
       
     //fetch CCT Balance
     const fetchTokensReceived = async () => {
        if (!web3 || !generatorAddress) return;

        try {
            const mintContract = new web3.eth.Contract(MintTokensABI.abi, "0x6649e1B7FF437051A8cE566e13C5d8FDd56f96A1");
            const balance = await mintContract.methods.balanceOf(generatorAddress).call();
            const cctBalance=await web3.utils.fromWei(balance,"ether");
            console.log("Carbon Tokens:", cctBalance);
            setTokensReceived(cctBalance); 
        } catch (error) {
            console.error("Error fetching tokens:", error);
        }
    };

    //listing on AMM
    const listOnAMM=async()=>{
        const listContract=new web3.eth.Contract(ammABI.abi,"");
        await listContract.methods.listTokens(listAmount,pricePerCCT);
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
            <br/>
            <select className="select-project-type" onChange={(e)=>setSequestrationType(e.target.value)}>
                <option value="select">Select Sequestration Method</option>
                <option value="afforestation">Afforestation</option>
                <option value="soil-sequestration">Soil Sequestration</option>
            </select>  
            <br/>

            {sequestrationType==="afforestation" &&  <Afforestation/>}    
            {sequestrationType==="soil-sequestration" &&  <SoilSequestration/>}

             {/* Fetch Tokens */}
             <br />
            <button onClick={fetchTokensReceived}>View CCT Received</button>
            <br/>
            Tokens received : {tokensReceived}
            
            {/**list on AMM */}
            <br/><br/>
            <input type="number" placeholder="Amount to List" 
                value={listAmount} onChange={(e)=>setListAmount(e.target.value)}/>
            <input type="number" placeholder="Price per CCT" 
                value={pricePerCCT} onChange={(e)=>setPricePerCCT(e.target.value)} />
            <button onClick={listOnAMM}>List on AMM</button>

            {/*logout*/}    
            <br/><br/>
            <button onClick={handleLogout}>Logout</button>
        </div>
    </React.Fragment>
    );
}

const ConsumerDashboard=(props)=>{
    const [web3,setWeb3]=useState(null);
    const [consumerAddress,setConsumerAddress]=useState(null);  
    const [isFetched,setIsFetched]=useState(false);
    const [listings,setListings]=useState([]);
       
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
                setConsumerAddress(accounts[0]);
                console.log(`Connected Wallet Address: ${accounts[0]}`);
            }else{
                console.error('No accounts found!');
                return;
            }
        }catch(error){
            console.error("Error connecting wallet!");   
        } 
    }

    //fetch listings
    const fetchFromAMM=async()=>{
    }

    //buy cct
    const buyCCT=()=>{
    }   

    //logout
    const handleLogout=()=>{
        props.setIsLoggedIn(false);
        console.log("Logged out!");
    }

    return (
        <React.Fragment>
            <div>               
                <h1>CONSUMER DASHBOARD</h1>
                {/*wallet connection*/}
                <br/>
                <button onClick={handleConnectWallet}>Connect Wallet</button>
                <br/>
                <h3>Wallet Address : {consumerAddress}</h3>

                {/**fetch from amm */}
                <br/>
                <button onClick={fetchFromAMM}>Fetch from AMM</button>
                {isFetched && 
                <div>
                    <div className="listing-section"> 
                    </div>

                    {/**buy */}
                    <br/>
                    <input type="numer" placeholder="CCT to Buy"/>
                    <button onClick={buyCCT}>Buy CCT</button>
                </div>
                }
                
                {/*logout*/}
                <br/><br/>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </React.Fragment>);
}

const ValidatorDashboard=(props)=>{
    const [web3,setWeb3]=useState(null);
    const [validatorAddress,setValidatorAddress]=useState(null);  
    const [evidenceType, setEvidenceType]=useState(""); 
    const [reportCID,setReportCID]=useState("");   
    const [showIframe, setShowIframe] = useState(false);
    const [verificationStatus, setVerificationStatus]=useState("not verified");
    const [co2Sequestration, setCO2Sequestration]=useState("0");

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

    //process soil evidence
    const verifySoilEvidence=async()=>{
        try{
            const response = await fetch("http://localhost:8000/api/verify-soil-evidence",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    reportCID
                }) 
            });

            if(response.ok){
                const data = await response.json();
                console.log(data);
    
                if(data.status==="verified"){            
                    setVerificationStatus(data.status);
                    setCO2Sequestration(data.sequestrationAmount);
                }
            }
        }catch(error){
            console.log("Error : ",error);
        }
    }   

    //approve soil evidence
    const approveSoilEvidence = async () => {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const validatorAddress = accounts[0];
            console.log(validatorAddress);
    
            const contract = new web3.eth.Contract(MultiValidatorABI.abi, "0x15585835636CDf66E0D19B92431012A919702eC8");
            await contract.methods
                .voteToApprove("0xf5bf87EF10746B570e4E2D7f36899859edf03Fe7", co2Sequestration)
                .send({ from: validatorAddress});
    
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
                        <button onClick={viewSoilEvidence}>View Soil Evidence</button>
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

                        {/** soil evidence processing*/}
                        <br/>
                        <button onClick={verifySoilEvidence}>Verify Soil Evidence</button>
                        <br/><br/>
                        <p>Verification Status : {verificationStatus}</p>
                        <p>CO<sub>2</sub> Sequestration : {co2Sequestration} tons</p>
                        <br/>
                        <button onClick={approveSoilEvidence}>Approve Soil Evidence</button>

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