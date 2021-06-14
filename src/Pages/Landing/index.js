import React from "react";
import logo from "../../assets/logo.png";
import "./index.css";

const Landing = () => {
  return (
    <div className="container">
      <div className="col-md-6 mt-5 mx-auto">
        <img src={logo} alt="Awesome POS" className="center" />
        <h1 className="text-center">Welcome to</h1>
        <h1 className="text-center">Awesome POS</h1>
      </div>
    </div>
  );
};

export default Landing;
