import { useState, useEffect } from "react";
import Chart from "bk-react-charts";
import "bk-react-charts/dist/index.css";
import axios from "axios";
import "./index.css";
import { apiUrl } from "../../components/HelperFunctions";

const Dashboard = () => {
  let chartData = [
    { day: "Mon", sales: 35 },
    { day: "Tue", sales: 37 },
    { day: "We", sales: 39 },
    { day: "Thu", sales: 38 },
    { day: "Fr", sales: 37 },
    { day: "Sa", sales: 41 },
    { day: "Sun", sales: 40 },
  ];

  const [data, setData] = useState([]);

  let oneWeekAgo = new Date();
  console.log(oneWeekAgo);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  console.log(oneWeekAgo);

  console.log(data);

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

    fetchAllData();
  }, []);

  return (
    <div className="container fadeIn">
      <div className="row mt-5 mx-auto justify-content-between">
        <div className="col-md-4">
          <div className="card text-white bg-dark mb-3">
            <div className="card-header">Weekly Transactions</div>
            <div className="card-body">
              <h2 className="text-center">
                <i
                  className="bi bi-cart-check"
                  style={{ fontSize: "40px" }}
                ></i>{" "}
                30 Transactions
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-info mb-3">
            <div className="card-header">Weekly Income</div>
            <div className="card-body">
              <h2 className="text-center">
                <i className="bi bi-cash-coin" style={{ fontSize: "40px" }}></i>{" "}
                €300 Income
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
                100 Products
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4 mx-auto">
        <div className="col-md-6">
          <Chart
            height="400px"
            width="500px"
            dataSource={[
              {
                data: chartData,
              },
            ]}
            xName="day"
            yName="sales"
          />
        </div>
        <div className="col-md-6"></div>
      </div>
    </div>
  );
};

export default Dashboard;
