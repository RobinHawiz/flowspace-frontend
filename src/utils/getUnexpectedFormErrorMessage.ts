function getUnexpectedFormErrorMessage(err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
    if (err.name === "TypeError") {
      return "Connection failed. Please check your internet connection and try again.";
    } else {
      return "An unexpected error occurred. Please try again.";
    }
  } else {
    console.error(err);
    return "An unexpected error occurred. Please try again.";
  }
}

export default getUnexpectedFormErrorMessage;
