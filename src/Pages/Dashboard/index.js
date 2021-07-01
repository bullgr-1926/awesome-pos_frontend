import { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./index.css";
import { apiUrl } from "../../components/HelperFunctions";
import { StoreContext } from "../../context/StoreContext";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [storeData] = useContext(StoreContext);
  const [income, setIncome] = useState(0);
  const [productsSold, setProductsSold] = useState(0);

  //
  // Fetch the data on the beginning
  //
  useEffect(() => {
    // Get all products
    const fetchAllData = async () => {
      try {
        const response = await axios.get(`${apiUrl}receipts/all`, {
          headers: {
            "auth-token": localStorage.usertoken,
          },
        });
        setData(response.data.allReceipts);
      } catch (error) {
        console.error(error.response.data);
        alert(error.response.data);
      }
    };

    // Calculate after the data is set
    const sevenDaysCalculation = () => {
      // Set the data range for the last 7 days
      let oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const finalDate = oneWeekAgo.getTime();

      // For each data entry if it's in the date range
      // we set the values we need for the calculations.
      data.forEach((element) => {
        // Convert first the element date to miliseconds
        const elementDate = new Date(element.createdAt);
        const finalElementDate = elementDate.getTime();

        if (finalElementDate >= finalDate) {
          setIncome((previous) => previous + element.grandtotal);
          setProductsSold((previous) => previous + element.products.length);
        }
      });
    };

    // Fetch the data if not already
    if (data.length === 0) {
      fetchAllData();
    } else {
      // Else make the calculations
      sevenDaysCalculation();
    }
  }, [data]);

  return (
    <div className="container fadeIn">
      <div className="row mt-5 mx-auto justify-content-between">
        <div className="col-md-4">
          <div className="card text-white bg-dark mb-3">
            <div className="card-header">Transactions Last 7 Days</div>
            <div className="card-body">
              <h2 className="text-center">
                <i
                  className="bi bi-cart-check"
                  style={{ fontSize: "40px" }}
                ></i>{" "}
                {data.length} Transactions
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-info mb-3">
            <div className="card-header">Income Last 7 Days</div>
            <div className="card-body">
              <h2 className="text-center">
                <i className="bi bi-cash-coin" style={{ fontSize: "40px" }}></i>{" "}
                {storeData.currency}
                {income.toFixed(2)} Income
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-secondary mb-3">
            <div className="card-header">Products Sold Last 7 Days</div>
            <div className="card-body">
              <h2 className="text-center">
                <i className="bi bi-bag-check" style={{ fontSize: "40px" }}></i>{" "}
                {productsSold} Products
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3 mx-auto">
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-6">
              <div className="card text-white bg-secondary mb-3">
                <div className="card-header">Products Sold Last 7 Days</div>
                <div className="card-body">
                  <h2 className="text-center">
                    <i
                      className="bi bi-bag-check"
                      style={{ fontSize: "40px" }}
                    ></i>{" "}
                    {productsSold} Products
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card text-white bg-info mb-3">
                <div className="card-header">Products Sold Last 7 Days</div>
                <div className="card-body">
                  <h2 className="text-center">
                    <i
                      className="bi bi-bag-check"
                      style={{ fontSize: "40px" }}
                    ></i>{" "}
                    {productsSold} Products
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="card text-white bg-dark mb-3">
                <div className="card-header">Products Sold Last 7 Days</div>
                <div className="card-body">
                  <h2 className="text-center">
                    <i
                      className="bi bi-bag-check"
                      style={{ fontSize: "40px" }}
                    ></i>{" "}
                    {productsSold} Products
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card text-white bg-secondary mb-3">
                <div className="card-header">Products Sold Last 7 Days</div>
                <div className="card-body">
                  <h2 className="text-center">
                    <i
                      className="bi bi-bag-check"
                      style={{ fontSize: "40px" }}
                    ></i>{" "}
                    {productsSold} Products
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6"></div>
      </div>
    </div>
  );
};

export default Dashboard;
