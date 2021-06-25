import { useState, useEffect } from "react";
import { apiUrl } from "../../components/HelperFunctions";
import axios from "axios";
import ProductPicker from "../../components/ProductPicker";
import BarcodePicker from "../../components/BarcodePicker";
import "./index.css";

const Transaction = () => {
  const [toggleBarcode, setToggleBarcode] = useState(true);
  const [products, setProducts] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [transButtons, setTransButtons] = useState(true);
  const [categoryDiscount, setCategoryDiscount] = useState([]);
  const [checkoutValues, setCheckoutValues] = useState({
    subtotal: 0,
    tax: 0,
    grandtotal: 0,
  });

  //
  // Fetch all categories and get the titles
  // and the discount to calculate the product price.
  //
  useEffect(() => {
    // Get all categories
    const fetchAllCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}categories/`, {
          headers: {
            "auth-token": localStorage.usertoken,
          },
        });
        // Set only the titles and discount
        // of the categories to the array.
        response.data.allCategories.forEach((element) => {
          const categoryDiscountItem = {
            title: element.title,
            discount: element.discount,
            discountExpiration: element.discountExpiration,
          };
          setCategoryDiscount((previous) => {
            return [...previous, categoryDiscountItem];
          });
        });
      } catch (error) {
        console.error(error.response.data);
        alert(error.response.data);
      }
    };

    // Get all store data
    const fetchStoreData = async () => {
      try {
        const response = await axios.get(`${apiUrl}store/`, {
          headers: {
            "auth-token": localStorage.usertoken,
          },
        });
        // Set only the first array entry
        setStoreData(response.data.store[0]);
      } catch (error) {
        console.error(error.response.data);
        alert(error.response.data);
      }
    };

    // Fetch all categories if not already fetched
    if (categoryDiscount.length === 0) {
      fetchAllCategories();
    }

    // Fetch all store data if not already fetched
    if (storeData.length === 0) {
      fetchStoreData();
    }
  }, [categoryDiscount, storeData]);

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

      // ...calculate the price using the discount values and
      // assing the result to both price and total price fields
      // and also the final discount value on discount field...
      const { price, discount } = calculatePrice(newProduct);
      newProduct.totalPrice = newProduct.price = price;
      newProduct.discount = discount;

      // ...and set it to the array
      setProducts((previous) => {
        return [...previous, newProduct];
      });

      // Update the checkout values
      calculateCheckout();
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
    calculateCheckout();

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
    calculateCheckout();
  };

  //
  // Calculate the product price using the discount
  // values of the product or the category.
  //
  const calculatePrice = (newProduct) => {
    // Get the actual date
    const newDate = new Date();
    const newLocaleDateString = newDate.toLocaleDateString();

    // Variable to store the final discount
    let productDiscount = 0;

    // Check if the discount date of the product is
    // not expired. If not, get the discount of the product.
    if (newProduct.discountExpiration > newLocaleDateString) {
      productDiscount = newProduct.discount;
    } else {
      // Else check if the discount date of the category is
      // not expired. If not, get the discount of the category.
      const categoryToCheck = categoryDiscount.filter(
        (item) => item.title === newProduct.category
      );

      if (categoryToCheck[0].discountExpiration > newLocaleDateString) {
        productDiscount = categoryToCheck[0].discount;
      }
    }

    // Finally, check if the product discount remais zero.
    // If yes, send back the actual product price.
    if (productDiscount === 0) {
      return {
        price: newProduct.price,
        discount: productDiscount,
      };
    } else {
      // Else calculate the discount and update the price
      const finalDiscount = (productDiscount / 100) * newProduct.price;
      return {
        price: newProduct.price - finalDiscount,
        discount: productDiscount,
      };
    }
  };

  //
  // Calculate the checkout values
  //
  const calculateCheckout = () => {
    /* const newGrandtotal = checkoutValues.grandtotal + priceToAdd;
    const newTax = (storeData.tax / 100) * newGrandtotal;
    const newSubtotal = newGrandtotal - newTax;

    const newValues = {
      subtotal: newSubtotal,
      tax: newTax,
      grandtotal: newGrandtotal,
    };

    setCheckoutValues(newValues); */
  };

  //
  // Cancel transaction.
  // Empty the cart (products).
  //
  const handleCancelClick = () => {
    const newArray = [];
    setProducts(newArray);
    calculateCheckout();

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
            <h6>Subtotal: €{checkoutValues.subtotal.toFixed(2)}</h6>
          </div>
          <hr></hr>
          <div className="row justify-content-end">
            <h6>Tax: €{checkoutValues.tax.toFixed(2)}</h6>
          </div>
          <hr></hr>
          <div className="row justify-content-end">
            <h4>Grand Total: €{checkoutValues.grandtotal.toFixed(2)}</h4>
          </div>
          <hr></hr>
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
