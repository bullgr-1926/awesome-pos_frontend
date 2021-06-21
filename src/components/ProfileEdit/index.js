import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  getToken,
  profileUpdate,
  profileDelete,
} from "../../components/HelperFunctions";
import queryString from "query-string";

const ProfileEdit = () => {
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [deleteProfile, setDeleteProfile] = useState("");

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
  // Decode the token and set the info
  // for the logged in user
  //
  useEffect(() => {
    setIsLoading(true);
    const decoded = getToken();

    setProfile({
      id: decoded.user._id,
      username: decoded.user.username,
      email: decoded.user.email,
      firstname: decoded.user.firstname,
      lastname: decoded.user.lastname,
      role: decoded.user.role,
    });

    setIsLoading(false);
  }, []);

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
  // Change the delete field
  //
  const onChangeDelete = (e) => {
    let value = e.target.value;
    setDeleteProfile(value);
  };

  //
  // Remove token and user role in local storage
  // and redirect to home (logout).
  const logOut = () => {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("userrole");
    history.push(`/`);
  };

  //
  // Submit the changes
  //
  const onSubmit = (e) => {
    e.preventDefault();

    // Boolean to check if the data are correct to submit
    let submitData = true;

    // Check if user choose to delete
    if (deleteProfile === "DELETE") {
      profileDelete(profile.id).then((res) => {
        if (res) {
          logOut();
        }
      });
    } else {
      // Else continue with the submit process.
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
        profileUpdate(profile.id, queryString.stringify(profile)).then(
          (res) => {
            if (res) {
              history.push("/profile");
            }
          }
        );
      }
    }
  };

  return (
    <div className="container fadeIn">
      <div className="col-md-6 mt-5 mx-auto">
        <h1 className="text-center">User Profile</h1>
        <br />
        {isLoading ? (
          <>Loading...</>
        ) : (
          <>
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
                <label htmlFor="firstNewPassword">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="firstNewPassword"
                  placeholder="Enter New Password"
                  onChange={onNewPasswordChange}
                  minLength="8"
                  maxLength="16"
                />
                <small id="passwordHelpBlock" className="form-text text-muted">
                  Your password must be 8-16 characters long.
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="secondNewPassword">Retype New Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="secondNewPassword"
                  placeholder="Retype New Password"
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
              <button
                type="submit"
                className="btn btn-lg btn-secondary btn-block"
              >
                Submit changes
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileEdit;
