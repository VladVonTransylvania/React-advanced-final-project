import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchData, postData, updateData } from "../util/api"; // These functions need to be defined in api.js
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Heading,
  VStack,
  Textarea,
  Flex,
} from "@chakra-ui/react";

export const EventForm = ({ isEdit }) => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
    createdBy: 1, // Assuming a default user for creation
  });
  const { eventId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && eventId) {
      fetchData(`events/${eventId}`).then((data) => setEventData(data));
    }
  }, [isEdit, eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEdit ? updateData : postData;
    await method("events", eventData);
    navigate("/");
  };

  return (
    <Flex align="center" justify="center" minH="100vh" width="full" padding="4">
      <Box p={5} w="full" maxW="md" boxShadow="md" borderRadius="lg" bg="white">
        <Heading mb={6} textAlign="center">
          {isEdit ? "Edit Event" : "Create Event"}
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel htmlFor="title">Event Title</FormLabel>
              <Input
                id="title"
                name="title"
                type="text"
                value={eventData.title}
                onChange={handleChange}
                placeholder="Enter event title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea
                id="description"
                name="description"
                value={eventData.description}
                onChange={handleChange}
                placeholder="Describe the event"
              />
            </FormControl>

            {/* Include other form controls for additional fields like startTime, endTime, etc. */}

            <Button mt={4} colorScheme="teal" type="submit">
              {isEdit ? "Update Event" : "Add Event"}
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};