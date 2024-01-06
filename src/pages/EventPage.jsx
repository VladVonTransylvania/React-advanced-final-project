import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchData, deleteData } from "../util/api";
import { EditEventModal } from "../components/EditEventModal";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  useDisclosure,
  Image,
  Tag,
  useToast,
} from "@chakra-ui/react";

export const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  // State for deletion message
  const navigate = useNavigate();
  const toast = useToast(); // Toast instance
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Fetch users and categories data
    fetchData("users").then(setUsers);
    fetchData("categories").then(setCategories);

    fetchData(`events/${eventId}`).then((eventData) => {
      setEvent(eventData);
    });
  }, [eventId]);

  const getEventCreator = (creatorId) => {
    return users.find((user) => user.id === creatorId) || {};
  };

  const getEventCategories = (categoryIds) => {
    // Ensure categoryIds is always treated as an array
    const ids = Array.isArray(categoryIds) ? categoryIds : [];

    return categories
      .filter((category) => ids.includes(category.id))
      .map((category) => category.name);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteData(`events/${eventId}`);
        toast({
          title: "Event deleted successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // Wait for 5 seconds before navigating
        setTimeout(() => navigate("/"), 2000);
      } catch (error) {
        toast({
          title: "Failed to delete event.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        // No delay needed here, navigate immediately
        navigate("/");
      }
    }
  };

  const handleEdit = () => {
    onOpen();
  };

  return (
    <Flex align="center" justify="center" minH="100vh">
      <Box p={4} w="full" maxW={{ base: "90%", sm: "600px", md: "800px" }}>
        {event ? (
          <>
            <Heading as="h1" size="xl">
              {event.title}
            </Heading>
            <Image src={event.image} alt={event.title} mt={4} />
            <Text fontSize="md" mt={2}>
              {event.description}
            </Text>
            <Text mt={2}>
              Start Time: {new Date(event.startTime).toLocaleString()}
            </Text>
            <Text mt={2}>
              End Time: {new Date(event.endTime).toLocaleString()}
            </Text>
            <Box mt={2}>
              Categories:{" "}
              {getEventCategories(event.categoryIds).map((category, index) => (
                <Tag key={index} mr={2}>
                  {category}
                </Tag>
              ))}
            </Box>
            <Box mt={2}>
              Created By:{" "}
              <Text as="span" fontWeight="bold">
                {getEventCreator(event.createdBy).name}
              </Text>
              <Image
                src={getEventCreator(event.createdBy).image}
                alt={getEventCreator(event.createdBy).name}
                boxSize="50px"
              />
            </Box>
            <Flex justifyContent="space-between" mt={4}>
              <Button colorScheme="blue" onClick={handleEdit}>
                Edit Event
              </Button>
              <Button colorScheme="red" onClick={handleDelete}>
                Delete Event
              </Button>
            </Flex>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </Box>
      <EditEventModal isOpen={isOpen} onClose={onClose} event={event} />
    </Flex>
  );
};
