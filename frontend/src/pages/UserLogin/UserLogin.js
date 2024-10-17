import "./UserLogin.css";

const GeneratorLogin=()=>{
    return <h1>Generator Login</h1>;
}

const ConsumerLogin=()=>{
    return <h1>Consumer Login</h1>;
}

const ValidatorLogin=()=>{
    return <h1>Validator Login</h1>;
}

const UserLogin=(props)=>{
    const {userType}=props.location.state;

    let Component;
    switch(userType){
        case "generator":
            Component=GeneratorLogin;
            break;
        
        case "consumer":
            Component=ConsumerLogin;
            break;
        
        case "validator":
            Component=ValidatorLogin;
            break;
    }

    return <div className="login-page"><Component/></div>;
}

export default UserLogin;