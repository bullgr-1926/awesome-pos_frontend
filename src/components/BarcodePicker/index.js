import { useState, useEffect } from "react";
import { productByBarcode } from "../../components/HelperFunctions";
import "./index.css";

const BarcodePicker = (props) => {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
  });
  const [barcode, setBarcode] = useState("");
  const [delay, setDelay] = useState(false);

  //
  // Delay everytime the user submit a barcode
  // to be able to see the barcode in the input
  // field and empty after delay.
  //
  useEffect(() => {
    if (delay) {
      const interval = setInterval(() => {
        setBarcode("");
        setDelay(false);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [delay]);

  //
  // Submit and fetch the new barcode.
  // If succeed, set the product data.
  // Finaly, set the delay to true to trigger.
  //
  const onSubmit = (e) => {
    e.preventDefault();

    // Fetch only if the barcode field is not empty
    if (barcode) {
      productByBarcode(barcode).then((res) => {
        if (res) {
          setProduct(res);
          props.handlePickProduct(res);
        }
      });

      setDelay(true);
    }
  };

  //
  // Set the barcode
  //
  const onChange = (e) => {
    let newBarcode = e.target.value;
    setBarcode(newBarcode);
  };

  return (
    <div className="container fadeIn">
      <form onSubmit={onSubmit}>
        <div className="input-group input-group-lg">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-lg">
              Barcode
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            value={barcode}
            placeholder="Please use barcode scanner"
            onChange={onChange}
            autoFocus
            aria-label="Large"
            aria-describedby="inputGroup-sizing-sm"
          />
        </div>
      </form>
      <br />
      <form>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={product.title}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            className="form-control"
            name="description"
            value={product.description}
            readOnly
          />
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              className="form-control"
              name="role"
              value={product.category}
              readOnly
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="price">Price (€)</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={product.price.toFixed(2)}
              readOnly
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default BarcodePicker;
