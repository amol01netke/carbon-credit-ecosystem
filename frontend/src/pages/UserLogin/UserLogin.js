import React, { useState } from "react";
import "./UserLogin.css";

const UserLogin = (props) => {
    const { userType } = props.location.state;
    const { setIsLoggedIn, setUserType } = props;
    setUserType(userType);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const loginGenerator = async (formData) => {
        const { username, password } = formData;    
    
        try {
            const response = await fetch("http://localhost:8000/api/login-generator", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                return true;
            } else {
                const error = await response.json();
                console.error(error);
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const loginConsumer = async (formData) => {
        const { username, password } = formData;    
    
        try {
            const response = await fetch("http://localhost:8000/api/login-consumer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                return true;
            } else {
                const error = await response.json();
                console.error(error);
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };


    const loginValidator = async (formData) => {
        const { username, password } = formData;    
    
        try {
            const response = await fetch("http://localhost:8000/api/login-validator", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
    
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("validator-role",data.validatorRole);
                console.log(data);
                return true;
            } else {
                const error = await response.json();
                console.error(error);
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let isLoggedIn = false;

        if(userType==="generator")
            isLoggedIn = await loginGenerator(formData);
        else if(userType==="consumer")
            isLoggedIn=await loginConsumer(formData);
        else
            isLoggedIn=await loginValidator(formData);
        
        if (isLoggedIn) {
            setIsLoggedIn(true);

            props.history.push({
                pathname: "/user-dashboard",
                state: { userType },
            });
        } else {
            alert("Login Failed!");
        }
    };

    return (
        <React.Fragment>
            <div className="user-login">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1>{userType} LOGIN</h1>
                    <input
                        className="form-ip"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <input
                        className="form-ip"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                
                    <button type="submit" className="form-submit">
                        Login
                    </button>
                </form>
            </div>
        </React.Fragment>
    );
};

export default UserLogin;
