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

const App=()=>{
  const [isLoggedIn, setIsLoggedIn]=useState(false);

  let routes;
  if(isLoggedIn)
  {
    routes=(
      <Switch>
        <Route 
          path="/user-dashboard" 
          exact 
          render={(props)=>{
            return <UserDashboard {...props} userType={props.location.state?.userType} />;
          }}
        />
      </Switch>); 
  }else
  {
    routes=(
      <Switch>
        <Route 
          path="/user-selection" 
          exact 
          render={(props)=>{
            return <UserSelection {...props} userType={props.location.state?.userType} />;
          }}
        />

        <Route 
          path="/user-login" 
          exact 
          render={(props)=>{
            return <UserLogin {...props} userType={props.location.state?.userType} />;
          }}
        />

        <Route 
          path="/user-registration" 
          exact 
          render={(props)=>{
            return <UserRegistration {...props} userType={props.location.state?.userType} />;
          }}
        />

        <Redirect to="/user-selection"/>
      </Switch>);
  }

  return (
    <Router>
      <div className="App">
        {routes}
      </div>
    </Router>);
};

export default App;
