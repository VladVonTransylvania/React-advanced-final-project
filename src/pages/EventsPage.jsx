import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { fetchData } from "../util/api";
import { DataContext } from "../contexts/DataContext";
import { Flex } from "@chakra-ui/react"; // Import Flex from Chakra UI
import { SearchBar } from "../components/SearchBar"; // Import SearchBar component


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

  const eventCardStyle = {
    width: "100%", // Full width on smaller screens
    maxWidth: "800px", // Maximum width similar to the form
    margin: "0 auto 20px auto", // Centering the card
    border: "1px solid #ddd",
    padding: "10px",
    boxSizing: "border-box",
  };

  return (
    <div>
      <Flex justifyContent="center" mt="20px" mb="20px">
        <SearchBar onSearch={handleSearch} />
        <select
          onChange={(e) => handleCategoryChange(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </Flex>
      {filteredEvents.map((event) => (
        <div style={{ ...eventCardStyle }} key={event.id}>
          <Link to={`/event/${event.id}`}>
            <h2>{event.title}</h2>
            <img
              src={event.image}
              alt={event.title}
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <p>{event.description}</p>
            <p>Start Time: {new Date(event.startTime).toLocaleString()}</p>
            <p>End Time: {new Date(event.endTime).toLocaleString()}</p>
            <p>Categories: {getCategoryNames(event.categoryIds)}</p>
          </Link>
        </div>
      ))}
      <Flex justifyContent="center">
        <Link
          to="/add-event"
          style={{ ...eventCardStyle, background: "blue", color: "white" }}
        >
          Add Event
        </Link>
      </Flex>
    </div>
  );
};

export default EventsPage;