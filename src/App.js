import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Landing from "./Pages/Landing/Landing";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Transaction from "./Pages/Transaction/Transaction";
import Report from "./Pages/Report/Report";
import Categories from "./Pages/Categories/Categories";
import Products from "./Pages/Products/Products";
import Users from "./Pages/Users/Users";
import Profile from "./Pages/Profile/Profile";

const App = () => {
  return (
    <Router>
      <div className="App">
        <div className="App-header">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path="/login" component={Login} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/transaction" component={Transaction} />
            <Route exact path="/report" component={Report} />
            <Route exact path="/categories" component={Categories} />
            <Route exact path="/products" component={Products} />
            <Route exact path="/users" component={Users} />
            <Route exact path="/profile" component={Profile} />
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
