import React, { createContext, useState, useEffect } from "react";
import { fetchData } from "../util/api"; // Make sure this path is correct

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      setIsLoading(true);
      try {
        const categoriesData = await fetchData("categories");
        setCategories(categoriesData);

        const usersData = await fetchData("users");
        setUsers(usersData);
      } catch (err) {
        setError(err.message || "Something went wrong!");
      }
      setIsLoading(false);
    };

    fetchDataAsync();
  }, []);

  return (
    <DataContext.Provider value={{ categories, users, isLoading, error }}>
      {children}
    </DataContext.Provider>
  );
};
