import React, { useState, useContext } from "react";
import { postData } from "../util/api";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Checkbox,
  Flex,
  Heading,
  useToast,
  Stack,
} from "@chakra-ui/react";
import { DataContext } from "../contexts/DataContext";
import { useNavigate } from "react-router-dom";

// AddEvent Component: Manages the creation of new events
export const AddEvent = () => {
  // State for storing event data
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
  });

  // Context and Hooks for functionality
  const { categories } = useContext(DataContext); // Access categories from DataContext
  const toast = useToast(); // Hook for showing toast notifications
  const navigate = useNavigate(); // Hook for navigating between pages

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "categoryIds") {
      const newCategories = checked
        ? [...eventData.categoryIds, parseInt(value)]
        : eventData.categoryIds.filter((id) => id !== parseInt(value));
      setEventData({ ...eventData, categoryIds: newCategories });
    } else {
      setEventData({ ...eventData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await postData("events", eventData);
      if (!result) {
        throw new Error("Failed to receive response from server");
      }
      // Display success toast
      toast({
        title: "Event added successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      // Reset form fields
      setEventData({
        title: "",
        description: "",
        image: "",
        startTime: "",
        endTime: "",
        categoryIds: [],
      });
    } catch (error) {
      // Toast for error messages
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate("/"); // Navigate to the home page
  };

  // Render the form for adding events
  return (
    <Flex direction="column" align="center" justify="center" minH="100vh">
      <Box
        borderWidth="1px"
        boxShadow="lg"
        bg="white"
        maxWidth="700px"
        width="100%"
        mx="auto"
        minH="100vh"
      >
        <Heading as="h2" size="lg" mb={10} mt="50px" textAlign="center">
          Create Event
        </Heading>
        <Box p={4}>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel htmlFor="title">Event Title</FormLabel>
              <Input
                id="title"
                name="title"
                type="text"
                value={eventData.title}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Input
                id="description"
                name="description"
                type="text"
                value={eventData.description}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="image">Image URL</FormLabel>
              <Input
                id="image"
                name="image"
                type="text"
                value={eventData.image}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="startTime">Start Time</FormLabel>
              <Input
                id="startTime"
                name="startTime"
                type="datetime-local"
                value={eventData.startTime}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="endTime">End Time</FormLabel>
              <Input
                id="endTime"
                name="endTime"
                type="datetime-local"
                value={eventData.endTime}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="categoryIds">Categories:</FormLabel>
              <Stack>
                {categories.map((category) => (
                  <Checkbox
                    key={category.id}
                    value={String(category.id)} // Ensure value is a string
                    onChange={handleChange}
                    isChecked={eventData.categoryIds.includes(category.id)}
                    name="categoryIds"
                  >
                    {category.name}
                  </Checkbox>
                ))}
              </Stack>
            </FormControl>

            <Flex mt={50} justifyContent="space-between">
              <Button colorScheme="teal" type="submit">
                Add Event
              </Button>
              <Button
                colorScheme="gray"
                onClick={handleCancel}
                border="2px" 
                borderColor="gray.500"
              >
                Go Back
              </Button>
            </Flex>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};
