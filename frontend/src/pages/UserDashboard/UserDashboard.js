import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./UserDashboard.css";
import React, { useState, useEffect} from "react";
import getWeb3 from "../../handlers/Web3Handler";
import MultiValidatorABI from "../../abis/MutliValidator.json";
import MintTokensABI from "../../abis/MintTokens.json";
import ammABI from "../../abis/AMM.json";
import nftABI from "../../abis/MintNFT.json";

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

const generatorAddress="0x7cdA3da019009e5bC9A5dB029cBcDC61af5aeFc6";
const consumerAddress="0x7cdA3da019009e5bC9A5dB029cBcDC61af5aeFc6";

const mintTokensContractAddress="0x2B33601eDB4D581c3c7347Bf5155f113626fa79C";
const nftContractAddress="0x2A69BB6156f21fAbF5693325699DB24DA0AF5D9b";
const multiValidatorContractAddress="0x29974158f2b51cECe88fEE931DA74031E107EAb6";
const ammContractAddress="0xBecA04798B30e6e4f6741A3A52FE363fA18CA5CE";

const GeneratorDashboard=(props)=>{
    const [web3,setWeb3]=useState(null);
    const [genAddress,setGenAddress]=useState("");
    const [tokensReceived, setTokensReceived]=useState("");
    const [listAmount,setListAmount]=useState("");
    const [pricePerCCT,setPricePerCCT]=useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewURL,setPreviewURL]=useState(null)
    const [ndvi,setNDVI]=useState(0);
   
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
     
    //file change
    const handleFileChange=(e)=>{
        const file = e.target.files[0];
        if (file) {
          setSelectedFile(file);
          setPreviewURL(URL.createObjectURL(file));
        }
    }

    //submit
    const handleSubmit=async(e)=>{
        e.preventDefault();

        const fileInput = e.target.querySelector('input[type="file"]');
        const file = fileInput.files[0];
        if (!file) {
            alert("Please upload an image.");
            return;
        }
    
        const formData = new FormData();
        formData.append("image", file);

        try{
            const response=await fetch("http://localhost:5000/api/calculate-ndvi",{
                method:"POST",
                body:formData
            });

            if(response.ok){
                const data=await response.json();
                console.log(data);
                setNDVI(data.ndvi);
            }else {
                console.error("NDVI calculation failed.");
            }
        }catch(error){
            console.log(error);
        }
    }

    const sendNDVI=async()=>{
        try{
            const response=await fetch("http://localhost:8000/api/send-ndvi",{
                method:"POST",
                headers:{
                    Accept:"application/json",
                    "Content-type":"application/json"
                },
                body:JSON.stringify({address:genAddress,value:ndvi})
            });

            if(response.ok){
                const data=await response.json();
                console.log(data);
            }
        }catch(error){
            console.log(error);
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
                      
            {/*data upload*/}
            <br/>
            <form onSubmit={handleSubmit}>
                <p>Upload Satellite Image : </p>
                <input type="file" onChange={handleFileChange}/>
                
                <br/>
                <iframe
                    src={previewURL}
                    style={{ width: '300px', height: '300px'}}
                />

                <br/>
                <button type="submit">Calculate NDVI</button>
                <p>NDVI : {ndvi}</p>
            </form>

            {/**send for approval */}
            <button type="button" onClick={sendNDVI}>Send NDVI</button>
            
            {/* Fetch Tokens */}
            <br /><br/>
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
    const [crc,setCRC]=useState("");

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

    //crc
    const viewCRC=async()=>{
        const nftContract=new web3.eth.Contract(nftABI.abi,nftContractAddress);
        const crcData=await nftContract.methods.getCRC(consumerAddress).call();
        
        console.log(crcData);
        setCRC({
            owner: crcData[0],
            burnAmount: web3.utils.fromWei(crcData[1], "ether"),
            timestamp: crcData[2],
        });
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
                
                {/**NFT */}
                <br/><br/>
                <button onClick={viewCRC}>View Carbon Removal Certificate</button>
                {crc && (
                    <div>
                        <p>Owner: {crc.owner}</p>
                        <p>Amount Retired: {crc.burnAmount} CCT</p>
                    </div>
                )}

                {/*logout*/}
                <br/><br/>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </React.Fragment>);
}

const ValidatorDashboard=(props)=>{
    const [web3,setWeb3]=useState(null);
    const [validatorAddress,setValidatorAddress]=useState(null);  
    const [credits,setCredits]=useState("");
    const [receivedAddress,setReceivedAddress]=useState("");
    const [amount,setAmount]=useState("");
    const [addressGen,setAddressGen]=useState("");
    const [ndvi,setNDVI]=useState(0);
    const [sequestrationAmount,setSequestrationAmount]=useState("");

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
                    setReceivedAddress(data.address);
                    setAmount(data.amount);
                }else if(data.type==="generator"){
                    setAddressGen(data.address);
                    setNDVI(data.value);
                }
            };
            
            socket.onclose = () => console.log("WebSocket Disconnected");
        };
        initializeWebSocket();
    }, []);

    const estimateCO2Sequestration=async()=>{
        try{
            const response=await fetch(`http://localhost:5000/api/estimate-co2`,{
                method:"POST",
                headers:{
                    Accept:"application/json",
                    "Content-type":"application/json",
                },
                body:JSON.stringify({ndvi})
            });

            if(response.ok){
                const data=await response.json();
                setSequestrationAmount(data.amount);
                setCredits(data.credits);
            }
        }catch(error){
            console.log(error);
        }
    }

    const approveNFT=async()=>{
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
                        <br/>
                        <p>Generator Address : {addressGen}</p>
                        <p>NDVI : {ndvi}</p>

                        <br/>
                        <button type="button" onClick={estimateCO2Sequestration}>Estimate C02 Sequestration</button>
                        <p>Sequestration Amount : {sequestrationAmount} tons</p>
                        
                        <br/>
                        <button onClick={approveEvidence}>Approve CCT</button>
                    </div>

                    <div className="con-section">
                        <br/>
                        <p>Consumer Address : {receivedAddress}</p>
                        <p>Retire Amount : {amount}</p>
                        
                        <br/>
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