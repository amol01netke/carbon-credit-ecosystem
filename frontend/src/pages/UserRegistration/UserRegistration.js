import "./UserRegistration.css";

const GeneratorRegistration=()=>{
    return <h1>Generator Login</h1>;
}

const ConsumerRegistration=()=>{
    return <h1>Consumer Login</h1>;
}

const ValidatorRegistration=()=>{
    return <h1>Validator Login</h1>;
}

const UserRegistration=(props)=>{
    const {userType}=props.location.state;

    let Component;
    switch(userType){
        case "generator":
            Component=GeneratorRegistration;
            break;
        
        case "consumer":
            Component=ConsumerRegistration;
            break;
        
        case "validator":
            Component=ValidatorRegistration;
            break;
    }

    return <div className="login-page"><Component/></div>;
}

export default UserRegistration;
