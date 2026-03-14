export const toWIB = (dateInput: Date | string | number): Date => {
  return new Date(dateInput);
};

export const formatTaskDates = <T extends { createdAt: Date | string; updatedAt: Date | string }>(task: T) => {
  return task; // Remove the timezone shifting here since raw shifting breaks string ISO representation in the DB return. We will format it properly on the frontend using local TimeZone offset.
};
