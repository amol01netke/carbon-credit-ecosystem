import React from "react";
import "./UserAuthentication.css";
import { useState } from "react";
import cce_logo from "../../assets/cce_logo.jpg";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const UserAuthentication=()=>{
    const [activeForm,setActiveForm]=useState("login");
    const [userType,setUserType]=useState("generator");
        
    const switchForm=(formType)=>{
        setActiveForm(formType);
    }

    const loginUser=(e)=>{
        e.preventDefault();
    }

    const registerUser=(e)=>{
        e.preventDefault();        
    }

    return (
    <React.Fragment>
        <div className="user-authentication">
            <div className="form-header">
                <img src={cce_logo} alt="CCE LOGO"/>
            </div>
            
            <div className="forms">
                {/*login form*/}
                <form className={activeForm===`login`?`form is-active`:`form`} onSubmit={loginUser} >
                    <select className="form-ip" onChange={(e)=>setUserType(e.target.value)}>
                        <option value="default">User Type</option>
                        <option value="generator">Generator</option>
                        <option value="consumer">Consumer</option>
                        <option value="validator">Validator</option>
                    </select>   
                    <input className="form-ip" type="username" placeholder="Username"/>
                    <input className="form-ip" type="password" placeholder="Password"/>
           
                    <Link 
                        to={{
                        pathname:'/user-dashboard',
                        state:{userType} 
                        }}
                    >
                        <input className="form-submit" type="submit" value="Login"/>
                    </Link>
                </form>

                {/*registration form*/}
                <form className={activeForm===`register`?`form is-active`:`form`} onSubmit={registerUser}>
                    <select className="form-ip"  onChange={(e)=>setUserType(e.target.value)}>
                        <option value="default">User Type</option>
                        <option value="generator">Generator</option>
                        <option value="consumer">Consumer</option>
                        <option value="validator">Validator</option>
                    </select>
                    <input className="form-ip" type="email" placeholder="Email"/>
                    <input className="form-ip" type="text" placeholder="Ethereum Wallet Address"/>
                    <input className="form-ip" type="text" placeholder="Username"/>
                    <input className="form-ip" type="password" placeholder="Password"/>

                    <Link 
                        to={{
                        pathname:'/user-dashboard',
                        state:{userType} 
                        }}
                    >
                        <input className="form-submit" type="submit" value="Register"/>
                    </Link>
                </form>
            </div>

            <button className="form-switcher" onClick={()=>switchForm(activeForm==='login'?'register':'login')}>
                {activeForm==='login'?`New user ? Register`:`Already registered ? Login`}
            </button>
        </div>
    </React.Fragment>);
}

export default UserAuthentication;