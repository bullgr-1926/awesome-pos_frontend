import axios from 'axios';
import jwt_decode from 'jwt-decode';

// Api url preset
export const apiUrl = `https://evening-lowlands-40863.herokuapp.com/`;
/* export const apiUrl = `http://localhost:3002/`; */

//
// Register a user
//
export const register = async (newUser) => {
  try {
    const response = await axios.post(`${apiUrl}user/register`, newUser, {
      headers: {
        'auth-token': localStorage.usertoken,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    alert(error.response.data);
  }
};

//
// Login a user
//
export const login = async (user) => {
  try {
    const response = await axios.post(`${apiUrl}user/login`, user);
    // Set the token in localStorage
    setOrRefreshToken(response.data);
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    alert(error.response.data);
  }
};

//
// Create a new category item
//
export const categoryCreate = async (categoryToCreate) => {
  try {
    const response = await axios.post(
      `${apiUrl}categories/add_category`,
      categoryToCreate,
      {
        headers: {
          'auth-token': localStorage.usertoken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    alert(error.response.data);
  }
};

//
// Update the given category item
//
export const categoryUpdate = async (id, categoryToEdit) => {
  try {
    const response = await axios.put(
      `${apiUrl}categories/${id}`,
      categoryToEdit,
      {
        headers: {
          'auth-token': localStorage.usertoken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    alert(error.response.data);
  }
};

//
// Delete the given category item
//
export const categoryDelete = async (id) => {
  try {
    const response = await axios.delete(`${apiUrl}categories/${id}`, {
      headers: {
        'auth-token': localStorage.usertoken,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    alert(error.response.data);
  }
};

//
// Get the products by category
//
export const productsByCategory = async (categoryToSearch) => {
  try {
    const response = await axios.post(
      `${apiUrl}products/category`,
      categoryToSearch,
      {
        headers: {
          'auth-token': localStorage.usertoken,
        },
      }
    );
    return response.data.getProducts;
  } catch (error) {
    console.error(error.response.data);
    alert(error.response.data);
  }
};

//
// Get the product by barcode
//
export const productByBarcode = async (barcodeToSearch) => {
  try {
    const response = await axios.get(
      `${apiUrl}products/barcode/${barcodeToSearch}`,
      {
        headers: {
          'auth-token': localStorage.usertoken,
        },
      }
    );
    return response.data.getProduct;
  } catch (error) {
    console.error(error.response.data);
    alert(error.response.data);
  }
};

//
// Create a new product item
//
export const productCreate = async (productToCreate) => {
  try {
    const response = await axios.post(
      `${apiUrl}products/add_product`,
      productToCreate,
      {
        headers: {
          'auth-token': localStorage.usertoken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    alert(error.response.data);
  }
};

//
// Update the given category item
//
export const productUpdate = async (id, productToEdit) => {
  try {
    const response = await axios.put(`${apiUrl}products/${id}`, productToEdit, {
      headers: {
        'auth-token': localStorage.usertoken,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    alert(error.response.data);
  }
};

//
// Delete the given category item
//
export const productDelete = async (id) => {
  try {
    const response = await axios.delete(`${apiUrl}products/${id}`, {
      headers: {
        'auth-token': localStorage.usertoken,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    alert(error.response.data);
  }
};

//
// Update the user profile
//
export const profileUpdate = async (id, profileToEdit) => {
  try {
    const response = await axios.put(
      `${apiUrl}user/update/${id}`,
      profileToEdit,
      {
        headers: {
          'auth-token': localStorage.usertoken,
        },
      }
    );
    // Refresh the token in localStorage
    setOrRefreshToken(response.data);
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    alert(error.response.data);
  }
};

//
// Delete the user profile
//
export const profileDelete = async (id) => {
  try {
    const response = await axios.delete(`${apiUrl}user/delete_profile/${id}`, {
      headers: {
        'auth-token': localStorage.usertoken,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    alert(error.response.data);
  }
};

//
// Delete a user profile
//
export const userDelete = async (id) => {
  try {
    const response = await axios.delete(`${apiUrl}user/delete_user/${id}`, {
      headers: {
        'auth-token': localStorage.usertoken,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    alert(error.response.data);
  }
};

//
// Create a new receipt
//
export const receiptCreate = async (receiptToCreate) => {
  try {
    const response = await axios.post(
      `${apiUrl}receipts/add_receipt`,
      receiptToCreate,
      {
        headers: {
          'auth-token': localStorage.usertoken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    alert(error.response.data);
  }
};

//
// Return the decoded token (if any)
//
export const getToken = () => {
  const token = localStorage.usertoken;
  const decoded = jwt_decode(token);
  return decoded;
};

//
// Save the user role to localStorage
//
export const setUserRole = () => {
  const userRole = getToken();
  localStorage.setItem('userrole', userRole.user.role);
};

//
// Set or Refresh the token and user role into localStorage
//
export const setOrRefreshToken = (token) => {
  // Remove token and user role if any
  if (localStorage.usertoken) {
    localStorage.removeItem('usertoken');
    localStorage.removeItem('userrole');
  }

  // Save the token to localStorage
  localStorage.setItem('usertoken', token);
  // Save the user role to localStorage
  setUserRole();
};

// User roles in database
export const userRoles = ['Admin', 'Cashier'];
