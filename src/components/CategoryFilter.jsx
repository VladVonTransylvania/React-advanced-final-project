import React from "react";
import { Select } from "@chakra-ui/react";

export const CategoryFilter = ({ categories, onFilter }) => {
  const handleFilterChange = (e) => {
    onFilter(e.target.value);
  };

  return (
    <Select
      onChange={handleFilterChange}
      sx={{ backgroundColor: "white", color: "black", borderColor: "gray.300" }}
      w="50%"
    >
      <option value="">All Categories</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </Select>
  );
};
