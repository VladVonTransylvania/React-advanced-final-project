import { Flex, Text, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  return (
    <Flex
      as="footer"
      direction="row"
      justify="space-around"
      align="center"
      w="100%"
      bg="rgba(240, 248, 255, 0.9)" // Adjust the background color as needed
      p={6} // Padding for spacing
      style={{
        boxShadow:
          "inset 0px 0px 15px 5px rgba(173, 216, 230, 0.9), inset 0px 0px 20px 10px rgba(135, 206, 250, 0.9)",
      }}
    >
      {/* Footer content here */}
      <Text>© {new Date().getFullYear()} Event Makers</Text>
      <Link as={RouterLink} to="/" color="blue.500">
        Contact Us
      </Link>
      {/* Add more links or content as needed */}
    </Flex>
  );
};

export default Footer;
