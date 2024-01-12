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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/** Form controls for each editable field of the event **/}
          <FormControl>
            <FormLabel htmlFor={titleId}>Title</FormLabel>
            <Input
              id={titleId}
              name="title"
              value={editedEvent.title}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor={descriptionId}>Description</FormLabel>
            <Input
              id={descriptionId}
              name="description"
              value={editedEvent.description}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor={imageId}>Image URL</FormLabel>
            <Input
              id={imageId}
              name="image"
              value={editedEvent.image}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor={startTimeId}>Start Time</FormLabel>
            <Input
              id={startTimeId}
              name="startTime"
              type="datetime-local"
              value={editedEvent.startTime}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor={endTimeId}>End Time</FormLabel>
            <Input
              id={endTimeId}
              name="endTime"
              type="datetime-local"
              value={editedEvent.endTime}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel id={categoryId}>Categories:</FormLabel>
            <Stack>
              {categories.map((category) => (
                <Checkbox
                  key={category.id}
                  id={`event-${event?.id}-category-${category.id}`}
                  value={String(category.id)}
                  onChange={handleChange}
                  isChecked={editedEvent.categoryIds.includes(category.id)}
                  name="categoryIds"
                >
                  {category.name}
                </Checkbox>
              ))}
            </Stack>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save Changes
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            border="1px"
            borderColor="gray.500"
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
