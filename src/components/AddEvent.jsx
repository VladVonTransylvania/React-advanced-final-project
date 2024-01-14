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
import Footer from "../components/Footer";

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
      <Flex
        bg="rgba(240, 248, 255, 0.3)"
        maxWidth="750px"
        width="100%"
        textAlign="center"
        flex="1"
        py={5}
        align="center" // Ensure alignment is centered
        justify="center" // Ensure content is centered vertically
        mx={10}
      >
        <Box
          bg="rgba(240, 248, 255, 0.9)"
          maxWidth="700px"
          width="100%"
          mb="20px"
          height="100%"
          mt="20px"
          borderRadius="10px"
          boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.9), 0px 0px 20px 10px rgba(135, 206, 250, 0.9)"
        >
          <Box p={5} borderRadius="15px">
            <Heading
              as="h2"
              size="lg"
              mb="60px"
              mt="25px"
              textAlign="center"
              p={5}
              boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.6), 0px 0px 20px 10px rgba(135, 206, 250, 0.6)"
              borderRadius="15px"
            >
              Create Event
            </Heading>

            <form onSubmit={handleSubmit}>
              <FormControl isRequired mb={6}>
                <FormLabel htmlFor={titleId} fontWeight="bold">
                  Event Title
                </FormLabel>
                <Input
                  id={titleId}
                  name="title"
                  type="text"
                  value={eventData.title}
                  onChange={handleChange}
                  border="1px solid black"
                  fontWeight="bold"
                />
              </FormControl>
              <FormControl isRequired mb={6}>
                <FormLabel htmlFor={descriptionId} fontWeight="bold">
                  Description
                </FormLabel>
                <Input
                  id={descriptionId}
                  name="description"
                  type="text"
                  value={eventData.description}
                  onChange={handleChange}
                  border="1px solid black"
                  fontWeight="bold"
                />
              </FormControl>
              <FormControl mb={6}>
                <FormLabel htmlFor={imageId} fontWeight="bold">
                  Image URL
                </FormLabel>
                <Input
                  id={imageId}
                  name="image"
                  type="text"
                  value={eventData.image}
                  onChange={handleChange}
                  border="1px solid black"
                  fontWeight="bold"
                />
              </FormControl>
              <FormControl isRequired mb={6}>
                <FormLabel htmlFor={startTimeId} fontWeight="bold">
                  Start Time
                </FormLabel>
                <Input
                  id={startTimeId}
                  name="startTime"
                  type="datetime-local"
                  value={eventData.startTime}
                  onChange={handleChange}
                  border="1px solid black"
                />
              </FormControl>
              <FormControl isRequired mb={6}>
                <FormLabel htmlFor={endTimeId} fontWeight="bold">
                  End Time
                </FormLabel>
                <Input
                  id={endTimeId}
                  name="endTime"
                  type="datetime-local"
                  value={eventData.endTime}
                  onChange={handleChange}
                  border="1px solid black"
                />
              </FormControl>
              <FormControl mt={8}>
                <Flex alignItems="center">
                  <FormLabel mb="64px" mr={6} fontWeight="bold">
                    Categories:
                  </FormLabel>
                  <Stack>
                    {categories.map((category) => (
                      <Checkbox
                        key={category.id}
                        value={String(category.id)}
                        id={`category-${category.id}`}
                        onChange={handleChange}
                        isChecked={eventData.categoryIds.includes(category.id)}
                        fontWeight="bold"
                        name="categoryIds"
                        sx={{
                          ".chakra-checkbox__control": {
                            borderColor: "blue.500", // Change this to your desired color
                          },
                          ".chakra-checkbox__label": {
                            color: "initial", // Keeps the text color unchanged
                          },
                        }}
                      >
                        {category.name}
                      </Checkbox>
                    ))}
                  </Stack>
                </Flex>
              </FormControl>
              <Text fontSize="sm" color="red.500" mt={5}>
                *** Fields marked with * are mandatory
              </Text>
              <Flex
                mt="50px"
                justifyContent="space-between"
                p={8}
                boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.9), 0px 0px 20px 10px rgba(135, 206, 250, 0.9)"
                mb="50px"
                borderRadius="10px"
                width={{ base: "100%", md: "auto" }}
              >
                <Button
                  type="submit"
                  variant="ghost"
                  boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.9), 0px 0px 20px 10px rgba(135, 206, 250, 0.9)"
                  borderColor="green.500" // Dark green border color
                  color="darkgreen" // Dark green text color
                  _hover={{ bg: "green.500", color: "white" }} // Optional: Styling for hover state
                >
                  Add Event
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="ghost"
                  boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.9), 0px 0px 20px 10px rgba(135, 206, 250, 0.9)"
                  color="gray.600"
                  _hover={{ bg: "gray.300", color: "black", border: "0.1em solid black" }}
                >
                  Go Back
                </Button>
              </Flex>
            </form>
          </Box>
        </Box>
      </Flex>
      <Footer />
    </Flex>
  );
};
