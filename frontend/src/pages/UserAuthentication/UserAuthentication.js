import React from "react";
import "./UserAuthentication.css";

const UserAuthentication=()=>{
    return (
    <React.Fragment>
        <div className="user-authentication">
            <form className="login-form">
                <select>
                    <option value="default">User Type</option>
                    <option value="indsutry">Industry</option>
                    <option value="farmer">Farmer</option>
                    <option value="govt">Government</option>
                </select>
                <input type="username" placeholder="Username"/>
                <input type="password" placeholder="Password"/>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    </React.Fragment>);
}

export default UserAuthentication;