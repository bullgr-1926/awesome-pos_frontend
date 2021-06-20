import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getToken, profileUpdate } from "../../components/HelperFunctions";
import queryString from "query-string";

const ProfileEdit = () => {
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  const [newPassword, setNewPassword] = useState({
    firstNewPassword: "",
    secondNewPassword: "",
  });

  // Keep the actual profile to check if
  // we need to submit.
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    role: "",
  });

  const [newProfile, setNewProfile] = useState({
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
      username: decoded.user.username,
      email: decoded.user.email,
      firstname: decoded.user.firstname,
      lastname: decoded.user.lastname,
      role: decoded.user.role,
    });

    setNewProfile({
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
    setNewProfile((previous) => {
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
  // Submit the changes
  //
  const onSubmit = (e) => {
    e.preventDefault();

    // Boolean to check if the user should logout
    // (only if something changes) and login
    // to refresh the token.
    let userLogout = false;

    // Boolean to check if the data are correct to submit
    let submitData = true;

    //Check if the user entered a new password
    if (newPassword.firstNewPassword) {
      // Check if both password fields match...
      if (newPassword.firstNewPassword === newPassword.secondNewPassword) {
        // ...if yes, set the new password to the password object field
        // and set the logout boolean to true.
        newProfile.password = newPassword.firstNewPassword;
        userLogout = true;
      } else {
        // Else the submit fails
        alert("The password fields do not match");
        submitData = false;
      }
    }

    // Check if the user changes any field to set the boolean logout to true
    if (newProfile.username !== profile.username) {
      userLogout = true;
    }
    if (newProfile.email !== profile.email) {
      userLogout = true;
    }
    if (newProfile.firstname !== profile.firstname) {
      userLogout = true;
    }
    if (newProfile.lastname !== profile.lastname) {
      userLogout = true;
    }

    // If submit boolean is true, submit the data
    if (submitData) {
      profileUpdate(newProfile.id, queryString.stringify(newProfile)).then(
        (res) => {
          if (res) {
            // Check if the user must logout
            if (userLogout) {
              alert("User profile updated successfully. You must login again.");
              logOut();
            } else {
              // Else redirect to user profile
              history.push("/profile");
            }
          }
        }
      );
    }
  };

  //
  // Delete the token and role variables
  // from local storage and logout.
  //
  const logOut = () => {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("userrole");
    history.push(`/`);
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
                  value={newProfile.username}
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
                  value={newProfile.email}
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
                    value={newProfile.firstname}
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
                    value={newProfile.lastname}
                    required
                    onChange={onChange}
                    maxLength="30"
                  />
                </div>
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
