import React from "react";
import "./UserAuthentication.css";
import { useState } from "react";
import cce_logo from "../../assets/cce_logo.jpg";

const UserAuthentication=()=>{
    const[activeForm,setActiveForm]=useState("login");
    const [userType,setUserType]=useState("industry");

    const switchForm=(formType)=>{
        setActiveForm(formType);
    }

    const loginUser=(userType)=>{

    }

    const registerUser=(userType)=>{

    }

    return (
    <React.Fragment>
        <div className="user-authentication">
            <div className="form-header">
                <img src={cce_logo} alt="CCE LOGO"/>
            </div>
            
            <div className="forms">
                {/*Login form*/}
                <form className={activeForm===`login`?`form is-active`:`form`} onSubmit={()=>loginUser(userType)} >
                    <select>
                        <option value="default">User Type</option>
                        <option value="indsutry">Industry</option>
                        <option value="farmer">Farmer</option>
                        <option value="govt">Government</option>
                    </select>
                    <input type="username" placeholder="Username"/>
                    <input type="password" placeholder="Password"/>
                    <input className="form-submit" type="submit" value="Login"/>
                </form>

                {/*Registration form*/}
                <form className={activeForm===`register`?`form is-active`:`form`} onSubmit={()=>registerUser(userType)}>
                    <select>
                        <option value="default">User Type</option>
                        <option value="indsutry">Industry</option>
                        <option value="farmer">Farmer</option>
                        <option value="govt">Government</option>
                    </select>
                    <input type="username" placeholder="Username"/>
                    <input type="password" placeholder="Password"/>
                    <input className="form-submit" type="submit" value="Register"/>
                </form>
            </div>

            <button className="form-switcher" onClick={()=>switchForm(activeForm==='login'?'register':'login')}>
                {activeForm==='login'?`Register`:`Already registered ? Login`}
            </button>
        </div>
    </React.Fragment>);
}

export default UserAuthentication;