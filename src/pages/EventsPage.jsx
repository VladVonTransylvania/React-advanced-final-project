import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { fetchData } from "../util/api";
import { DataContext } from "../contexts/DataContext";
import { Flex, Box, Button, Text, Image, Tag } from "@chakra-ui/react";
import { SearchBar } from "../components/SearchBar";
import { CategoryFilter } from "../components/CategoryFilter";
import Footer from "../components/Footer";

export const EventsPage = () => {
  // State declarations
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  

  // Accessing the categories from DataContext
  const { categories } = useContext(DataContext);

  // useEffect hook to load events data on component mount
  useEffect(() => {
    const loadEvents = async () => {
      const eventsData = await fetchData("events");
      setEvents(eventsData);
    };

    loadEvents();
  }, []);

  // Function to handle search input changes
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Function to handle category filter changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Filtering events based on search term and selected category
  const filteredEvents = events.filter((event) => {
    const matchesSearchTerm =
      event.title.toLowerCase().includes(searchTerm) ||
      event.description.toLowerCase().includes(searchTerm);

    const categoryIds = Array.isArray(event.categoryIds)
      ? event.categoryIds
      : [];

    const categoryId = parseInt(selectedCategory);
    const matchesCategory =
      isNaN(categoryId) || categoryIds.includes(categoryId);

    return matchesSearchTerm && matchesCategory;
  });

  // Function to get category names for display
 const getEventCategories = (categoryIds) => {
   if (!categories || categories.length === 0) {
     return []; // Return an empty array if there are no categories
   }

   if (!Array.isArray(categoryIds)) {
     return []; // Return an empty array if categoryIds is not an array
   }

   return categoryIds
     .map((id) => {
       const foundCategory = categories.find((category) => category.id === id);
       return foundCategory ? foundCategory.name : null;
     })
     .filter((name) => name !== null); // Filter out any null values
 };


  return (
    <Flex
      direction="column"
      align="center"
      justify="flex-start"
     
    >
      <Flex
        direction="column"
        align="center"
        justify="flex-start"
        w="100%"
        bg="rgba(240, 248, 255, 0.8)"
      >
        {/* Category Filter */}
        <Flex w="100%" maxW="800px" mt="10px" justifyContent="center">
          <CategoryFilter
            categories={categories}
            onFilter={handleCategoryChange}
          />
        </Flex>

        {/* Search Bar */}
        <Flex w="100%" maxW="800px" mb="20px" mt="20px" justifyContent="center">
          <SearchBar onSearch={handleSearch} w="80%" />
        </Flex>

        {/* Button to create new event */}
        <Flex justifyContent="center" mb="20px">
          <Link to="/add-event">
            <Button
              colorScheme="blue"
              px={8}
              _hover={{
                transform: "translateY(-2px) scale(1.05)", // Slightly lift and scale up the button
                boxShadow: "0px 10px 15px rgba(0, 126, 255, 0.6)", // Deeper shadow for a 3D effect
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
              }}
            >
              Create Event
            </Button>
          </Link>
        </Flex>
      </Flex>

      {/* Display of filtered events */}
      {filteredEvents.map((event) => (
        <Flex direction="column" mt="30px" mb="30px" key={event.id} w="100%">
          <Box
            key={event.id}
            borderRadius="10px"
            boxShadow="md"
            bg="rgba(240, 248, 255, 0.9)"
            w="100%"
            maxW="800px"
            textAlign="center"
            m="0 auto"
            p="2px"
            _hover={{
              boxShadow:
                "inset 0px 0px 15px 5px rgba(173, 216, 230, 0.6), inset 0px 0px 20px 10px rgba(135, 206, 250, 0.6)",
            }}
          >
            <Link to={`/event/${event.id}`}>
              <Text fontSize="xl" fontWeight="bold" mb="20px" mt="20px">
                {event.title}
              </Text>
              <Flex justifyContent="center"></Flex>
              <Image
                src={event.image}
                alt={event.title}
                borderRadius="md"
                objectFit="cover"
                maxWidth="100%"
                height="auto"
                mb="10px"
                mx="auto"
                boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.3), 0px 0px 20px 10px rgba(135, 206, 250, 0.3)"
              />
              <Text
                mt="25px"
                pl="50px" // Padding on the left
                pr="50px"
              >
                {event.description}
              </Text>
              <Text mt="10px">
                Start Time: {new Date(event.startTime).toLocaleString()}
              </Text>
              <Text>End Time: {new Date(event.endTime).toLocaleString()}</Text>
              <Box mb="10px" mt="10px">
                Categories:{" "}
                {getEventCategories(event.categoryIds).map(
                  (categoryName, index) => (
                    <Tag
                      key={index} // Use the index as the key, or use a unique category ID if available
                      bg="rgba(240, 248, 255, 0.9)"
                      boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.3), 0px 0px 20px 10px rgba(135, 206, 250, 0.3)"
                      ml={3}
                      fontWeight="bold"
                    >
                      {categoryName}
                    </Tag>
                    
                  )
                )}
              </Box>
            </Link>
          </Box>
        </Flex>
      ))}
      <Footer />
    </Flex>
  );
};

export default EventsPage;
