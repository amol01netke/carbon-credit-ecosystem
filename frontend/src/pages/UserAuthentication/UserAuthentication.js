import React from "react";
import "./UserAuthentication.css";

const UserAuthentication=()=>{
    return <React.Fragment>
        <div className="forms">
            <div className="login-form">
                <input type="username" placeholder="Username"/>
                <input type="password" placeholder="Password"/>
                <input type="submit" value="Submit"/>
            </div>
        </div>
    </React.Fragment>
}

export default UserAuthentication;