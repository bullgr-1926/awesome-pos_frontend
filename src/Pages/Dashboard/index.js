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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [profitableDays, setProfitableDays] = useState({
    mostProfitValue: 0,
    mostProfitDate: "",
    leastProfitValue: 0,
    leastProfitDate: "",
  });

  //
  // Fetch the data on the beginning and make the calculations
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

      // Also set the actual date and in local string
      // and set both in the usestate variables.
      const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
      };
      const weekAgoDateString = oneWeekAgo.toLocaleDateString("de", options);
      const actualDate = new Date();
      const actualDateString = actualDate.toLocaleDateString("de", options);
      setStartDate(weekAgoDateString);
      setEndDate(actualDateString);

      // Set the object for the most and least profitable day
      const profitableDays = {
        mostProfitValue: 0,
        mostProfitDate: "",
        leastProfitValue: 0,
        leastProfitDate: "",
      };

      // For each data entry if it's in the date range
      // we set the values we need for the calculations.
      data.forEach((element) => {
        // Convert first the element date to miliseconds
        const elementDate = new Date(element.createdAt);
        const finalElementDate = elementDate.getTime();

        if (finalElementDate >= finalDate) {
          setIncome((previous) => previous + element.grandtotal);
          setProductsSold((previous) => previous + element.products.length);

          // Check if the grandtotal is more from the actual value
          // in the profitable days object. If yes, set the grandtotal
          // date values to the object.
          if (element.grandtotal > profitableDays.mostProfitValue) {
            profitableDays.mostProfitValue = element.grandtotal;
            const newDate = new Date(element.createdAt);
            profitableDays.mostProfitDate = newDate.toLocaleDateString(
              "de",
              options
            );
          }

          // Check if the grandtotal is less from the actual value
          // in the profitable days object. If yes, set the grandtotal
          // and date values to the object.
          // Check if the profit value is not zero (first check condition).
          if (profitableDays.leastProfitValue !== 0) {
            if (element.grandtotal < profitableDays.leastProfitValue) {
              profitableDays.leastProfitValue = element.grandtotal;
              const newDate = new Date(element.createdAt);
              profitableDays.leastProfitDate = newDate.toLocaleDateString(
                "de",
                options
              );
            }
          } else {
            // Else it's the first check condition, so set directly
            // the element values in the object.
            profitableDays.leastProfitValue = element.grandtotal;
            const newDate = new Date(element.createdAt);
            profitableDays.leastProfitDate = newDate.toLocaleDateString(
              "de",
              options
            );
          }
        }
      });

      // Set the final profit object to usestate variable
      setProfitableDays(profitableDays);
    };

    // Fetch the data if not already
    if (data.length === 0) {
      fetchAllData();
    } else {
      // Else make the calculations
      sevenDaysCalculation();
    }
  }, [data]);

  //
  // Calculates and return the income average
  //
  const calculateAverageIncome = () => {
    const averageValue = income / 7;
    return averageValue.toFixed(2);
  };

  //
  // Calculates and return the products average
  //
  const calculateAverageProducts = () => {
    const averageValue = Math.round(productsSold / 7);
    return averageValue;
  };

  return (
    <div className="container fadeIn">
      <div className="row mt-5 mx-auto justify-content-center">
        <h2 className="text-center">
          Sale Statistics from {startDate} to {endDate}
        </h2>
      </div>
      <div className="row mt-5 mx-auto justify-content-between">
        <div className="col-md-4">
          <div className="card text-white bg-dark mb-3">
            <div className="card-header">Transactions</div>
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
            <div className="card-header">Income</div>
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
            <div className="card-header">Products Sold</div>
            <div className="card-body">
              <h2 className="text-center">
                <i className="bi bi-bag-check" style={{ fontSize: "40px" }}></i>{" "}
                {productsSold} Products
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-5 mx-auto justify-content-between">
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-header">Biggest Transaction</div>
            <div className="card-body">
              <h3 className="text-center">
                {profitableDays.mostProfitDate}
                <br />
                {storeData.currency}
                {profitableDays.mostProfitValue.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-danger mb-3">
            <div className="card-header">Lowest Transaction</div>
            <div className="card-body">
              <h3 className="text-center">
                {profitableDays.leastProfitDate}
                <br />
                {storeData.currency}
                {profitableDays.leastProfitValue.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-secondary mb-3">
            <div className="card-header">Average Income</div>
            <div className="card-body">
              <h3 className="text-center">
                7 Days Average
                <br />
                {storeData.currency}
                {calculateAverageIncome()}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-info mb-3">
            <div className="card-header">Average Products Sold</div>
            <div className="card-body">
              <h3 className="text-center">
                7 Days Average
                <br />
                {calculateAverageProducts()} items
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
