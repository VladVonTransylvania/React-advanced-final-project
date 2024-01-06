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
  Select,
  useToast,
} from "@chakra-ui/react";
import { updateData } from "../util/api";
import { DataContext } from "../contexts/DataContext";

// Utility function to convert ISO datetime string to local datetime format
function toLocalDateTimeString(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const EditEventModal = ({ isOpen, onClose, event }) => {
  const [editedEvent, setEditedEvent] = useState({
    title: event?.title || "",
    description: event?.description || "",
    image: event?.image || "",
    startTime: event?.startTime ? toLocalDateTimeString(event.startTime) : "",
    endTime: event?.endTime ? toLocalDateTimeString(event.endTime) : "",
    categoryIds: event?.categoryIds || [],
  });

  const { categories } = useContext(DataContext);
  const toast = useToast();

  useEffect(() => {
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
    const { name, value } = e.target;
    if (name === "categoryIds") {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => parseInt(option.value) // Make sure category IDs are integers
      );
      setEditedEvent({ ...editedEvent, [name]: selectedOptions });
    } else {
      setEditedEvent({ ...editedEvent, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await updateData(`events/${event.id}`, {
        ...editedEvent,
        categoryIds: editedEvent.categoryIds.map(Number), // Ensure category IDs are sent as numbers
      });
      console.log("Update Response:", response); // Debugging line
      toast({
        title: "Event updated successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error("Update Error:", error); // Debugging line
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Form controls for each field */}
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={editedEvent.title}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input
              name="description"
              value={editedEvent.description}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Image URL</FormLabel>
            <Input
              name="image"
              value={editedEvent.image}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Start Time</FormLabel>
            <Input
              name="startTime"
              type="datetime-local"
              value={editedEvent.startTime}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>End Time</FormLabel>
            <Input
              name="endTime"
              type="datetime-local"
              value={editedEvent.endTime}
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
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save Changes
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
