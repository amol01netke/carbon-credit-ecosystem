import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "./UserSelection.css";
import React, { useState } from "react";

const UserSelection=()=>{
    const [userType,setUserType]=useState("generator");

    return (
    <React.Fragment>
        <div className="user-selection">
            <h1>SELECT USER TYPE</h1>
            <br/>
            <select className="select-user" onChange={(e)=>setUserType(e.target.value)}>
                <option value="generator">Generator</option>
                <option value="consumer">Consumer</option>
                <option value="validator">Validator</option>
            </select>  

            <div>
                <Link 
                    to={{
                    pathname:'/user-login',
                    state:{userType}
                    }}
                >
                    <button className="login-btn">Login</button>
                </Link>
                
                <Link 
                    to={{
                    pathname:'/user-registration',
                    state:{userType}
                    }}
                >
                    <button className="register-btn">Register</button>
                </Link>

            </div> 
        </div>
    </React.Fragment>
    );
}

export default UserSelection;