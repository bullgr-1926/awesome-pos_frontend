import React from "react";
import { Link, withRouter, useHistory } from "react-router-dom";

const Navbar = () => {
  let history = useHistory();

  const logOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("usertoken");
    localStorage.removeItem("userrole");
    history.push(`/`);
  };

  const loginLink = (
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </li>
    </ul>
  );

  const userAdminLink = (
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/transaction" className="nav-link">
          Transaction
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/report" className="nav-link">
          Report
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/categories" className="nav-link">
          Categories
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/products" className="nav-link">
          Products
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/users" className="nav-link">
          Users
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/profile" className="nav-link">
          Profile
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/store" className="nav-link">
          Store
        </Link>
      </li>
      <li className="nav-item">
        <a href="#endregion" onClick={logOut} className="nav-link">
          Logout
        </a>
      </li>
    </ul>
  );

  const userCashierLink = (
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link to="/transaction" className="nav-link">
          Transaction
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/profile" className="nav-link">
          Profile
        </Link>
      </li>
      <li className="nav-item">
        <a href="#endregion" onClick={logOut} className="nav-link">
          Logout
        </a>
      </li>
    </ul>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded">
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div
        className="collapse navbar-collapse justify-content-md-center"
        id="navbarNav"
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
        </ul>
        {localStorage.usertoken
          ? localStorage.userrole === "Admin"
            ? userAdminLink
            : userCashierLink
          : loginLink}
      </div>
    </nav>
  );
};

export default withRouter(Navbar);
