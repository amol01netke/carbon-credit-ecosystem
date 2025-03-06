import "./UserRegistration.css";
import React, { useState } from "react";

const registerGenerator = async (formData) => {
    const { firstName, lastName, email, username, password } = formData;

    try {
        const response = await fetch("http://localhost:8000/api/register-generator", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
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
    const { firstName, lastName, email, username, password } = formData;

    try {
        const response = await fetch("http://localhost:8000/api/register-consumer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
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
    const { role, firstName, lastName, email, username, password } = formData;

    try {
        const response = await fetch("http://localhost:8000/api/register-validator", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                role,
                firstName,
                lastName,
                email,
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

const GeneratorRegistration = (props,{setIsLoggedIn,userType}) => {
    const [formData, setFormData] = useState({
        firstName:"",
        lastName:"",
        email: "",
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
        isRegistered = await registerGenerator(formData);
    
        if (isRegistered) {
            setIsLoggedIn(true);
            props.history.push({
                pathname: "/user-dashboard",
                state: { userType },
            });
        } else {
            alert("Registration Failed!");
        }
    }

    return (   
        <React.Fragment>
            <form className="registration-form" onSubmit={handleSubmit}>
                <h1>{props.userType} REGISTRATION</h1>
                <div className="name-ip">
                    <input
                        className="form-ip"
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    <input
                        className="form-ip"
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>
                
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
                <button type="submit" className="form-submit"> Register </button>
            </form>
        </React.Fragment>
    );
};

const ConsumerRegistration = (props,{setIsLoggedIn,userType}) => {
    const [formData, setFormData] = useState({
        firstName:"",
        lastName:"",
        email: "",
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
        isRegistered = await registerConsumer(formData);
    
        if (isRegistered) {
            setIsLoggedIn(true);
            props.history.push({
                pathname: "/user-dashboard",
                state: { userType },
            });
        } else {
            alert("Registration Failed!");
        }
    }

    return (   
        <React.Fragment>
            <form className="registration-form" onSubmit={handleSubmit}>
                <h1>{props.userType} REGISTRATION</h1>
                <div className="name-ip">
                    <input
                        className="form-ip"
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    <input
                        className="form-ip"
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>
                
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
                <button type="submit" className="form-submit"> Register </button>
            </form>
        </React.Fragment>
    );
};

const ValidatorRegistration = (props,{setIsLoggedIn,userType}) => {
    const [formData, setFormData] = useState({
        firstName:"",
        lastName:"",
        email: "",
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            return updatedData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let isRegistered = false;
        isRegistered = await registerValidator(formData);
    
        if (isRegistered) {
            setIsLoggedIn(true);
            props.history.push({
                pathname: "/user-dashboard",
                state: { userType,role: formData.role },
            });
        } else {
            alert("Registration Failed!");
        }
    }

    return (   
        <React.Fragment>
            <form className="registration-form" onSubmit={handleSubmit}>
                <h1>{props.userType} REGISTRATION</h1>
                <div className="name-ip">
                    <input
                        className="form-ip"
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    <input
                        className="form-ip"
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>
                
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
                <button type="submit" className="form-submit"> Register </button>
            </form>
        </React.Fragment>
    );
};

const UserRegistration = (props) => {
    const { userType } = props.location.state;
    const { setIsLoggedIn, setUserType } = props;
    setUserType(userType);


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
            <Component setIsLoggedIn={setIsLoggedIn} userType={userType}/>
        </div>
    </React.Fragment>
    );
};


export default UserRegistration;
