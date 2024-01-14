import React from "react";
import { Link as ReactRouterLink, useLocation } from "react-router-dom";
import { Flex, Button } from "@chakra-ui/react";


export const Navigation = () => {
  // useLocation hook to access the current URL location
  const location = useLocation();

  // useLocation hook to access the current URL location
  const isEventPage = location.pathname.startsWith("/event/");

  return (
    <Flex
      as="nav"
      justifyContent="space-around"
      bg="rgba(240, 248, 255, 0.9)"
      align="stretch"
      boxShadow="inset 0px 0px 15px 5px rgba(173, 216, 230, 0.9), inset 0px 0px 20px 10px rgba(135, 206, 250, 0.9)"
    >
      {/* Link to the main events page */}
      <Button
        as={ReactRouterLink}
        to="/"
        color="black"
        variant="ghost"
        h="100%"
        pt="30px"
        pb="30px"
        px={20}
        fontSize="2xl"
        bg="rgba(240, 248, 255, 0.0)"
        boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.9), 0px 0px 20px 10px rgba(135, 206, 250, 0.9)"
        _hover={{
          bg: "rgba(240, 248, 255, 0.9)",
          boxShadow:
            "inset 0px 0px 15px 5px rgba(173, 216, 230, 0.9), inset 0px 0px 20px 10px rgba(135, 206, 250, 0.9)",
        }}
        w="49%"
        mt="20px" // Margin top
        mb="20px" // Margin bottom
        mr="5px" // Margin right
        ml="5px" // Margin left
      >
        Events
      </Button>

      {/* Conditionally render the link to the specific event if on an event page */}
      {isEventPage && (
        <Button
          as={ReactRouterLink}
          to={location.pathname}
          color="black"
          variant="ghost"
          h="100%"
          pt="30px"
          pb="30px"
          px={20}
          fontSize="2xl"
          bg="rgba(240, 248, 255, 0.0)"
          boxShadow="0px 0px 15px 5px rgba(173, 216, 230, 0.9), 0px 0px 20px 10px rgba(135, 206, 250, 0.9)"
          _hover={{
            bg: "rgba(240, 248, 255, 0.9)",
            boxShadow:
              "inset 0px 0px 15px 5px rgba(173, 216, 230, 0.9), inset 0px 0px 20px 10px rgba(135, 206, 250, 0.9)",
          }}
          w="49%"
          mt="20px" // Margin top
          mb="20px" // Margin bottom
          mr="5px" // Margin right
          ml="5px" // Margin left
        >
          Event
        </Button>
      )}
    </Flex>
  );
};
