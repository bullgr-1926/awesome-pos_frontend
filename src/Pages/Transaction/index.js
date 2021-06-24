import { useState } from "react";
import ProductPicker from "../../components/ProductPicker";
import BarcodePicker from "../../components/BarcodePicker";
import "./index.css";

const Transaction = () => {
  const [toggleBarcode, setToggleBarcode] = useState(true);
  const [products, setProducts] = useState([]);
  const [transButtons, setTransButtons] = useState(true);

  //
  // Set new product in products array.
  // Check if it's already in the array.
  // If yes, instead increase the item amount.
  //
  const handlePickProduct = (pickedProduct) => {
    // Check if the picked product already
    // exist in the products array.
    const productExist = products.findIndex(
      (item) => item._id === pickedProduct._id
    );

    // If yes, update only the items amount
    if (productExist !== -1) {
      const newAmount = products[productExist].items + 1;
      updateProducts(productExist, newAmount);
    } else {
      // Else create a new product...
      const newProduct = {
        _id: pickedProduct._id,
        title: pickedProduct.title,
        category: pickedProduct.category,
        price: pickedProduct.price,
        totalPrice: pickedProduct.price,
        items: 1,
        discount: pickedProduct.discount,
        discountExpiration: pickedProduct.discountExpiration,
      };

      // ...and set it to the array
      setProducts((previous) => {
        return [...previous, newProduct];
      });
    }

    //Activate the transaction buttons
    // if not already.
    setTransButtons(false);
  };

  //
  // Toggle between barcode and icons component
  //
  const handleToggleClick = () => {
    setToggleBarcode(!toggleBarcode);
  };

  //
  // Increase the amount of clicked item
  // and send it with the index to the
  // products update array function.
  //
  const handleIncreaseClick = (e) => {
    const indexOfItem = e.target.id;
    const newAmount = products[indexOfItem].items + 1;
    updateProducts(indexOfItem, newAmount);
  };

  //
  // Decrease the amount of clicked item.
  // The amount must at least be 1.
  // And send it with the index to the
  // products update array function.
  //
  const handleDecreaseClick = (e) => {
    const indexOfItem = e.target.id;
    let newAmount = products[indexOfItem].items - 1;

    // Check if the new amount is lesser than 1.
    // If yes, set it to 1.
    if (newAmount < 1) {
      newAmount = 1;
    }

    updateProducts(indexOfItem, newAmount);
  };

  //
  // Delete the clicked item
  //
  const handleDeleteClick = (e) => {
    const indexOfItem = e.target.id;
    const newArray = [...products];
    newArray.splice(indexOfItem, 1);
    setProducts(newArray);

    // Check if there is any product in cart.
    // If not, disable the transaction buttons.
    if (newArray.length === 0) {
      setTransButtons(true);
    }
  };

  //
  // Update the products array.
  //
  const updateProducts = (index, amount) => {
    const newArray = [...products];

    // Set the items
    newArray[index].items = amount;

    // Calculate the new price
    newArray[index].totalPrice = amount * newArray[index].price;

    setProducts(newArray);
  };

  //
  // Cancel transaction.
  // Empty the cart (products).
  //
  const handleCancelClick = () => {
    const newArray = [];
    setProducts(newArray);

    // Disable the transaction buttons
    setTransButtons(true);
  };

  return (
    <div className="container fadeIn">
      <div className="row mt-4 mx-auto justify-content-start">
        <button
          className="btn btn-dark toggle-button"
          type="button"
          onClick={handleToggleClick}
          disabled={toggleBarcode}
        >
          <i className="bi bi-upc"></i> Barcode
        </button>
        <button
          className="btn btn-dark toggle-button"
          type="button"
          onClick={handleToggleClick}
          disabled={!toggleBarcode}
        >
          <i className="bi bi-back"></i> Icons
        </button>
      </div>
      <br />
      <div className="row justify-content-start">
        <div className="col-md-5">
          {toggleBarcode ? (
            <BarcodePicker handlePickProduct={handlePickProduct} />
          ) : (
            <ProductPicker handlePickProduct={handlePickProduct} />
          )}
        </div>
        <div className="col-md-1 line"></div>
        <div className="col-md-6 receipt">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Items</th>
                <th scope="col">Disc.</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <tr key={index} className="fadeIn">
                  <th scope="col">{index + 1}</th>
                  <td>{item.title}</td>
                  <td>{item.items}</td>
                  <td>{item.discount + "%"}</td>
                  <td>{"€" + item.totalPrice.toFixed(2)}</td>
                  <td>
                    <button className="btn" type="button">
                      <i
                        className="bi bi-plus-circle"
                        onClick={handleIncreaseClick}
                        id={index}
                      ></i>
                    </button>
                  </td>
                  <td>
                    <button className="btn" type="button">
                      <i
                        className="bi bi-dash-circle"
                        onClick={handleDecreaseClick}
                        id={index}
                      ></i>
                    </button>
                  </td>
                  <td>
                    <button className="btn" type="button">
                      <i
                        className="bi bi-trash"
                        onClick={handleDeleteClick}
                        id={index}
                      ></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row justify-content-end">
            <button
              className="btn btn-danger transaction-button"
              type="button"
              onClick={handleCancelClick}
              disabled={transButtons}
            >
              <i className="bi bi-x-circle"></i> Cancel
            </button>
            <button
              className="btn btn-success transaction-button"
              type="button"
              onClick={handleToggleClick}
              disabled={transButtons}
            >
              <i className="bi bi-cart-check"></i> Checkout
            </button>
          </div>
          <div className="row justify-content-end"></div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
