import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

// Navigation bar
import Navbar from "./components/Navbar";

// Pages
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Transaction from "./Pages/Transaction";
import Report from "./Pages/Report";
import Categories from "./Pages/Categories";
import Products from "./Pages/Products";
import Users from "./Pages/Users";
import Profile from "./Pages/Profile";
import Store from "./Pages/Store";

// Components
import CategoryEdit from "./components/CategoryEdit";
import CategoryNew from "./components/CategoryNew";
import ProductEdit from "./components/ProductEdit";
import ProductNew from "./components/ProductNew";
import ProfileEdit from "./components/ProfileEdit";
import UserEdit from "./components/UserEdit";
import UserNew from "./components/UserNew";

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
            <Route exact path="/store" component={Store} />
            <Route exact path="/category_edit" component={CategoryEdit} />
            <Route exact path="/category_new" component={CategoryNew} />
            <Route exact path="/product_edit" component={ProductEdit} />
            <Route exact path="/product_new" component={ProductNew} />
            <Route exact path="/profile_edit" component={ProfileEdit} />
            <Route exact path="/user_edit" component={UserEdit} />
            <Route exact path="/user_new" component={UserNew} />
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
