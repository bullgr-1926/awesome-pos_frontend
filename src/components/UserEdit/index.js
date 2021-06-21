import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { userDelete } from "../../components/HelperFunctions";

const UserEdit = () => {
  let history = useHistory();

  // Get the params and set them to data object
  const location = useLocation();
  const profileToEdit = location.state.params;
  const [deleteProfile, setDeleteProfile] = useState("");
  const profile = {
    username: profileToEdit.username,
    email: profileToEdit.email,
    firstname: profileToEdit.firstname,
    lastname: profileToEdit.lastname,
    role: profileToEdit.role,
    lastActive: profileToEdit.lastActive,
  };

  //
  // Change the delete field
  //
  const onChangeDelete = (e) => {
    let value = e.target.value;
    setDeleteProfile(value);
  };

  //
  // Submit the changes
  //
  const onSubmit = (e) => {
    e.preventDefault();

    // Check if user choose to delete
    if (deleteProfile === "DELETE") {
      userDelete(profileToEdit._id).then((res) => {
        if (res) {
          history.push("/users");
        }
      });
    } else {
      history.push("/users");
    }
  };

  return (
    <div className="container fadeIn">
      <div className="col-md-6 mt-5 mx-auto">
        <h1 className="text-center">User Profile</h1>
        <br />

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={profile.username}
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className="form-control"
              name="email"
              value={profile.email}
              readOnly
            />
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="firstname">Firstname</label>
              <input
                type="text"
                className="form-control"
                name="firstname"
                value={profile.firstname}
                readOnly
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="lastname">Lastname</label>
              <input
                type="text"
                className="form-control"
                name="lastname"
                value={profile.lastname}
                readOnly
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="role">User Role</label>
              <input
                type="text"
                className="form-control"
                name="role"
                value={profile.role}
                readOnly
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="lastActive">Last Active</label>
              <input
                type="text"
                className="form-control"
                name="lastActive"
                value={profile.lastActive}
                readOnly
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="delete" style={{ color: "red" }}>
              Delete
            </label>
            <input
              type="text"
              className="form-control"
              name="delete"
              placeholder="Enter DELETE to delete the user profile"
              value={deleteProfile}
              onChange={onChangeDelete}
            />
          </div>
          <button type="submit" className="btn btn-lg btn-secondary btn-block">
            Submit changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserEdit;
