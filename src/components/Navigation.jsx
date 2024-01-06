import React from "react";
import { Link as ReactRouterLink, useLocation } from "react-router-dom";
import { Flex, Link } from "@chakra-ui/react";

export const Navigation = () => {
  const location = useLocation();
  const isEventPage = location.pathname.startsWith("/event/");

  return (
    <Flex
      as="nav"
      bg="blue.500"
      color="white"
      p={3}
      justifyContent="space-around"
    >
      {/* Link to the main events page */}
      <Link as={ReactRouterLink} to="/">
        Events
      </Link>

      {/* Conditionally render the link to the specific event if on an event page */}
      {isEventPage && (
        <Link as={ReactRouterLink} to={location.pathname}>
         Event
        </Link>
      )}
    </Flex>
  );
};
