import { useState, useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./index.css";

const ReceiptView = () => {
  let history = useHistory();

  // Get the params and set them to data object
  const location = useLocation();
  const receiptToView = location.state.params;

  console.log(receiptToView);

  return (
    <div className="container fadeIn">
      <div className="col-md-6 mt-5 mx-auto">
        <h1 className="text-center fadeIn">ReceiptView Page</h1>
      </div>
    </div>
  );
};

export default ReceiptView;
