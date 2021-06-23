import { useState } from "react";
import ProductPicker from "../../components/ProductPicker";
import BarcodePicker from "../../components/BarcodePicker";
import "./index.css";

const Transaction = () => {
  const [toggleBarcode, setToggleBarcode] = useState(true);

  const handlePickProduct = (pickedProduct) => {
    console.log(pickedProduct);
  };

  //
  // Toggle between barcode and icons component
  //
  const handleClick = () => {
    setToggleBarcode(!toggleBarcode);
  };

  return (
    <div className="container fadeIn">
      <div className="row mt-4 mx-auto justify-content-start">
        <button
          className="btn btn-dark toggle-button"
          type="button"
          onClick={handleClick}
          disabled={toggleBarcode}
        >
          <i className="bi bi-upc"></i> Barcode
        </button>
        <button
          className="btn btn-dark toggle-button"
          type="button"
          onClick={handleClick}
          disabled={!toggleBarcode}
        >
          <i className="bi bi-back"></i> Icons
        </button>
      </div>
      <br />
      <div className="row justify-content-center">
        <div className="col-md-6">
          {toggleBarcode ? (
            <BarcodePicker handlePickProduct={handlePickProduct} />
          ) : (
            <ProductPicker handlePickProduct={handlePickProduct} />
          )}
        </div>
        <div className="col-md-6" style={{ backgroundColor: "blue" }}>
          Transaction Page Transaction Page Transaction Page Transaction Page
        </div>
      </div>
    </div>
  );
};

export default Transaction;
