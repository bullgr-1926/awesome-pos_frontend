import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { apiUrl } from "../../components/HelperFunctions";
import axios from "axios";
import "./index.css";

const Categories = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Get all categories
    const fetchAllData = async () => {
      try {
        const response = await axios.get(`${apiUrl}categories/`, {
          headers: {
            "auth-token": localStorage.usertoken,
          },
        });
        setData(response.data.allCategories);
      } catch (error) {
        console.error(error.response.data);
        alert(error.response.data);
      }
    };

    // Get data by search title
    const fetchDataBySearch = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}categories/title/${search}`,
          {
            headers: {
              "auth-token": localStorage.usertoken,
            },
          }
        );
        setData(response.data.getCategories);
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

  // Route to CategoryEdit with the correspond id
  const handleEditClick = (e) => {
    const categoryToEdit = data[e.target.id];
    history.push("/category_edit", { params: categoryToEdit });
  };

  return (
    <div className="container">
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
      <button className="btn btn-dark button-right" type="button">
        New
      </button>
      <br />
      <br />
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th scope="col">Color</th>
            <th scope="col">Discount (%)</th>
            <th scope="col">Discount Exp.</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
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
    </div>
  );
};

export default Categories;
