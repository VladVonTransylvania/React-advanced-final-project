/**
 * Sends a GET request to the specified endpoint.
 * @param {string} endpoint - The API endpoint to send the GET request to.
 */
export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`http://localhost:3000/${endpoint}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

/**
 * Sends a DELETE request to the specified endpoint.
 * @param {string} endpoint - The API endpoint to send the DELETE request to.
 */
export const deleteData = async (endpoint) => {
  try {
    const response = await fetch(`http://localhost:3000/${endpoint}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error("Delete error:", error);
    return null;
  }
};

/**
 * Sends a POST request to the specified endpoint.
 * @param {string} endpoint - The API endpoint to send the POST request to.
 * @param {Object} data - The data to be sent in the POST request.
 */
export const postData = async (endpoint, data) => {
  try {
    const response = await fetch(`http://localhost:3000/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  } catch (error) {
    console.error("Post error:", error);
    return null;
  }
};

/**
 * Sends a PUT request to the specified endpoint.
 * @param {string} endpoint - The API endpoint to send the PUT request to.
 * @param {Object} data - The data to be sent in the PUT request.
 */
export const updateData = async (endpoint, data) => {
  try {
   

    const response = await fetch(`http://localhost:3000/${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Check if the response status is not ok
    if (!response.ok) {
    
      // Throw an error with response status and statusText
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error("Update error:", error);
    return null;
  }
};
