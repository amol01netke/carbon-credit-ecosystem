import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./UserEvidence.css";
import { useState,useEffect } from "react";
import { useWallet } from "../../context/WalletContext";

const Afforestation=()=>{
    return (
        <div>
            <h3>Afforestation </h3>
        </div>
    );
};

const SoilSequestration = () => {
    const [latitude, setLatitude]=useState(null);
    const [longitude, setLongitude]=useState(null);
    const [report, setReport] = useState(null);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");
        setWs(socket);

        socket.onopen = () => console.log("WebSocket connected!");
        socket.onmessage = (event) => console.log("New Message:", event.data);
        socket.onerror = (error) => console.error("WebSocket Error:", error);
        socket.onclose = () => console.log("WebSocket Disconnected!");

        return () => socket.close();
    }, []);

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
    
    //soil test report
    const handleFileChange = (e) => {
        setReport(e.target.files[0]);
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
        formData.append("latitude",latitude);
        formData.append("longitude",longitude);

        try {
            const response = await fetch("http://localhost:8000/api/upload-soil-data", {
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

                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.current.send(JSON.stringify({ message: "New soil test report uploaded!", cid: data.cid }));
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
            <h3>Soil Sequestration</h3>
            <form onSubmit={handleSubmit} className="soil-form">
                {/*GPS*/}
                <br/>
                <label>Latitude : {latitude} | Longitude : {longitude}</label>
                <br/>
                <button type="button" onClick={fetchLocation}>Fetch Location </button>

                {/*soil test report*/}
                <br/><br/>
                <label>Upload Soil Test Report : </label>
                <br />
                <input type="file" onChange={handleFileChange} />
                
                {/*submit*/}
                <br /><br/>
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

        case "soil-sequestration":
            Component=SoilSequestration;
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