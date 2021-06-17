import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { apiUrl } from "../../components/HelperFunctions";
import axios from "axios";
import "./index.css";

const Products = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Get all products
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}products/`, {
          headers: {
            "auth-token": localStorage.usertoken,
          },
        });
        setData(response.data.allProducts);
      } catch (error) {
        console.error(error.response.data);
        alert(error.response.data);
      }
    };

    // Get data by search title
    const fetchProductsBySearch = async () => {
      try {
        const response = await axios.get(`${apiUrl}products/title/${search}`, {
          headers: {
            "auth-token": localStorage.usertoken,
          },
        });
        setData(response.data.getProducts);
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

  // Route to CategoryEdit with the correspond id
  const handleEditClick = (e) => {
    const productToEdit = data[e.target.id];
    history.push("/product_edit", { params: productToEdit });
  };

  return (
    <div className="container">
      <br />
      <h1 className="text-center">Products</h1>
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
          history.push("/product_new");
        }}
      >
        New
      </button>
      <br />
      <br />
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Descr.</th>
            <th scope="col">Categ.</th>
            <th scope="col">Price</th>
            <th scope="col">Barcode</th>
            <th scope="col">Disc. (%)</th>
            <th scope="col">Disc. Exp.</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <th scope="col">{index + 1}</th>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{item.category}</td>
              <td>{item.price}</td>
              <td>{item.barcode}</td>
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
    </div>
  );
};

export default Products;
