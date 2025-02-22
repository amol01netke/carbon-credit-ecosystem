import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./UserEvidence.css";
import { useState,useEffect } from "react";
import { useWallet } from "../../context/WalletContext";

const Afforestation=()=>{
    return (
        <React.Fragment>
            <h3>Afforestation</h3>
        </React.Fragment>
    );
}

const RenewableEnergy=()=>{
    return (
        <React.Fragment>
            <h3>Renewable Energy</h3>
        </React.Fragment>
    );
}

// const SoilCarbonSequestration=()=>{
//     const [file,setFile]=useState(null);

//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//     };
    
//     const handleSubmit = async(e) => {
//         e.preventDefault();

//         if (!file) {
//             alert("Please select a file to upload.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("file", file);
    
//         try {
//             const response = await fetch("http://localhost:8000/api/upload-user-evidence", {
//                 method: "POST",
//                 body: formData, 
//                 headers: {
//                     "Accept": "application/json",
//                 },
//             });
    
//             if (response.ok) {
//                 const data = await response.json();
//                 console.log("Response:", data);
//                 alert("Data Submitted!");
//             } else {
//                 const error = await response.json();
//                 console.error("Error:", error);
//             }
//         } catch (error) {
//             console.error("Request Failed:", error);
//         }
//     }

//     return (
//         <React.Fragment>
//             <h3>Soil Carbon Sequestration</h3>
            
//            <form onSubmit={handleSubmit} className="soil-form">

//              {/*   
//                 <input
//                     type="number"
//                     name="landArea"
//                     value={formData.landArea}
//                     onChange={handleChange}
//                     placeholder="Land Area (in hectares)"
//                 />
                
//                 <br/><br/>
//                 <select
//                     name="soilType"
//                     value={formData.soilType}
//                     onChange={handleChange}
//                 >
//                     <option value="">Select Soil Type</option>
//                     <option value="clay">Clay</option>
//                     <option value="sandy">Sandy</option>
//                     <option value="loam">Loam</option>
//                     <option value="peat">Peat</option>
//                 </select>
                
//                 <br/><br/>
//                 <input
//                     type="number"
//                     step="0.01"
//                     name="organicContent"
//                     value={formData.organicContent}
//                     onChange={handleChange}
//                     placeholder="Organic Carbon Content (%)"
//                 />
                
//                 <br/><br/>
//                 <textarea
//                     name="farmingPractices"
//                     value={formData.farmingPractices}
//                     onChange={handleChange}
//                     placeholder="Describe no-till farming, cover cropping, etc."
//                     rows="5"
//                 />*/}

//                 <br/><br/>
//                 <label>
//                     Upload Soil Test Report
//                 </label>
//                 <br/>
//                 <input type="file" onChange={handleFileChange} />
               
//                 <br/><br/>
//                 <button type="submit">Submit</button>
//             </form>
//         </React.Fragment>
//     );
// }

const SoilCarbonSequestration = () => {
    const [file, setFile] = useState(null);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        // Initialize WebSocket connection
        const socket = new WebSocket("ws://localhost:8080");
        setWs(socket);

        socket.onopen = () => console.log("✅ WebSocket connected!");
        socket.onmessage = (event) => console.log("📩 New Message:", event.data);
        socket.onerror = (error) => console.error("❌ WebSocket Error:", error);
        socket.onclose = () => console.log("🔌 WebSocket Disconnected!");

        return () => socket.close(); // Cleanup WebSocket on component unmount
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:8000/api/upload-user-evidence", {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Response:", data);
                alert("Data Submitted!");

                // Send WebSocket message to notify about the new upload
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ message: "New soil test report uploaded!", cid: data.cid }));
                }
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
            <h3>Soil Carbon Sequestration</h3>
            <form onSubmit={handleSubmit} className="soil-form">
                <br />
                <label>Upload Soil Test Report</label>
                <br />
                <input type="file" onChange={handleFileChange} />
                <br />
                <br />
                <button type="submit">Submit</button>
            </form>
        </React.Fragment>
    );
};

const UserEvidence=(props)=>{
    const {sequestrationType}=props.location.state;
    const {userWalletAddress}=useWallet();

    console.log(userWalletAddress);
    
    let Component;
    switch(sequestrationType){
        case "afforestation":
            Component=Afforestation;
            break;

        case "renewable-energy":
            Component=RenewableEnergy;
            break;
            
        case "soil-carbon-sequestration":
            Component=SoilCarbonSequestration;
            break;
            
        default:
            break;
    }

    return (
        <React.Fragment>
            <Header/>
                <div className="user-evidence">
                    <Component/>
                </div>
            <Footer/>
        </React.Fragment>
    );
}

export default UserEvidence;