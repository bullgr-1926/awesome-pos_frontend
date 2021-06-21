import ProductPicker from "../../components/ProductPicker";
import "./index.css";

const Transaction = () => {
  return (
    <div className="container fadeIn">
      <div className="row justify-content-center">
        <h1 className="text-center">Transaction Page</h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <ProductPicker />
        </div>
        <div className="col-md-6" style={{ backgroundColor: "blue" }}>
          Transaction Page Transaction Page Transaction Page Transaction Page
        </div>
      </div>
    </div>
  );
};

export default Transaction;
