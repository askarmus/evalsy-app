// errorHandler.ts
export const handleError = (error: any) => {
  if (error.response) {
    // Server responded with a status outside the 2xx range
    return {
      status: error.response.status,
      message: error.response.data?.message || "Something went wrong",
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      status: 0,
      message: "Network error. Please try again..",
    };
  } else {
    // Something happened during request setup
    return {
      status: 0,
      message: error.message || "An unexpected error occurred.",
    };
  }
};
