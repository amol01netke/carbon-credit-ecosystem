import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./UserDashboard.css";
import React, { useState, useEffect} from "react";
import getWeb3 from "../../handlers/Web3Handler";
import MultiValidatorABI from "../../abis/MutliValidator.json";
import MintTokensABI from "../../abis/MintTokens.json";
import ammABI from "../../abis/AMM.json";

// const SoilSequestration = () => {
   
//     const [ws, setWs] = useState(null);

//     useEffect(() => {
//         const socket = new WebSocket("ws://localhost:8080");
//         setWs(socket);

//         socket.onopen = () => console.log("WebSocket connected!");
//         socket.onerror = (error) => console.error("WebSocket Error:", error);
//         socket.onclose = () => console.log("WebSocket Disconnected!");

//         return () => socket.close();
//     }, []);
// };

const generatorAddress="0x337852Da0A794f91C00A50f808df3910Ee56E442";
const consumerAddress="0x4297B11a8dd13CD7415662aB80C63DB1F2907b0B";
const mintTokensContractAddress="0x36EeA420C838F9cfb2d41b42C3b084F7416D0591";
const multiValidatorContractAddress="0x4514697abAeE3A614F2884e07bA984bd965df4F0";
const ammContractAddress="0xD823D4194792409c133CB1DE71BF05bFc7E5D918";

const GeneratorDashboard=(props)=>{
    const [web3,setWeb3]=useState(null);
    const [genAddress,setGenAddress]=useState("");
    const [file, setFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
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
                setGenAddress(accounts[0]);
                console.log(`Connected Wallet Address: ${accounts[0]}`);
            }else{
                console.error('No accounts found!');
                return;
            }
        }catch(error){
            console.error("Error connecting wallet!");   
        } 
    }
       
    //report
    const handleFileChange=(e)=>{
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setFile(file);
            setPreviewURL(URL.createObjectURL(file));
        } else {
            alert("Please upload a valid PDF file.");
        }
    }

    //submit
    const handleSubmit=async(e)=>{
        e.preventDefault();

        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:8000/api/upload-evidence", {
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
    }
    
    //fetch CCT Balance
    const fetchTokensReceived = async () => {
        if (!web3 || !generatorAddress) return;

        try {
            const mintContract = new web3.eth.Contract(MintTokensABI.abi, mintTokensContractAddress);
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
        const listContract=new web3.eth.Contract(ammABI.abi,ammContractAddress);
        await listContract.methods.listTokens(listAmount,pricePerCCT).send({from:generatorAddress});
        console.log(`Listed ${listAmount} CCT at ${pricePerCCT} DAI each`);
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
            <h3>Wallet Address : {genAddress}</h3>
                      
            {/*evidence upload*/}
            <br/>
            <p>Upload Carbon Reduction Report : </p>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange}/>
                <br/>
                <iframe src={previewURL} width="50%" height="300px"></iframe>
                <br/>
                <button type="submit">Submit</button>
            </form>

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
    const [listings,setListings]=useState([]);
    const [selectedListing,setSelectedListing]=useState(null);
    const [buyAmount,setBuyAmount]=useState(0); 
    const [cctReceived,setCCTReceived]=useState("");
    const [retireAmount,setRetireAmount]=useState("");

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
        if (!web3) return;

        try {
            const contract=new web3.eth.Contract(ammABI.abi,ammContractAddress);
            const listings=await contract.methods.fetchListings().call();

            const formattedListings=listings.map((listing,index)=>({
                index,
                seller: listing.seller,
                amount: web3.utils.fromWei(listing.amount,"ether"),
                pricePerCCT: web3.utils.fromWei(listing.pricePerCCT,"ether"),
            }));

            console.log("Fetched Listings : ",formattedListings);
            
            if (formattedListings.length > 0) {
                setListings(formattedListings);
            } else {
                console.log("No listings found.");
            }
        } catch (error) {
            console.error("Error fetching listings:", error);
        }
    }

    //buy cct
    const buyCCT=async()=>{
        const ammContract=new web3.eth.Contract(ammABI.abi,ammContractAddress);
        await ammContract.methods
            .buyTokens(selectedListing.index,buyAmount)
            .send({from: consumerAddress});
    }   

    //display balance
    const displayCCT=async()=>{
        const mintTokensContract=new web3.eth.Contract(MintTokensABI.abi,mintTokensContractAddress);
        const balance = await mintTokensContract.methods.balanceOf(consumerAddress).call();
        const cctBalance=await web3.utils.fromWei(balance,"ether");
        console.log("Carbon Tokens:", cctBalance);
        setCCTReceived(cctBalance);
    }

    //retire
    const retireCredits=async()=>{
        // const burnContract=new web3.eth.Contract(ammABI.abi,ammContractAddress);
        // await burnContract.methods.burnTokens(retireAmount).send({from:consumerAddress});

        // const burnContract=new web3.eth.Contract(MultiValidatorABI.abi,multiValidatorContractAddress);
        // await burnContract.methods.burnTokens(consumerAddress,retireAmount).send({from:consumerAddress})

        try{
            const response=await fetch("http://localhost:8000/api/retire-cct",{
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    address: consumerAddress,
                    amount: retireAmount
                })
            });

            if(response.ok){
                const data = await response.json();
                console.log(data);
            }
        }catch(error){
            console.log(error);
        }
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
                <div id="cct-listings"> 
                    {listings.length>0?
                        (listings.map((listing,idx)=>
                            (
                                <div key={idx} className="listing-item" onClick={() => {setSelectedListing(listing);console.log(listing)}}>
                                    <p>Seller: {listing.seller}</p>
                                    <p>Amount: {listing.amount} CCT</p>
                                    <p>Price: {listing.pricePerCCT} ETH per CCT</p>
                                </div>
                            ))
                        )
                        :(
                            <p>No listings available...</p>
                        )
                    }
                </div>
                
                {selectedListing && (
                    <div className="buy-section">
                        <p>From: {selectedListing.seller}</p>
                        <p>CCT available : {selectedListing.amount}</p>
                        <p>Price per CCT: {selectedListing.pricePerCCT} ETH</p>
                        <input 
                            type="number" 
                            placeholder="Enter amount" 
                            value={buyAmount} 
                            onChange={(e) => setBuyAmount(e.target.value)} 
                        />
                        <p>ETH Required: {buyAmount * selectedListing.pricePerCCT}</p>
                        <button onClick={buyCCT}>Buy CCT</button>
                    </div>
                )}

                {/**balance display */}
                <br/>
                <button onClick={displayCCT} type="button">Display CCT</button>
                <p>CCT : {cctReceived}</p>

                {/**retre credits */}
                <br/>
                <input 
                    type="number" 
                    placeholder="Enter amount"
                    value={retireAmount} 
                    onChange={(e) => setRetireAmount(e.target.value)}
                />
                <button onClick={retireCredits} type="button">Retire Credits</button>

                {/*logout*/}
                <br/><br/>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </React.Fragment>);
}

