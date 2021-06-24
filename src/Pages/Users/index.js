import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { apiUrl, userRoles } from "../../components/HelperFunctions";
import axios from "axios";
import "./index.css";

const Users = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //
  // Fetch the data on the beginning
  //
  useEffect(() => {
    // Get all users
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${apiUrl}profiles/`, {
          headers: {
            "auth-token": localStorage.usertoken,
          },
        });
        setData(response.data.allProfiles);
        setIsLoading(false);
      } catch (error) {
        console.error(error.response.data);
        alert(error.response.data);
      }
    };

    fetchAllData();
  }, []);

  //
  // Route to UsersEdit with the correspond id
  //
  const handleEditClick = (e) => {
    const userToEdit = data[e.target.id];
    history.push("/user_edit", { params: userToEdit });
  };

  return (
    <div className="container fadeIn">
      <br />
      <h1 className="text-center">Users</h1>
      <br />
      <button
        className="btn btn-dark button-right"
        type="button"
        onClick={() => {
          history.push("/user_new");
        }}
      >
        <i className="bi bi-person-plus-fill"></i> New
      </button>
      <br />
      <br />
      {isLoading ? (
        <>Loading...</>
      ) : (
        <>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Firstname</th>
                <th scope="col">Lastname</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <th scope="col">{index + 1}</th>
                  <td>{item.firstname}</td>
                  <td>{item.lastname}</td>
                  <td>{item.username}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td>
                    {item.role === userRoles[1] && (
                      <button className="btn" type="button">
                        <i
                          className="bi bi-trash"
                          onClick={handleEditClick}
                          id={index}
                        ></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <br />
        </>
      )}
    </div>
  );
};

export default Users;
