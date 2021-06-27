import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { register, userRoles } from "../../components/HelperFunctions";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const UserNew = () => {
  let history = useHistory();

  // States for the two password fields to check
  // if the user enters the same password
  const [newPassword, setNewPassword] = useState({
    firstNewPassword: "",
    secondNewPassword: "",
  });

  const [profile, setProfile] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    role: "",
  });

  //
  // Change the correspond object field
  //
  const onChange = (e) => {
    let keyName = e.target.name;
    let value = e.target.value;
    setProfile((previous) => {
      return {
        ...previous,
        [keyName]: value,
      };
    });
  };

  //
  // Change the user role from dropdown
  //
  const onDropdownChange = (e) => {
    let value = e.value;
    setProfile((previous) => {
      return {
        ...previous,
        role: value,
      };
    });
  };

  //
  // Check the password fields
  //
  const onNewPasswordChange = (e) => {
    let keyName = e.target.name;
    let value = e.target.value;
    setNewPassword((previous) => {
      return {
        ...previous,
        [keyName]: value,
      };
    });
  };

  //
  // Submit the changes
  //
  const onSubmit = (e) => {
    e.preventDefault();

    // Boolean to check if the data are correct to submit
    let submitData = true;

    //Check if the user entered a new password
    if (newPassword.firstNewPassword) {
      // Check if both password fields match...
      if (newPassword.firstNewPassword === newPassword.secondNewPassword) {
        // ...if yes, set the new password to the password object field
        // and set the logout boolean to true.
        profile.password = newPassword.firstNewPassword;
      } else {
        // Else the submit fails
        alert("The password fields do not match");
        submitData = false;
      }
    }

    // If submit boolean is true, submit the data
    if (submitData) {
      register(profile).then((res) => {
        if (res) {
          history.push("/users");
        }
      });
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
              placeholder="Enter username"
              value={profile.username}
              required
              onChange={onChange}
              minLength="8"
              maxLength="16"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter email"
              value={profile.email}
              required
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="firstNewPassword">Password</label>
            <input
              type="password"
              className="form-control"
              name="firstNewPassword"
              placeholder="Enter New Password"
              required
              onChange={onNewPasswordChange}
              minLength="8"
              maxLength="16"
            />
            <small id="passwordHelpBlock" className="form-text text-muted">
              Your password must be 8-16 characters long.
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="secondNewPassword">Retype Password</label>
            <input
              type="password"
              className="form-control"
              name="secondNewPassword"
              placeholder="Retype New Password"
              required
              onChange={onNewPasswordChange}
              minLength="8"
              maxLength="16"
            />
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="firstname">Firstname</label>
              <input
                type="text"
                className="form-control"
                name="firstname"
                placeholder="Enter firstname"
                value={profile.firstname}
                required
                onChange={onChange}
                maxLength="30"
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="lastname">Lastname</label>
              <input
                type="text"
                className="form-control"
                name="lastname"
                placeholder="Enter lastname"
                value={profile.lastname}
                required
                onChange={onChange}
                maxLength="30"
              />
            </div>
          </div>
          <div className="form-group">
            <Dropdown
              options={userRoles}
              onChange={onDropdownChange}
              placeholder="Select a user role..."
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

export default UserNew;
