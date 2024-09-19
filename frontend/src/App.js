import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import UserAuthentication from "./pages/UserAuthentication/UserAuthentication";
import React from "react";

const App=()=>{
  let routes=(
    <Switch>
      <Route path="/user-authentication"
        exact
        render={()=><UserAuthentication/>}
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
