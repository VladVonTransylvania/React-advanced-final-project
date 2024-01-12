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
  Text
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

  const { categories } = useContext(DataContext);
  const toast = useToast();
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await postData("events", eventData);
      if (!result) {
        throw new Error("Failed to receive response from server");
      }
      toast({
        title: "Event added successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setEventData({
        title: "",
        description: "",
        image: "",
        startTime: "",
        endTime: "",
        categoryIds: [],
      });
    } catch (error) {
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

  const handleCancel = () => {
    navigate("/");
  };

  // Unique IDs for form elements based on data structure
  const titleId = "event-title";
  const descriptionId = "event-description";
  const imageId = "event-image";
  const startTimeId = "event-startTime";
  const endTimeId = "event-endTime";

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh">
      <Box
        borderWidth="1px"
        bg="#FDFDFD"
        maxWidth="700px"
        width="100%"
        mx="auto"
        minH="100vh"
      >
        <Box
          p={5}
          boxShadow="inset 0px 0px 15px 5px rgba(173, 216, 230, 0.2), inset 0px 0px 20px 10px rgba(135, 206, 250, 0.2)"
        >
          <Heading
            as="h2"
            size="lg"
            mb="50px"
            mt="25px"
            textAlign="center"
            bg="rgba(240, 248, 255, 0.9)"
            p={5}
            boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.3), 0px 0px 20px 10px rgba(135, 206, 250, 0.3)"
            borderRadius="15px"
          >
            Create Event
          </Heading>

          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel htmlFor={titleId}>Event Title</FormLabel>
              <Input
                id="event-title"
                name="title"
                type="text"
                value={eventData.title}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor={descriptionId}>Description</FormLabel>
              <Input
                id="event-description"
                name="description"
                type="text"
                value={eventData.description}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor={imageId}>Image URL</FormLabel>
              <Input
                id="event-image"
                name="image"
                type="text"
                value={eventData.image}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor={startTimeId}>Start Time</FormLabel>
              <Input
                id="event-startTime"
                name="startTime"
                type="datetime-local"
                value={eventData.startTime}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor={endTimeId}>End Time</FormLabel>
              <Input
                id="event-endTime"
                name="endTime"
                type="datetime-local"
                value={eventData.endTime}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={8}>
              <FormLabel>Categories:</FormLabel>
              <Stack>
                {categories.map((category) => (
                  <Checkbox
                    key={category.id}
                    value={String(category.id)}
                    id={`category-${category.id}`}
                    onChange={handleChange}
                    isChecked={eventData.categoryIds.includes(category.id)}
                    name="categoryIds"
                  >
                    {category.name}
                  </Checkbox>
                ))}
              </Stack>
              <Text fontSize="sm" color="red.500" mt={7}>
                *** Fields marked with * are mandatory
              </Text>
            </FormControl>
            <Flex
              mt={15}
              justifyContent="space-between"
              bg="rgba(240, 248, 255, 0.9)"
              p={6}
              boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.3), 0px 0px 20px 10px rgba(135, 206, 250, 0.3)"
              mb="50px"
              borderRadius="10px"
            >
              <Button
                colorScheme="teal"
                type="submit"
                boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.2), 0px 0px 20px 10px rgba(135, 206, 250, 0.2)"
              >
                Add Event
              </Button>
              <Button
                colorScheme="gray"
                onClick={handleCancel}
                border="2px"
                borderColor="gray.500"
                boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.3), 0px 0px 20px 10px rgba(135, 206, 250, 0.3)"
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
