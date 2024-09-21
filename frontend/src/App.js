import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import UserAuthentication from "./pages/UserAuthentication/UserAuthentication";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import React from "react";

const App=()=>{
  let routes;
  routes=(
    <Switch>
      <Route path="/user-authentication"
        exact
        render={()=><UserAuthentication/>}
      />

      <Route 
        path="/user-dashboard" 
        exact render={(props)=>{
          return <UserDashboard {...props} userType={props.location.state?.userType} />;
        }}/>

    </Switch>
  );

  return (
  <Router>
    <div className="App">
      {routes}
    </div>
  </Router>);
}

export default App;
