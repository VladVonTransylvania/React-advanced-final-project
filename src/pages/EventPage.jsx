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
  // Access event ID from URL parameters
  const { eventId } = useParams();

  // State declarations for event, users, and categories data
  const [event, setEvent] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  // Navigation and toast (for notifications) hooks
  const navigate = useNavigate();
  const toast = useToast();

  // Disclosure hook for controlling modal visibility
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Effect hook to fetch event, user, and category data
  useEffect(() => {
    fetchData("users").then(setUsers);
    fetchData("categories").then(setCategories);

    fetchData(`events/${eventId}`).then((eventData) => {
      setEvent(eventData);
    });
  }, [eventId]);

  // Function to find event creator's details
  const getEventCreator = (creatorId) => {
    return users.find((user) => user.id === creatorId) || {};
  };

  // Function to map category IDs to category names
  const getEventCategories = (categoryIds) => {
    const ids = Array.isArray(categoryIds) ? categoryIds : [];

    return categories
      .filter((category) => ids.includes(category.id))
      .map((category) => category.name);
  };

  // Function to handle event update
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

  // Function to handle event deletion
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

  // Function to open edit modal
  const handleEdit = () => {
    onOpen();
  };

  // Function to navigate back to the events list
  const handleCancel = () => {
    navigate("/");
  };

  return (
    <Flex align="center" justify="center" minH="100vh">
      <Box
        p={3}
        boxShadow="lg"
        bg="white"
        maxWidth="800px"
        width="100%"
        mx="auto"
        textAlign="center"
      >
        {/* Conditional rendering: If event data is available, display the event details; otherwise, show a loading message */}
        {event ? (
          <>
            {/* Display the event title */}
            <Heading
              as="h1"
              size="xl"
              bg="rgba(240, 248, 255, 0.9)"
              py="20px" // Apply padding of 20px on top and bottom
              mb="20px"
              boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.3), 0px 0px 20px 10px rgba(135, 206, 250, 0.3)"
            >
              {event.title}
            </Heading>

            {/* Display the event image */}
            <Flex
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              bg="rgba(240, 248, 255, 0.9)"
              pt="25px"
              boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.3), 0px 0px 20px 10px rgba(135, 206, 250, 0.3)"
            >
              <Image
                src={event.image}
                alt={event.title}
                mb={4}
                borderRadius="md"
                m="0 auto"
                bg="rgba(240, 248, 255, 0.9)"
                boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.3), 0px 0px 20px 10px rgba(135, 206, 250, 0.3)"
              />

              {/* Display the event description */}
              <Text fontSize="md" mb={2} marginTop="20px">
                {event.description}
              </Text>

              {/* Display event start and end times */}
              <Text mb={2}>
                Start Time: {new Date(event.startTime).toLocaleString()}
              </Text>
              <Text mb={2}>
                End Time: {new Date(event.endTime).toLocaleString()}
              </Text>

              {/* Display event categories using tags */}
              <Box mb={4}>
                Categories:{" "}
                {getEventCategories(event.categoryIds).map(
                  (category, index) => (
                    <Tag key={index} mr={2}>
                      {category}
                    </Tag>
                  )
                )}
              </Box>
            </Flex>

            {/** Display the name and image of the event creator */}
            <Box
              mb={4}
              bg="rgba(240, 248, 255, 0.9)"
              py="20px" // Apply padding of 20px on top and bottom
              boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.3), 0px 0px 20px 10px rgba(135, 206, 250, 0.3)"
            >
              <Flex alignItems="center" justifyContent="center">
                <Image
                  src={getEventCreator(event.createdBy).image}
                  alt={getEventCreator(event.createdBy).name}
                  boxSize="100px"
                  mr={10} // Margin right to add space between image and text
                />
                <Text as="span" fontWeight="bold">
                  Created By: {getEventCreator(event.createdBy).name}
                </Text>
              </Flex>
            </Box>

            {/* Display action buttons for editing and deleting the event */}
            <Flex
              bg="rgba(240, 248, 255, 0.9)"
              pt="10"
              pb="10"
              pl="5"
              pr="5"
              flexDirection={{ base: "column", sm: "row" }} // Column on small screens, row on larger
              alignItems="center" // Center items vertically
              justifyContent={{ base: "center", sm: "space-between" }} // Center on small screens, space between on larger
              boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.3), 0px 0px 20px 10px rgba(135, 206, 250, 0.3)"
            >
              {/* Flex container for 'Edit Event' and 'Go Back' buttons */}
              <Flex
                direction={{ base: "column", sm: "row" }} // Column on small screens, row on larger
                mb={{ base: 4, sm: 0 }} // Margin bottom on small screens
                alignItems="center" // Center items horizontally in the Flex container
              >
                <Button
                  colorScheme="blue"
                  onClick={handleEdit}
                  mb={{ base: 4, sm: 0 }}
                  mr={{ sm: 10 }}
                >
                  Edit Event
                </Button>

                <Button
                  colorScheme="gray"
                  onClick={handleCancel}
                  border="1px"
                  borderColor="gray.500"
                >
                  Go Back
                </Button>
              </Flex>

              {/* 'Delete Event' button */}
              <Button colorScheme="red" onClick={handleDelete}>
                Delete Event
              </Button>
            </Flex>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </Box>

      {/* Edit Event Modal component for updating the event details */}
      <EditEventModal
        isOpen={isOpen}
        onClose={onClose}
        event={event}
        onEventUpdate={handleEventUpdate}
      />
    </Flex>
  );
};
