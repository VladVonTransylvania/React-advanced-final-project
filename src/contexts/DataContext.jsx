import React, { createContext, useState, useEffect } from "react";
import { fetchData } from "../util/api";

// Creating a React Context for global data sharing across components
export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // State hooks for categories, users, loading status, and error handling
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook for fetching data on component mount
  useEffect(() => {
    // Define an asynchronous function for fetching data
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        // Fetch categories data and update the state
        const categoriesData = await fetchData("categories");
        setCategories(categoriesData);

        // Fetch users data and update the state
        const usersData = await fetchData("users");
        setUsers(usersData);
      } catch (err) {
        setError(err.message || "Something went wrong!");
      }
      // Set loading state to false once data fetching is complete
      setIsLoading(false);
    };

    // Execute the fetchDataAsync function
    fetchDataAsync();
  }, []);

  return (
    // Using the Context Provider to make state available to child components
    <DataContext.Provider value={{ categories, users, isLoading, error }}>
      {children}
    </DataContext.Provider>
  );
};
