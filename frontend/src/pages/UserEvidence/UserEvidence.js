import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./UserEvidence.css";

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

const Soil=()=>{
    return (
        <React.Fragment>
            <h3>Soil</h3>
        </React.Fragment>
    );
}

const UserEvidence=(props)=>{
    const {sequestrationType}=props.location.state;
  
    let Component;
    switch(sequestrationType){
        case "afforestation":
            Component=Afforestation;
            break;

        case "renewable-energy":
            Component=RenewableEnergy;
            break;
            
        case "soil":
            Component=Soil;
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