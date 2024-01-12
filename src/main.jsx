import { ChakraProvider, Box } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { EventPage } from "./pages/EventPage";
import { EventsPage } from "/src/pages/EventsPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./components/Root";
import { AddEvent } from "./components/AddEvent";
import { DataProvider } from "./contexts/DataContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <EventsPage />,
        // Additional configurations if needed
      },
      {
        path: "/event/:eventId",
        element: <EventPage />,
        // Additional configurations if needed
      },
      {
        path: "/add-event", // New route for AddEvent
        element: <AddEvent />,
        // Additional configurations if needed
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <DataProvider>
        <Box bg="blue.100" minH="100vh" color="black">
          <RouterProvider router={router} />
        </Box>
      </DataProvider>
    </ChakraProvider>
  </React.StrictMode>
);
