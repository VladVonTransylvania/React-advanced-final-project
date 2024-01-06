import React from "react";
import { Link } from "react-router-dom";

const EventItem = ({ event }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      {/* Display other event details */}
      <Link to={`/event/${event.id}`}></Link>
    </div>
  );
};

export default EventItem;
