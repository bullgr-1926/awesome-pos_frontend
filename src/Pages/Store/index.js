import { useState, useEffect } from "react";
import { apiUrl } from "../../components/HelperFunctions";
import axios from "axios";
import "./index.css";

const Store = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //
  // Fetch the data on the beginning
  //
  useEffect(() => {
    // Get all store data
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${apiUrl}store/`, {
          headers: {
            "auth-token": localStorage.usertoken,
          },
        });
        // Set only the first array entry
        setData(response.data.store[0]);
        setIsLoading(false);
      } catch (error) {
        console.error(error.response.data);
        alert(error.response.data);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="container fadeIn">
      <div className="col-md-6 mt-5 mx-auto">
        <h1 className="text-center">Store Info</h1>
        <br />
        {isLoading ? (
          <>Loading...</>
        ) : (
          <>
            <form>
              <div className="form-group">
                <label htmlFor="store">Store</label>
                <input
                  type="text"
                  className="form-control"
                  name="store"
                  value={data.title}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={data.street}
                  readOnly
                />
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={data.city}
                    readOnly
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="region">Region</label>
                  <input
                    type="text"
                    className="form-control"
                    name="region"
                    value={data.region}
                    readOnly
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-2">
                  <label htmlFor="zip">Zip</label>
                  <input
                    type="text"
                    className="form-control"
                    name="zip"
                    value={data.postcode}
                    readOnly
                  />
                </div>
                <div className="form-group col-md-5">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={data.phone}
                    readOnly
                  />
                </div>
                <div className="form-group col-md-5">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    name="country"
                    value={data.country}
                    readOnly
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-2">
                  <label htmlFor="tax">Tax (%)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tax"
                    value={data.tax}
                    readOnly
                  />
                </div>
                <div className="form-group col-md-2">
                  <label htmlFor="currency">Currency</label>
                  <input
                    type="text"
                    className="form-control"
                    name="currency"
                    value={data.currency}
                    readOnly
                  />
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Store;
