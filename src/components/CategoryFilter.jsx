import React from "react";
import { Select, Flex } from "@chakra-ui/react";

export const CategoryFilter = ({ categories, onFilter }) => {
  // Function to handle changes in the category filter
  const handleFilterChange = (e) => {
    //  Calls the onFilter function, passing the selected category's value
    onFilter(e.target.value);
  };

  //Category filter
  return (
    <Flex direction="column" align="center" w="100%">
      <Flex align="center" w="40%">
       
        <Select
          onChange={handleFilterChange}
          sx={{
            backgroundColor: "white",
            color: "black",
            borderColor: "gray.300",
          }}
          w="100%"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </Flex>
    </Flex>
  );
};
