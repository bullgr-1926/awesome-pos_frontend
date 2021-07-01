import { useState, useEffect, useContext } from "react";
import { productCreate, apiUrl } from "../../components/HelperFunctions";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "./index.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { StoreContext } from "../../context/StoreContext";

const ProductNew = () => {
  let history = useHistory();

  // Get the params and set them to data object
  const [startDate, setStartDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [storeData] = useContext(StoreContext);
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    barcode: "",
    discount: 0,
    discountExpiration: new Date(),
  });

  useEffect(() => {
    // Get all categories
    const fetchAllCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}categories/`, {
          headers: {
            "auth-token": localStorage.usertoken,
          },
        });
        // Set only the titles of the categories to the array
        response.data.allCategories.forEach((element) => {
          setCategories((previous) => [...previous, element["title"]]);
        });
      } catch (error) {
        console.error(error.response.data);
        alert(error.response.data);
      }
    };

    // Fetch all categories if not already fetched
    if (categories.length === 0) {
      fetchAllCategories();
    }
  }, [categories]);

  // Submit the changes
  const onSubmit = (e) => {
    e.preventDefault();

    productCreate(data).then((res) => {
      if (res) {
        history.push("/products");
      }
    });
  };

  // Submit the changes from date picker
  const onDateChange = (newDate) => {
    let keyName = "discountExpiration";
    let newDisplayDate = newDate.toLocaleDateString();

    setStartDate(newDate);
    setDisplayDate(newDisplayDate);

    setData((previous) => {
      return {
        ...previous,
        [keyName]: newDate,
      };
    });
  };

  // Change the correspond object field
  const onChange = (e) => {
    let keyName = e.target.name;
    let value = e.target.value;
    setData((previous) => {
      return {
        ...previous,
        [keyName]: value,
      };
    });
  };

  // Change the category from dropdown
  const onDropdownChange = (e) => {
    let value = e.value;
    setData((previous) => {
      return {
        ...previous,
        category: value,
      };
    });
  };

  return (
    <div className="container fadeIn">
      <div className="row">
        <div className="col-md-6 mt-5 mx-auto">
          <form onSubmit={onSubmit}>
            <h1 className="h3 mb-3 font-weight-normal">
              Please edit or delete the selected product
            </h1>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                placeholder="Enter title"
                value={data.title}
                required
                onChange={onChange}
                maxLength="20"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                name="description"
                placeholder="Enter description"
                value={data.description}
                required
                onChange={onChange}
                maxLength="30"
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>{" "}
              <Dropdown
                options={categories}
                onChange={onDropdownChange}
                value={data.category}
                placeholder="Select a category"
              />
            </div>
            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="price">Price ({storeData.currency})</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={data.price}
                  required
                  min="0"
                  step="0.01"
                  onChange={onChange}
                />
              </div>
              <div className="form-group col-md-8">
                <label htmlFor="barcode">Barcode</label>
                <input
                  type="text"
                  className="form-control"
                  name="barcode"
                  placeholder="Enter barcode"
                  value={data.barcode}
                  required
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="discount">Discount (%)</label>
                <input
                  type="number"
                  className="form-control"
                  name="discount"
                  value={data.discount}
                  required
                  min="0"
                  max="100"
                  onChange={onChange}
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="discountExpiration">Discount Expiration</label>{" "}
                <DatePicker
                  name="discountExpiration"
                  value={displayDate}
                  placeholderText="Pick a date"
                  selected={startDate}
                  onChange={(date) => onDateChange(date)}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-lg btn-secondary btn-block"
            >
              Submit changes
            </button>
          </form>
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default ProductNew;
