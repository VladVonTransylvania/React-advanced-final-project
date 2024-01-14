import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  useToast,
  Flex,
  Text
} from "@chakra-ui/react";
import { updateData } from "../util/api";
import { DataContext } from "../contexts/DataContext";

// Function to convert ISO date-time to local date-time format
function toLocalDateTimeString(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  // Formatting date components
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}T${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  return formattedDate;
}

export const EditEventModal = ({ isOpen, onClose, event, onEventUpdate }) => {
  // State for edited event data
  const [editedEvent, setEditedEvent] = useState({
    title: event?.title || "",
    description: event?.description || "",
    image: event?.image || "",
    startTime: event?.startTime ? toLocalDateTimeString(event.startTime) : "",
    endTime: event?.endTime ? toLocalDateTimeString(event.endTime) : "",
    categoryIds: event?.categoryIds || [],
  });

  const { categories } = useContext(DataContext); // Accessing categories from DataContext
  const toast = useToast(); // Hook for showing toast notifications

  useEffect(() => {
    // Effect to update state when event prop changes
    if (event) {
      setEditedEvent({
        title: event.title || "",
        description: event.description || "",
        image: event.image || "",
        startTime: event.startTime
          ? toLocalDateTimeString(event.startTime)
          : "",
        endTime: event.endTime ? toLocalDateTimeString(event.endTime) : "",
        categoryIds: event.categoryIds || [],
      });
    }
  }, [event]);

  const handleChange = (e) => {
    // Handling form input changes
    const { name, value, checked } = e.target;
    if (name === "categoryIds") {
      // Special handling for category checkboxes
      const categoryId = parseInt(value);
      const newCategories = checked
        ? [...editedEvent.categoryIds, categoryId]
        : editedEvent.categoryIds.filter((id) => id !== categoryId);

      setEditedEvent({ ...editedEvent, categoryIds: newCategories });
    } else {
      setEditedEvent({ ...editedEvent, [name]: value });
    }
  };

  const updateEvent = async () => {
    // Async function to update event data
    return await updateData(`events/${event.id}`, editedEvent);
  };

  const handleSubmit = async () => {
    // Handling form submission
    try {
      const response = await updateEvent();

      if (response) {
        onEventUpdate({ ...event, ...editedEvent }); // Updating parent component state
      } else {
        // Handle case where response is not as expected
        toast({
          title: "Event update response not valid",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Failed to update event.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  };

  // Unique IDs for form elements based on event ID
  const titleId = `event-${event?.id}-title`;
  const descriptionId = `event-${event?.id}-description`;
  const imageId = `event-${event?.id}-image`;
  const startTimeId = `event-${event?.id}-startTime`;
  const endTimeId = `event-${event?.id}-endTime`;
  const categoryId = `event-${event?.id}-categories-label`;

  // Modal component structure
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent
        boxShadow="inset 0px 0px 20px 15px rgba(135, 206, 250, 0.5)"
        py={10}
        bg="rgba(240, 248, 255, 0.9)"
      >
        <ModalHeader>Edit Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center">
          {/** Form controls for each editable field of the event **/}
          <FormControl isRequired mb={5}>
            <FormLabel htmlFor={titleId} fontWeight="bold">
              Event Title
            </FormLabel>
            <Input
              id={titleId}
              name="title"
              value={editedEvent.title}
              onChange={handleChange}
              border="1px solid black"
            />
          </FormControl>
          <FormControl isRequired mb={5}>
            <FormLabel htmlFor={descriptionId} fontWeight="bold">
              Description
            </FormLabel>
            <Input
              id={descriptionId}
              name="description"
              value={editedEvent.description}
              onChange={handleChange}
              border="1px solid black"
            />
          </FormControl>
          <FormControl mb={5}>
            <FormLabel htmlFor={imageId} fontWeight="bold">
              Image URL
            </FormLabel>
            <Input
              id={imageId}
              name="image"
              value={editedEvent.image}
              onChange={handleChange}
              border="1px solid black"
            />
          </FormControl>
          <FormControl isRequired mb={5}>
            <FormLabel htmlFor={startTimeId} fontWeight="bold">
              Start Time
            </FormLabel>
            <Input
              id={startTimeId}
              name="startTime"
              type="datetime-local"
              value={editedEvent.startTime}
              onChange={handleChange}
              border="1px solid black"
            />
          </FormControl>
          <FormControl isRequired mb={5}>
            <FormLabel htmlFor={endTimeId} fontWeight="bold">
              End Time
            </FormLabel>
            <Input
              id={endTimeId}
              name="endTime"
              type="datetime-local"
              value={editedEvent.endTime}
              onChange={handleChange}
              border="1px solid black"
            />
          </FormControl>
          <FormControl mt={6}>
            <Flex alignItems="center">
              <FormLabel id={categoryId} fontWeight="bold" mb="64px" mr={4}>
                Categories:
              </FormLabel>
              <Stack>
                {categories.map((category) => (
                  <Checkbox
                    key={category.id}
                    id={`event-${event?.id}-category-${category.id}`}
                    value={String(category.id)}
                    onChange={handleChange}
                    isChecked={editedEvent.categoryIds.includes(category.id)}
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
            <Text fontSize="sm" color="red.500" mt={4}>
              *** Fields marked with * are mandatory
            </Text>
          </FormControl>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="space-between">
          <Button
            onClick={handleSubmit}
            variant="ghost"
            boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.4), 0px 0px 20px 10px rgba(135, 206, 250, 0.4)"
            color="darkgreen" // Dark green text color
            _hover={{ bg: "green.500", color: "white" }} // Optional: Styling for hover state
          >
            Save Changes
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.4), 0px 0px 20px 10px rgba(135, 206, 250, 0.4)"
            color="gray.600"
            _hover={{ bg: "gray.300", color: "black", border: "0.1em solid black" }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
