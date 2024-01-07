import React, { useState, useContext } from "react";
import { postData } from "../util/api"; 
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Select,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { DataContext } from "../contexts/DataContext"; 

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
  const [message, setMessage] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postData("events", eventData);
      setMessage("Event added successfully!");
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
      setMessage("Failed to add event. Error: " + error.message);
    }
  };

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh">
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
        maxWidth="800px"
        width="100%"
        mx="auto"
      >
        <Heading as="h2" size="lg" mb={6} textAlign="center">
          Add Event Form
        </Heading>

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

          <Button mt={4} colorScheme="teal" type="submit">
            Add Event
          </Button>
        </form>
        {message && (
          <Text mt={4} color="red.500">
            {message}
          </Text>
        )}
      </Box>
    </Flex>
  );
};