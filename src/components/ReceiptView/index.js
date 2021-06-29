import { useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./index.css";

const ReceiptView = () => {
  const history = useHistory();

  // Get the params and set them to data object
  const location = useLocation();
  const receiptData = location.state.params;

  const [storeData] = useContext(StoreContext);

  //
  // Go back to the report page
  //
  const handleDonelClick = () => {
    history.push("/report");
  };

  //
  // Print the receipt
  //
  const handlePrintClick = () => {
    // Print the receipt
    window.print();
  };

  return (
    <div className="container fadeIn">
      <div className="row">
        <div className="col-md-3 mt-5 mx-auto">
          <h5 className="text-center">Receipt</h5>
          <h6 className="text-center h6-receipt">
            {storeData.title}
            <br />
            {storeData.street}
            <br />
            {storeData.postcode} {storeData.city}
            <br />
            Tel. {storeData.phone}
          </h6>
          <h6 className="text-center h6-receipt">{receiptData.createdAt}</h6>
          <h6 className="text-center h6-receipt">
            {receiptData._id}
            <br />
            {receiptData.userId}
          </h6>
          <table className="table table-receipt">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              {receiptData.products.map((item, index) => (
                <tr key={index} className="fadeIn">
                  <td>
                    {item.title} x {item.items}
                  </td>
                  <td>
                    {storeData.currency}
                    {item.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row checkoutValue justify-content-end">
            <h6 className="h6-receipt">
              Subtotal: {storeData.currency}
              {receiptData.subtotal.toFixed(2)}
            </h6>
          </div>
          <div className="row checkoutValue justify-content-end">
            <h6 className="h6-receipt">
              Tax({storeData.tax}%): {storeData.currency}
              {receiptData.taxtotal.toFixed(2)}
            </h6>
          </div>
          <div className="row checkoutValue justify-content-end">
            <h4 className="h4-receipt">
              Grand Total: {storeData.currency}
              {receiptData.grandtotal.toFixed(2)}
            </h4>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <button
          className="btn btn-dark transaction-button printPageButton"
          type="button"
          onClick={handleDonelClick}
        >
          <i className="bi bi-check-circle"></i> Done
        </button>
        <button
          className="btn btn-success transaction-button printPageButton"
          type="button"
          onClick={handlePrintClick}
        >
          <i className="bi bi-printer"></i> Print
        </button>
      </div>
    </div>
  );
};

export default ReceiptView;
