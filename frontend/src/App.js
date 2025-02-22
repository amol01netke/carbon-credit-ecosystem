import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import UserLogin from "./pages/UserLogin/UserLogin";
import UserRegistration from "./pages/UserRegistration/UserRegistration";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import React from "react";
import { useState } from "react";
import UserSelection from "./pages/UserSelection/UserSelection";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import UserEvidence from "./pages/UserEvidence/UserEvidence";
import {WalletProvider} from "./context/WalletContext";

const App=()=>{
  const [isLoggedIn, setIsLoggedIn]=useState(false);
  const [userType, setUserType]=useState("generator");

  let routes;
  if(isLoggedIn)
  {
    routes=(
      <Switch>
        <Route 
          path="/user-dashboard" 
          exact 
          render={(props)=>{
            return <UserDashboard {...props} userType={userType} setIsLoggedIn={setIsLoggedIn}/>;
          }}
        />

        <Route 
          path="/user-evidence" 
          exact 
          render={(props)=>{
            return <UserEvidence {...props}/>;
          }}
        />
      
        <Redirect to="/user-dashboard"></Redirect>
      </Switch>); 
  }else
  {
    routes=(
      <Switch>
        <Route 
          path="/user-selection" 
          exact 
          render={(props)=>{
            return <UserSelection {...props}/>;
          }}
        />

        <Route 
          path="/user-login" 
          exact 
          render={(props)=>{
            return <UserLogin {...props}  setIsLoggedIn={setIsLoggedIn} setUserType={setUserType}/>;
          }}
        />

        <Route 
          path="/user-registration" 
          exact 
          render={(props)=>{
            return <UserRegistration {...props} setIsLoggedIn={setIsLoggedIn} setUserType={setUserType}/>;
          }}
        />

        <Redirect to="/user-selection"></Redirect>
      </Switch>);
  }

  return (
  <WalletProvider>
    <Router>
      <div className="App">
        {routes}
      </div>
    </Router>
  </WalletProvider>
  );
};

export default App;
