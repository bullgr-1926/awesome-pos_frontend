import axios from "axios";
import jwt_decode from "jwt-decode";

// Register a user
export const register = async (newUser) => {
  try {
    const response = await axios.post(
      "http://localhost:3002/user/register",
      newUser
    );
    if (response) {
      console.log("Registered");
    }
  } catch (error) {
    console.error(error.response.data);
    alert(error.response.data);
  }
};

// Login a user
export const login = async (user) => {
  try {
    const response = await axios.post("http://localhost:3002/user/login", user);
    // Save the token to localStorage
    localStorage.setItem("usertoken", response.data);
    // Save the user role to localStorage
    setUserRole();
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    alert(error.response.data);
  }
};

// Return the decoded token (if any)
export const getToken = () => {
  const token = localStorage.usertoken;
  const decoded = jwt_decode(token);
  return decoded;
};

// Return the decoded token (if any)
export const setUserRole = () => {
  const userRole = getToken();
  localStorage.setItem("userrole", userRole.user.role);
};

// User roles in database
export const userRoles = ["Admin", "Cashier"];
