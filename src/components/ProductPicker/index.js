import { useState, useEffect } from "react";
import { apiUrl, productsByCategory } from "../../components/HelperFunctions";
import axios from "axios";
import "./index.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const ProductPicker = (props) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryColors, setCategoryColors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // States for pagination
  const [pages, setPages] = useState(0);
  const [actualPage, setActualPage] = useState(0);
  const [prevDisable, setPrevDisable] = useState(true);
  const [nextDisable, setNextDisable] = useState(true);
  const [pageData, setPageData] = useState([]);
  const itemsPerPage = 12;

  /* console.log(pageData); */

  //
  // Fetch the data on the beginning and on every search
  //
  useEffect(() => {
    // Get all products
    const fetchAllProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${apiUrl}products/`, {
          headers: {
            "auth-token": localStorage.usertoken,
          },
        });
        setData(response.data.allProducts);
        setIsLoading(false);
      } catch (error) {
        console.error(error.response.data);
        alert(error.response.data);
      }
    };

    // Get data by search title
    const fetchProductsBySearch = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${apiUrl}products/title/${search}`, {
          headers: {
            "auth-token": localStorage.usertoken,
          },
        });
        setData(response.data.getProducts);
        setIsLoading(false);
      } catch (error) {
        console.error(error.response.data);
        alert(error.response.data);
      }
    };

    // Fetch all data if search field is empty
    if (!search) {
      fetchAllProducts();
    } else {
      // Fetch the data correspond the search field
      fetchProductsBySearch();
    }
  }, [search]);

  //
  // Fetch all categories and get the titles
  // to use in dropdown filtering the products.
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
        // Set only the titles of the categories to the array
        // and the category colors to the object array
        response.data.allCategories.forEach((element) => {
          setCategories((previous) => [...previous, element["title"]]);
          setCategoryColors((previous) => {
            return {
              ...previous,
              [element.title]: element.color,
            };
          });
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
  // Send the correspond id data back to container.
  // Before we must calculate the actual page with
  // items per page and the picked id.
  //
  const handleProductClick = (e) => {
    const productId = e.target.id;
    const pickedProduct = pageData[productId];
    props.handlePickProduct(pickedProduct);
  };

  //
  // Change the category from dropdown
  //
  const onDropdownChange = (e) => {
    let categoryToSearch = {
      category: e.value,
    };
    productsByCategory(categoryToSearch).then((res) => {
      if (res) {
        setData(res);
      }
    });
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
      <label>Search</label>{" "}
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <br />
      <br />
      <Dropdown
        options={categories}
        onChange={onDropdownChange}
        placeholder="Select a category to filter the products..."
      />
      <br />
      {isLoading ? (
        <></>
      ) : (
        <>
          <div className="flex-container fadeIn">
            {pageData.map((item, index) => (
              <div
                className="product-card"
                key={index}
                id={index}
                onClick={handleProductClick}
                style={{ backgroundColor: categoryColors[item.category] }}
              >
                {item.title}
              </div>
            ))}
          </div>
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

export default ProductPicker;
