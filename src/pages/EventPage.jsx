import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchData, deleteData, updateData } from "../util/api";
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

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
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
    const ids = Array.isArray(categoryIds) ? categoryIds : [];

    return categories
      .filter((category) => ids.includes(category.id))
      .map((category) => category.name);
  };

  const handleEventUpdate = async (updatedEventData) => {
    try {
      await updateData(`events/${eventId}`, updatedEventData);
      setEvent(updatedEventData);
      toast({
        title: "Event updated successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to update event.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
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

        setTimeout(() => navigate("/"), 2000);
      } catch (error) {
        toast({
          title: "Failed to delete event.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });

        navigate("/");
      }
    }
  };

  const handleEdit = () => {
    onOpen();
  };

  const handleCancel = () => {
    // Navigate to the events list page
    navigate("/");
  };


  return (
    <Flex align="center" justify="center" minH="100vh">
      <Box
        p={3}
        borderWidth="1px"
        boxShadow="lg"
        bg="white"
        maxWidth="800px"
        width="100%"
        mx="auto"
        textAlign="center"
      >
        {event ? (
          <>
            <Heading as="h1" size="xl" mb={4}>
              {event.title}
            </Heading>
            <Image
              src={event.image}
              alt={event.title}
              mb={4}
              borderRadius="md"
            />
            <Text fontSize="md" mb={2}>
              {event.description}
            </Text>
            <Text mb={2}>
              Start Time: {new Date(event.startTime).toLocaleString()}
            </Text>
            <Text mb={2}>
              End Time: {new Date(event.endTime).toLocaleString()}
            </Text>
            <Box mb={4}>
              Categories:{" "}
              {getEventCategories(event.categoryIds).map((category, index) => (
                <Tag key={index} mr={2}>
                  {category}
                </Tag>
              ))}
            </Box>
            <Box mb={4}>
              Created By:{" "}
              <Text as="span" fontWeight="bold" display="block">
                {getEventCreator(event.createdBy).name}
              </Text>
              <Flex justifyContent="center">
                <Image
                  src={getEventCreator(event.createdBy).image}
                  alt={getEventCreator(event.createdBy).name}
                  boxSize="100px"
                  ml={2}
                />
              </Flex>
            </Box>
            <Flex justifyContent="space-between" flexWrap="wrap">
              <Flex gap="3" direction={{ base: "column", sm: "row" }} mb={{ base: 3, sm: 0 }}>
                <Button colorScheme="blue" onClick={handleEdit}>
                Edit Event
               </Button>
               
               <Button
                 colorScheme="gray"
                onClick={handleCancel}
                border="2px"
                 borderColor="gray.500"
                >
              Cancel
              </Button>
          </Flex>
        <Button colorScheme="red" onClick={handleDelete} >
         Delete Event
      </Button>
      </Flex>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </Box>
      <EditEventModal
        isOpen={isOpen}
        onClose={onClose}
        event={event}
        onEventUpdate={handleEventUpdate}
      />
    </Flex>
  );
};
