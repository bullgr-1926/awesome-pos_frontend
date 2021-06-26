import { useState, useEffect, createContext } from "react";
import { apiUrl } from "../components/HelperFunctions";
import axios from "axios";

export const StoreContext = createContext();

export const StoreController = (props) => {
  const [storeData, setStoreData] = useState([]);

  //
  // Fetch the store data
  //
  useEffect(() => {
    // Get all store data
    const fetchStoreData = async () => {
      try {
        const response = await axios.get(`${apiUrl}store/`, {
          headers: {
            "auth-token": localStorage.usertoken,
          },
        });
        // Set only the first array entry
        setStoreData(response.data.store[0]);
      } catch (error) {
        console.error(error.response.data);
        alert(error.response.data);
      }
    };

    // Fetch all store data if not already fetched
    if (storeData.length === 0) {
      fetchStoreData();
    }
  }, [storeData]);

  return (
    <StoreContext.Provider value={[storeData, setStoreData]}>
      {props.children}
    </StoreContext.Provider>
  );
};