const ValidatorDashboard=(props)=>{
    const [web3,setWeb3]=useState(null);
    const [validatorAddress,setValidatorAddress]=useState(null);  
    const [fileCID,setFileCID]=useState("");   
    const [showIframe, setShowIframe] = useState(false);
    const [status,setStatus]=useState("");
    const [credits,setCredits]=useState("");
    
    const [receivedAddress,setReceviedAddress]=useState("");
    const [amount,setAmount]=useState("");

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
    const viewEvidence=async()=>{
        
    }

    //verify evidence
    const verifyEvidence=async()=>{
        try{
            const response=await fetch(`http://localhost:8000/api/verify-evidence`,{
                method:"POST",
                headers:{
                    Accept:"application/json"
                }
            });

            if(response.ok){
                const data=await response.json();
                console.log(data);
                setStatus(data.status);
                setCredits(data.credits);
            }
        }catch(error){
            console.log(error);
        }
    }

    //approve evidence
    const approveEvidence = async () => {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const validatorAddress = accounts[0];
            console.log(validatorAddress);
    
            const contract = new web3.eth.Contract(MultiValidatorABI.abi, multiValidatorContractAddress);
            await contract.methods
                .voteToApprove(generatorAddress, credits)
                .send({ from: validatorAddress});
    
        } catch (error) {
            console.error("Error approving evidence:", error);
        }
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

                if(data.type==="consumer"){
                    setReceviedAddress(data.address);
                    setAmount(data.amount);
                }else setFileCID(data.cid);
            };
            
            socket.onclose = () => console.log("WebSocket Disconnected");
        };
        initializeWebSocket();
    }, []);

    const approveNFT=async()=>{
        // const burnContract=new web3.eth.Contract(ammABI.abi,ammContractAddress);
        // await burnContract.methods.burnTokens(retireAmount).send({from:consumerAddress});
        try{
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const validatorAddress = accounts[0];
            console.log(validatorAddress);

            const burnContract=new web3.eth.Contract(MultiValidatorABI.abi,multiValidatorContractAddress);
            await burnContract.methods.burnTokens(consumerAddress,amount).send({from:validatorAddress});
        }catch(error){
            console.log(error);
        }        
    }

    return (
        <React.Fragment>
            <div>
                <h1>VALIDATOR DASHBOARD</h1>
                {/*wallet connection*/}
                <br/>
                <button onClick={handleConnectWallet}>Connect Wallet</button>
                <br/>
                <h3>Wallet Address : {validatorAddress}</h3>

                    <div className="evidence-section">
                        <div className="gen-section">
                            {/*view evidence*/}
                            <br/>
                            <p>Evidence CID : {fileCID}</p>
                            <button onClick={viewEvidence}>View Evidence</button>
                            <br/>
                            {showIframe ? 
                            (
                                <>
                                    <iframe 
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

                            {/**verify the evidence */}
                            <br/><br/>
                            <button onClick={verifyEvidence}>Verify Evidence</button>  
                            <p>Verfication Status : {status}</p> 
                            <p>Credits to Allot : {credits} </p>
                            
                            <br/>
                            <button onClick={approveEvidence}>Approve Evidence</button>
                        </div>

                        <div className="con-section">
                            Consumer Address : {receivedAddress}
                            Retire Amount : {amount}

                            <button onClick={approveNFT}>Approve NFT</button>
                        </div>
                    </div>
                
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