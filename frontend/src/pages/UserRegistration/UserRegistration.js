import "./UserRegistration.css";
import React, { useState } from "react";

const registerGenerator = async (formData) => {
    const { email, walletAddress, username, password } = formData;

    try {
        const response = await fetch("http://localhost:8000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                walletAddress,
                username,
                password,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return true;
        } else {
            const error = await response.json();
            console.log(error);
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

const registerConsumer = async (formData) => {
    const { email, walletAddress, username, password } = formData;

    try {
        const response = await fetch("http://localhost:8000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                walletAddress,
                username,
                password,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return true;
        } else {
            const error = await response.json();
            console.log(error);
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

const registerValidator = async (formData) => {
    const { email, walletAddress, username, password } = formData;

    try {
        const response = await fetch("http://localhost:8000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                walletAddress,
                username,
                password,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return true;
        } else {
            const error = await response.json();
            console.log(error);
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

const GeneratorRegistration = ({ formData, handleChange }) => (
    <React.Fragment>
        <h1>GENERATOR REGISTRATION</h1>
        <input
            className="form-ip"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
        />
        <input
            className="form-ip"
            type="text"
            name="walletAddress"
            placeholder="Ethereum Wallet Address"
            value={formData.walletAddress}
            onChange={handleChange}
        />
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

const ConsumerRegistration = ({ formData, handleChange }) => (
    <React.Fragment>
        <h1>CONSUMER REGISTRATION</h1>
        <input
            className="form-ip"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
        />
        <input
            className="form-ip"
            type="text"
            name="walletAddress"
            placeholder="Ethereum Wallet Address"
            value={formData.walletAddress}
            onChange={handleChange}
        />
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

const ValidatorRegistration = ({ formData, handleChange }) => (
    <React.Fragment>
        <h1>VALIDATOR REGISTRATION</h1>
        <input
            className="form-ip"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
        />
        <input
            className="form-ip"
            type="text"
            name="walletAddress"
            placeholder="Ethereum Wallet Address"
            value={formData.walletAddress}
            onChange={handleChange}
        />
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

const UserRegistration = (props) => {
    const { userType } = props.location.state;
    const { setIsLoggedIn, setUserType } = props;
    setUserType(userType);

    const [formData, setFormData] = useState({
        email: "",
        walletAddress: "",
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let isRegistered = false;
        switch (userType) {
            case "generator":
                isRegistered = await registerGenerator(formData);
                break;
            case "consumer":
                isRegistered = registerConsumer(formData);
                break;
            case "validator":
                isRegistered = registerValidator(formData);
                break;
            default:
                break;
        }

        if (isRegistered) {
            setIsLoggedIn(true);
            props.history.push({
                pathname: "/user-dashboard",
                state: { userType },
            });
        } else {
            alert("Registration Failed!");
        }
    };

    let Component;
    switch (userType) {
        case "generator":
            Component = GeneratorRegistration;
            break;
        case "consumer":
            Component = ConsumerRegistration;
            break;
        case "validator":
            Component = ValidatorRegistration;
            break;
        default:
            break;
    }

    return (
        <React.Fragment>
            <div className="user-registration">
                <form className="registration-form" onSubmit={handleSubmit}>
                    <Component formData={formData} handleChange={handleChange} />
                    <button type="submit" className="form-submit">
                        Registecdr
                    </button>
                </form>
            </div>
        </React.Fragment>
    );
};

export default UserRegistration;
