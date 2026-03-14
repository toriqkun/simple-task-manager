export const toWIB = (dateInput: Date | string | number): Date => {
  const date = new Date(dateInput);
  return new Date(date.getTime() + 7 * 60 * 60 * 1000);
};

export const formatTaskDates = <T extends { createdAt: Date; updatedAt: Date }>(task: T) => {
  return {
    ...task,
    createdAt: toWIB(task.createdAt),
    updatedAt: toWIB(task.updatedAt),
  };
};
