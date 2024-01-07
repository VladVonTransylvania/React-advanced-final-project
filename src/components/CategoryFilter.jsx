import React from "react";
import { Select, Flex, Text } from "@chakra-ui/react";

export const CategoryFilter = ({ categories, onFilter }) => {
  const handleFilterChange = (e) => {
    onFilter(e.target.value);
  };

  return (
    <Flex direction="column" align="center" w="50%" mb={4}>
  <Text mb={2} fontWeight="bold" textAlign="center">
    Category Filter:
  </Text>
  <Select
    onChange={handleFilterChange}
    sx={{ backgroundColor: "white", color: "black", borderColor: "gray.300" }}
    w="100%" // Ensure the Select dropdown takes the full width of the Flex container
  >
    <option value="">All Categories</option>
    {categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ))}
  </Select>
</Flex>
  );
    }
