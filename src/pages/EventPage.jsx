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
  Spacer
} from "@chakra-ui/react";
import Footer from "../components/Footer";

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

        setTimeout(() => navigate("/"), 1000);
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
    <Flex align="center" minH="100vh" direction="column">
      <Spacer />
      <Box
        p={6}
        boxShadow="lg"
        bg="rgba(240, 248, 255, 0.3)"
        maxWidth="900px"
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
              p="30px"
              boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.9), 0px 0px 20px 10px rgba(135, 206, 250, 0.9)"
              borderRadius="10px"
              mb={6}
            >
              {event.title}
            </Heading>

            <Flex
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              bg="rgba(240, 248, 255, 0.9)"
              pt="15px"
              pb="25px"
              boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.9), 0px 0px 20px 10px rgba(135, 206, 250, 0.9)"
              borderRadius="10px"
              mb={6}
            >
              {/* Display the event image */}
              <Image
                src={event.image}
                alt={event.title}
                mb={4}
                borderRadius="10px"
                m="0 auto"
                bg="rgba(240, 248, 255, 0.9)"
                boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.3), 0px 0px 20px 10px rgba(135, 206, 250, 0.3)"
                mt={6}
              />

              {/* Display the event description */}
              <Text mb={5} mt="50px" pl="50px" pr="50px" maxWidth="100%">
                {event.description}
              </Text>

              {/* Display event start and end times */}
              <Text mb={2}>
                Start Time: {new Date(event.startTime).toLocaleString()}
              </Text>
              <Text>End Time: {new Date(event.endTime).toLocaleString()}</Text>

              {/* Display event categories using tags */}
              <Box mb={4} mt={5}>
                Categories:{" "}
                {getEventCategories(event.categoryIds).map(
                  (category, index) => (
                    <Tag
                      key={index}
                      ml={3}
                      bg="rgba(240, 248, 255, 0.9)"
                      boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.3), 0px 0px 20px 10px rgba(135, 206, 250, 0.3)"
                      fontWeight="bold"
                    >
                      {category}
                    </Tag>
                  )
                )}
              </Box>
            </Flex>

            {/** Display the name and image of the event creator */}
            <Box
              bg="rgba(240, 248, 255, 0.9)"
              py="25px" // Apply padding of 20px on top and bottom
              boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.9), 0px 0px 20px 10px rgba(135, 206, 250, 0.9)"
              borderRadius="10px"
              mb={6}
            >
              <Flex alignItems="center" justifyContent="center">
                <Text as="span" fontWeight="bold" mr={10}>
                  Created By: {getEventCreator(event.createdBy).name}
                </Text>
                <Image
                  src={getEventCreator(event.createdBy).image}
                  alt={getEventCreator(event.createdBy).name}
                  boxSize="100px"
                  mr={3} // Margin right to add space between image and text
                  borderRadius="5px"
                  boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.3), 0px 0px 20px 10px rgba(135, 206, 250, 0.3)"
                  _hover={{
                    transform: "scale(1.5)", // Example hover effect
                    transition: "transform 0.2s",
                  }}
                />
              </Flex>
            </Box>

            {/* Display action buttons for editing and deleting the event */}
            <Flex
              bg="rgba(240, 248, 255, 0.9)"
              pt="5"
              pb="10"
              pl="5"
              pr="5"
              flexDirection={{ base: "column", sm: "row" }} // Column on small screens, row on larger
              alignItems="center" // Center items vertically
              justifyContent={{ base: "center", sm: "space-between" }} // Center on small screens, space between on larger
              boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.9), 0px 0px 20px 10px rgba(135, 206, 250, 0.9)"
              borderRadius="10px"
            >
              {/* Flex container for 'Edit Event' and 'Go Back' buttons */}
              <Flex
                direction={{ base: "column", sm: "row" }} // Column on small screens, row on larger
                mb={{ base: 4, sm: 0 }} // Margin bottom on small screens
                alignItems="center" // Center items horizontally in the Flex container
                mt={5}
              >
                <Button
                  onClick={handleEdit}
                  mb={{ base: 4, sm: 0 }}
                  mr={{ sm: 10 }}
                  boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.4), 0px 0px 20px 10px rgba(135, 206, 250, 0.4)"
                  color="blue.600" // Dark green text color
                  _hover={{ bg: "blue.500", color: "white" }}
                >
                  Edit Event
                </Button>

                <Button
                  onClick={handleCancel}
                  boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.4), 0px 0px 20px 10px rgba(135, 206, 250, 0.4)"
                  color="gray.600"
                  _hover={{
                    bg: "gray.300",
                    color: "black",
                    border: "0.1em solid black",
                  }}
                >
                  Go Back
                </Button>
              </Flex>

              {/* 'Delete Event' button */}
              <Button
                onClick={handleDelete}
                mt={5}
                boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.4), 0px 0px 20px 10px rgba(135, 206, 250, 0.4)"
                color="red"
                _hover={{ bg: "red.500", color: "white" }}
              >
                Delete Event
              </Button>
            </Flex>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
        
        {/* Edit Event Modal component for updating the event details */}
        <EditEventModal
          isOpen={isOpen}
          onClose={onClose}
          event={event}
          onEventUpdate={handleEventUpdate}
        />
      </Box>
    
      <Spacer />
      <Footer />
    </Flex>
  );
};
