import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { fetchData } from "../util/api";
import { DataContext } from "../contexts/DataContext";
import { Flex, Box, Button, Text, Image } from "@chakra-ui/react";
import { SearchBar } from "../components/SearchBar";
import { CategoryFilter } from "../components/CategoryFilter";

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
      {/* Search Bar */}
      <Flex w="100%" maxW="800px" mb="10px" justifyContent="center">
        <SearchBar onSearch={handleSearch} w="60%" />
      </Flex>

      {/* Category Filter */}
      <Flex w="100%" maxW="800px" mb="10px" justifyContent="center">
        <CategoryFilter
          categories={categories}
          onFilter={handleCategoryChange}
        />
      </Flex>

      {/* Button to create new event */}
      <Flex justifyContent="center" mb="20">
        <Link to="/add-event">
          <Button
            colorScheme="blue"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "0px 0px 15px 5px rgba(0, 126, 255, 0.2)",
              transition: "all 0.2s ease-in-out",
            }}
          >
            Create Event
          </Button>
        </Link>
      </Flex>

      {/* Display of filtered events */}
      {filteredEvents.map((event) => (
        <Flex direction="column" mb="30px" key={event.id} w="100%">
          <Box
            key={event.id}
            borderRadius="lg"
            boxShadow="md"
            bg="rgba(240, 248, 255, 1.5)"
            w="100%"
            maxW="700px"
            textAlign="center"
            m="0 auto"
            p="2px"
            _hover={{
              boxShadow:
                "0 -4px 8px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Link to={`/event/${event.id}`}>
              <Text fontSize="xl" fontWeight="bold" mb="10px">
                {event.title}
              </Text>
              <Flex justifyContent="center"></Flex>
              <Image
                src={event.image}
                alt={event.title}
                borderRadius="md"
                maxWidth="100%"
                height="auto"
                mb="10px"
              />
              
              <Text>{event.description}</Text>
              <Text>
                Start Time: {new Date(event.startTime).toLocaleString()}
              </Text>
              <Text>End Time: {new Date(event.endTime).toLocaleString()}</Text>
              <Text>
                Categories: {getCategoryNames(event.categoryIds)}
              </Text>{" "}
            </Link>
          </Box>
        </Flex>
      ))}
    </Flex>
  );
};

export default EventsPage;
