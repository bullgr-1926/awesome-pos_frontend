import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { apiUrl } from "../../components/HelperFunctions";
import CategoryEdit from "../../components/CategoryEdit";
import axios from "axios";
import "./index.css";

const Categories = () => {
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
    console.log(e);
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
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <th scope="col">{index + 1}</th>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{item.color}</td>
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
