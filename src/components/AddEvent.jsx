import React, { useState, useContext } from "react";
import { postData } from "../util/api"; 
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Flex,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { DataContext } from "../contexts/DataContext";
import { useNavigate } from "react-router-dom"; 

export const AddEvent = () => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categoryIds: [], 
  });
  
  const { categories } = useContext(DataContext); // Use DataContext to get categories

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryIds") {

      // Handle multiple select for categories
      const selectedCategories = Array.from(
        e.target.selectedOptions,
        (option) => parseInt(option.value)
      );
      setEventData({ ...eventData, [name]: selectedCategories });
    } else {
      setEventData({ ...eventData, [name]: value });
    }
  };

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postData("events", eventData);

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
        title: "Failed to add event.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const navigate = useNavigate();

  const handleCancel = () => {
    // Navigate to the events list page
    navigate("/");
  };

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
            <FormControl>
              <FormLabel htmlFor="categoryIds">Categories</FormLabel>
              <Select
                id="categoryIds"
                name="categoryIds"
                onChange={handleChange}
                placeholder="Select category"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Flex mt={50} justifyContent="space-between">
              <Button colorScheme="teal" type="submit">
                Add Event
              </Button>
              <Button
                colorScheme="gray"
                onClick={handleCancel}
                border="2px" // Adjust border thickness as needed
                borderColor="gray.500"
              >
                Cancel
              </Button>
            </Flex>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};