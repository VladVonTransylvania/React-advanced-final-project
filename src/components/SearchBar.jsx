import React, { useState } from "react";

export const SearchBar = ({ onSearch }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    onSearch(e.target.value.toLowerCase());
  };

  const searchBarStyle = {
    width: "80%",
    maxWidth: "600px",
    padding: "10px",
    border: isFocused ? "2px solid #007bff" : "2px solid #ddd", // Blue border when focused
    borderRadius: "5px",
    backgroundColor: isFocused ? "#ffffff" : "#f8f8f8", // Lighter background when not focused
    boxShadow: isFocused
      ? "0 2px 8px rgba(0, 123, 255, 0.2)"
      : "0 2px 4px rgba(0, 0, 0, 0.9)", // More pronounced shadow when focused
    transition: "border-color 0.3s, box-shadow 0.3s, background-color 0.3s", // Smooth transition for focus effect
  };

  return (
    <input
      type="text"
      placeholder="Search events"
      onChange={handleSearch}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={searchBarStyle}
    />
  );
};
