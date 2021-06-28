import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { apiUrl } from "../../components/HelperFunctions";
import { StoreContext } from "../../context/StoreContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "./index.css";

const Report = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [storeData] = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [searchDate, setSearchDate] = useState("");
  // States for pagination
  const [pages, setPages] = useState(0);
  const [actualPage, setActualPage] = useState(0);
  const [prevDisable, setPrevDisable] = useState(true);
  const [nextDisable, setNextDisable] = useState(true);
  const [pageData, setPageData] = useState([]);
  const itemsPerPage = 10;

  //
  // Fetch the data on the beginning and on every search
  //
  useEffect(() => {
    // Get all products
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${apiUrl}receipts/`, {
          headers: {
            "auth-token": localStorage.usertoken,
          },
        });
        setData(response.data.allReceipts);
        setIsLoading(false);
      } catch (error) {
        console.error(error.response.data);
        alert(error.response.data);
      }
    };

    // Get data by search date
    const fetchDataBySearch = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${apiUrl}receipts/${searchDate}`, {
          headers: {
            "auth-token": localStorage.usertoken,
          },
        });
        setData(response.data.getReceipts);
        setIsLoading(false);
      } catch (error) {
        console.error(error.response.data);
        alert(error.response.data);
      }
    };

    // Fetch all data if search field is empty
    if (!searchDate) {
      fetchAllData();
    } else {
      // Fetch the data correspond the search field
      fetchDataBySearch();
    }
  }, [searchDate]);

  //
  // Setup pagination everytime the data changes
  //
  useEffect(() => {
    setIsLoading(true);
    // Reset the nedded states
    let rows = [];
    setActualPage(0);
    setPrevDisable(true);
    setNextDisable(true);

    // Calculate how many pages we have correspond the data
    let pages = Math.round(data.length / itemsPerPage + 0.4 - 1);
    setPages(pages);

    // If we have more than one page, enable the next button
    if (pages > 0) {
      setNextDisable(false);
    }

    // Check if the data lenght is less than items per page value.
    // If yes, we set the data lenght to the for loop to avoid
    // adding undefined values on the array.
    let maxItems = itemsPerPage;
    if (data.length < itemsPerPage) {
      maxItems = data.length;
    }

    // Set the page data
    for (let i = 0; i < maxItems; i++) {
      rows.push(data[i]);
    }

    setPageData([...rows]);
    setIsLoading(false);
  }, [data]);

  //
  // Route to ReceiptView with the correspond id
  //
  const handleViewClick = (e) => {
    const receiptToView = data[e.target.id];
    history.push("/receipt_view", { params: receiptToView });
  };

  //
  // Delete the search by date value
  //
  const handleDeleteDateClick = () => {
    setSearchDate("");
  };

  //
  // Set the changes from date picker
  //
  const onDateChange = (newDate) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const finalDate = newDate.toLocaleString("de", options);
    setStartDate(newDate);
    setSearchDate(finalDate);
  };

  //
  // Handle when previous button is clicked
  //
  const handlePrevClick = (e) => {
    // Get and update the new page state
    const prevPage = actualPage - 1;
    setActualPage(prevPage);

    // Define the new indexes to get the page data
    let startIndex = prevPage * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;

    // Disable the prev button if we are
    // on the first page
    if (prevPage === 0) {
      setPrevDisable(true);
    }
    // Also enable the next button if not already
    if (nextDisable) {
      setNextDisable(false);
    }

    // Setup the new page data
    let rows = [];
    for (let i = startIndex; i < endIndex; i++) {
      rows.push(data[i]);
    }
    setPageData([...rows]);
  };

  //
  // Handle when next button is clicked
  //
  const handleNextClick = (e) => {
    // Get and update the new page state
    const nextPage = actualPage + 1;
    setActualPage(nextPage);

    // Define the new indexes to get the page data
    let startIndex = nextPage * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;

    // If we are on the last page, check if the
    // data are less than the end index.
    if (endIndex > data.length) {
      endIndex = data.length;
    }

    // Disable the next button if we are
    // on the last page
    if (nextPage === pages) {
      setNextDisable(true);
    }
    // Also enable the previous button if not already
    if (prevDisable) {
      setPrevDisable(false);
    }

    // Setup the new page data
    let rows = [];
    for (let i = startIndex; i < endIndex; i++) {
      rows.push(data[i]);
    }
    setPageData([...rows]);
  };

  return (
    <div className="container fadeIn">
      <br />
      <h2 className="text-center">Report</h2>
      <br />
      <div className="row justify-content-start">
        <label>Search By Date </label>{" "}
        <DatePicker
          value={searchDate}
          selected={startDate}
          onChange={(date) => onDateChange(date)}
        />
        <button className="btn" type="button">
          <i
            className="bi bi-x-circle-fill"
            onClick={handleDeleteDateClick}
          ></i>
        </button>
      </div>
      <br />
      {isLoading ? (
        <></>
      ) : (
        <>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">User ID</th>
                <th scope="col">Qty</th>
                <th scope="col">Grandtotal</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((item, index) => (
                <tr key={index} className="fadeIn">
                  <td>{item.createdAt}</td>
                  <td>{item.userId}</td>
                  <td>{item.products.length}</td>
                  <td>
                    {storeData.currency}
                    {item.grandtotal.toFixed(2)}
                  </td>
                  <td>
                    <button className="btn" type="button">
                      <i
                        className="bi bi-eye"
                        onClick={handleViewClick}
                        id={index}
                      ></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <button
            className="btn btn-dark pagination-button"
            type="button"
            onClick={handlePrevClick}
            disabled={prevDisable}
          >
            <i className="bi bi-arrow-left-square-fill"></i> Prev
          </button>
          {"  "}
          <button
            className="btn btn-dark pagination-button"
            type="button"
            onClick={handleNextClick}
            disabled={nextDisable}
          >
            Next <i className="bi bi-arrow-right-square-fill"></i>
          </button>
          <br />
          <br />
        </>
      )}
    </div>
  );
};

export default Report;
