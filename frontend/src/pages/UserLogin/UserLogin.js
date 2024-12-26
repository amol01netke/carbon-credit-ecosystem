import React, { useState } from "react";
//import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "./UserLogin.css";

const loginGenerator = async (formData) => {
    const { username, password } = formData;

    try {
        const response = await fetch("http://localhost:8000/api/login", {
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
        const response = await fetch("http://localhost:8000/api/login", {
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
        const response = await fetch("http://localhost:8000/api/login", {
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

const GeneratorLogin = ({ formData, handleChange }) => (
    <React.Fragment>
        <h1>GENERATOR LOGIN</h1>
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
    </React.Fragment>
);

const ConsumerLogin = ({ formData, handleChange }) => (
    <React.Fragment>
        <h1>CONSUMER LOGIN</h1>
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
    </React.Fragment>
);

const ValidatorLogin = ({ formData, handleChange }) => (
    <React.Fragment>
        <h1>VALIDATOR LOGIN</h1>
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
    </React.Fragment>
);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        let isLoggedIn = false;
        switch (userType) {
            case "generator":
                isLoggedIn = await loginGenerator(formData);
                break;
            case "consumer":
                isLoggedIn = await loginConsumer(formData);
                break;
            case "validator":
                isLoggedIn = await loginValidator(formData);
                break;
            default:
                break;
        }

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

    let Component;
    switch (userType) {
        case "generator":
            Component = GeneratorLogin;
            break;
        case "consumer":
            Component = ConsumerLogin;
            break;
        case "validator":
            Component = ValidatorLogin;
            break;
        default:
            break;
    }

    return (
        <React.Fragment>
            <div className="user-login">
                <form className="login-form" onSubmit={handleSubmit}>
                    <Component formData={formData} handleChange={handleChange} />
                    <button type="submit" className="form-submit">
                        Login
                    </button>
                </form>
            </div>
        </React.Fragment>
    );
};

export default UserLogin;
