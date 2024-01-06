import React from "react";
import EventItem from "./EventItem"; // assuming you create this component

const EventList = ({ events }) => {
  return (
    <div>
      {events.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
