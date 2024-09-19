import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import UserAuthentication from "./pages/UserAuthentication/UserAuthentication";
import React from "react";
import GovtDashboard from "./pages/GovtDashboard/GovtDashboard";
import FarmerDashboard from "./pages/FarmerDashboard/FarmerDashboard";
import IndustryDashboard from "./pages/IndustryDashboard/IndustryDashboard";

const App=()=>{
  let routes;
  routes=(
    <Switch>
      <Route path="/user-authentication"
        exact
        render={()=><UserAuthentication/>}
      />
      <Route path="/farmer-dashboard"
        exact 
        render={()=><FarmerDashboard/>}
      />
      <Route path="/industry-dashboard"
        exact 
        render={()=><IndustryDashboard/>}
      />
      <Route path="/govt-dashboard"
        exact 
        render={()=><GovtDashboard/>}
      />
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
