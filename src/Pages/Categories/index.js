import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { apiUrl } from "../../components/HelperFunctions";
import axios from "axios";
import "./index.css";

const Categories = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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
    // Get all categories
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${apiUrl}categories/`, {
          headers: {
            "auth-token": localStorage.usertoken,
          },
        });
        setData(response.data.allCategories);
        setIsLoading(false);
      } catch (error) {
        console.error(error.response.data);
        alert(error.response.data);
      }
    };

    // Get data by search title
    const fetchDataBySearch = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${apiUrl}categories/title/${search}`,
          {
            headers: {
              "auth-token": localStorage.usertoken,
            },
          }
        );
        setData(response.data.getCategories);
        setIsLoading(false);
      } catch (error) {
        console.error(error.response.data);
        alert(error.response.data);
      }
    };

    // Fetch all data if search field is empty
    if (!search) {
      fetchAllData();
    } else {
      // Fetch the data correspond the search field
      fetchDataBySearch();
    }
  }, [search]);

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
    if (pages > 1) {
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
  // Route to CategoryEdit with the correspond id
  //
  const handleEditClick = (e) => {
    const categoryToEdit = data[e.target.id];
    history.push("/category_edit", { params: categoryToEdit });
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
    let endIndex = startIndex + itemsPerPage - 1;

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
    let endIndex = startIndex + itemsPerPage - 1;

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
      <h1 className="text-center">Categories</h1>
      <br />
      <label>Search</label>{" "}
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <button
        className="btn btn-dark button-right"
        type="button"
        onClick={() => {
          history.push("/category_new");
        }}
      >
        New
      </button>
      <br />
      <br />
      {isLoading ? (
        <></>
      ) : (
        <>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Descr.</th>
                <th scope="col">Color</th>
                <th scope="col">Disc. (%)</th>
                <th scope="col">Disc. Exp.</th>
                <th scope="col">Edit</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((item, index) => (
                <tr key={index} className="fadeIn">
                  <th scope="col">{index + 1}</th>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>
                    <span style={{ color: item.color }}>
                      <i className="bi bi-circle-fill"></i>
                    </span>
                  </td>
                  <td>{item.discount}</td>
                  <td>{item.discountExpiration}</td>
                  <td>
                    <button className="btn" type="button">
                      <i
                        className="bi bi-pencil"
                        onClick={handleEditClick}
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

export default Categories;
