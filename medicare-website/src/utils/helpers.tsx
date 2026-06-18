export const shortNameHelper = (firstName: string, lastName: string) => {
  return `${firstName} ${lastName}`
    ?.split(" ")
    .map((name: string) => name[0])
    .join("");
};
