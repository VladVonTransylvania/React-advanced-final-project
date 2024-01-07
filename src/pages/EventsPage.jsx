import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { fetchData } from "../util/api";
import { DataContext } from "../contexts/DataContext";
import { Flex, Box, Button, Text, Image } from '@chakra-ui/react';
import { SearchBar } from "../components/SearchBar"; // Import SearchBar component
import { CategoryFilter } from "../components/CategoryFilter";



export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { categories } = useContext(DataContext);

  useEffect(() => {
    const loadEvents = async () => {
      const eventsData = await fetchData("events");
      setEvents(eventsData);
    };

    loadEvents();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

   const filteredEvents = events.filter((event) => {
     const matchesSearchTerm =
       event.title.toLowerCase().includes(searchTerm) ||
       event.description.toLowerCase().includes(searchTerm);

     // Ensure event.categoryIds is treated as an array and parse selectedCategory safely
     const categoryIds = Array.isArray(event.categoryIds)
       ? event.categoryIds
       : [];
     const categoryId = parseInt(selectedCategory);
     const matchesCategory =
       isNaN(categoryId) || categoryIds.includes(categoryId);

     return matchesSearchTerm && matchesCategory;
   });

  const getCategoryNames = (categoryIds) => {
    if (!categories || categories.length === 0) {
      return "Loading categories...";
    }

    if (!Array.isArray(categoryIds)) {
      return "No categories";
    }

    return categoryIds
      .map((id) => {
        const foundCategory = categories.find((category) => category.id === id);
        return foundCategory ? foundCategory.name : "Unknown Category";
      })
      .filter(Boolean)
      .join(", ");
  };

  
return (
  
  <Flex direction="column" align="center" justify="flex-start" mt="20px">

    {/* Search Bar Container */}
    <Flex w="100%" maxW="800px" mb="20px" justifyContent="center">
      <SearchBar onSearch={handleSearch} w="60%" />
    </Flex>

    {/* Category Filter Container */}
    <Flex w="100%" maxW="800px" mb="20px" justifyContent="center">
      <CategoryFilter categories={categories} onFilter={handleCategoryChange} />
    </Flex>

    {/* Add event button */}
    <Flex justifyContent="center" mb="5">
      <Link to="/add-event">
        <Button colorScheme="blue">Create an event</Button>
      </Link>
    </Flex>

    {filteredEvents.map((event) => (
      <Flex direction="column" mb="20px" key={event.id} w="100%">
        <Box
          key={event.id}
          borderRadius="lg"
          overflow="hidden"
          p="4"
          mb="20px"
          boxShadow="md"
          bg="rgba(255, 255, 255, 0.8)"
          backdropFilter="blur(10px)"
          w="100%"
          maxW="800px"
          textAlign="center"
          m="0 auto"
          _hover={{ boxShadow: "xl" }}
        >
          <Link to={`/event/${event.id}`}>
            <Text fontSize="xl" fontWeight="bold">
              {event.title}
            </Text>
            <Image
              src={event.image}
              alt={event.title}
              maxWidth="100%"
              height="auto"
            />
            <Text>{event.description}</Text>
            <Text>
              Start Time: {new Date(event.startTime).toLocaleString()}
            </Text>
            <Text>End Time: {new Date(event.endTime).toLocaleString()}</Text>
            <Text>Categories: {getCategoryNames(event.categoryIds)}</Text>{" "}
          </Link>
        </Box>
      </Flex>
    ))}
  </Flex>
);
};

export default EventsPage;