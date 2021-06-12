import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const Profile = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    role: "",
    lastActive: "",
  });

  useEffect(() => {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);

    setProfile({
      username: decoded.user.username,
      email: decoded.user.email,
      firstname: decoded.user.firstname,
      lastname: decoded.user.lastname,
      role: decoded.user.role,
      lastActive: decoded.user.lastActive,
    });
  }, []);

  return (
    <div className="container">
      <div className="col-md-6 mt-5 mx-auto">
        <h1 className="text-center">PROFILE</h1>
      </div>
      <table className="table col-md-6 mx-auto">
        <tbody>
          <tr>
            <td>Username</td>
            <td>{profile.username}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{profile.email}</td>
          </tr>
          <tr>
            <td>First Name</td>
            <td>{profile.firstname}</td>
          </tr>
          <tr>
            <td>Last Name</td>
            <td>{profile.lastname}</td>
          </tr>
          <tr>
            <td>Role</td>
            <td>{profile.role}</td>
          </tr>
          <tr>
            <td>Last Active</td>
            <td>{profile.lastActive}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
