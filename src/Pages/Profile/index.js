import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getToken } from "../../components/HelperFunctions";

const Profile = () => {
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    role: "",
    lastActive: "",
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
      lastActive: decoded.user.lastActive,
    });

    setIsLoading(false);
  }, []);

  //
  // Handle click for the edit profile button
  //
  const handleClick = (e) => {
    history.push("/profile_edit");
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
            <form>
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
            </form>
            <br />
            <button
              className="btn btn-dark"
              type="button"
              onClick={handleClick}
            >
              <i className="bi bi-pencil"></i> Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
