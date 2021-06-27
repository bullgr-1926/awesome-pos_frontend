import { useState, useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { StoreContext } from "../../context/StoreContext";
import { getToken, receiptCreate } from "../../components/HelperFunctions";
import "./index.css";

const CheckoutPrint = () => {
  const history = useHistory();

  // Get the params and set them to data object
  const location = useLocation();
  const checkoutValues = location.state.params;

  // User id from profile token
  const [userId, setUserId] = useState("");

  const [products, setProducts] = useContext(CartContext);
  const [storeData] = useContext(StoreContext);
  const [dateString, setDateString] = useState("");

  // Receipt data object
  const receiptData = {
    products: products,
    userId: userId,
    createdAt: dateString,
    tax: storeData.tax,
    subtotal: checkoutValues.subtotal,
    taxtotal: checkoutValues.taxtotal,
    grandtotal: checkoutValues.grandtotal,
  };

  //
  // Decode the token and set the user id
  // for the logged in user
  //
  useEffect(() => {
    const decoded = getToken();
    const newUserId = decoded.user._id;
    setUserId(newUserId);
  }, []);

  //
  // Create a date string for the receipt
  //
  useEffect(() => {
    const actualDate = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    };
    const newDate = actualDate.toLocaleString("de", options);
    setDateString(newDate);
  }, []);

  //
  // Go back to the transaction
  //
  const handleCancelClick = () => {
    history.push("/transaction");
  };

  //
  // Print the receipt and save it to database.
  // Toggle also the cancel and done buttons.
  //
  const handlePrintClick = () => {
    // Print the receipt
    window.print();

    // Save the receipt to database and if successfull
    // empty the products array (cart) and return to transaction page.
    receiptCreate(receiptData).then((res) => {
      if (res) {
        setProducts([]);
        history.push("/transaction");
      }
    });
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
          <h6 className="text-center h6-receipt">{dateString}</h6>
          <h6 className="text-center user-id h6-receipt">{userId}</h6>
          <table className="table table-receipt">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
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
              {checkoutValues.subtotal.toFixed(2)}
            </h6>
          </div>
          <div className="row checkoutValue justify-content-end">
            <h6 className="h6-receipt">
              Tax({storeData.tax}%): {storeData.currency}
              {checkoutValues.taxtotal.toFixed(2)}
            </h6>
          </div>
          <div className="row checkoutValue justify-content-end">
            <h4 className="h4-receipt">
              Grand Total: {storeData.currency}
              {checkoutValues.grandtotal.toFixed(2)}
            </h4>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <button
          className="btn btn-danger transaction-button printPageButton"
          type="button"
          onClick={handleCancelClick}
        >
          <i className="bi bi-x-circle"></i> Cancel
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

export default CheckoutPrint;
