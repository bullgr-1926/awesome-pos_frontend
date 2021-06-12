import axios from "axios";

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
    console.error(error);
  }
};

export const login = async (user) => {
  try {
    const response = await axios.post("http://localhost:3002/user/login", user);
    localStorage.setItem("usertoken", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
