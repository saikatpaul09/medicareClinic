export const shortNameHelper = (firstName: string, lastName: string) => {
  return `${firstName} ${lastName}`
    ?.split(" ")
    .map((name: string) => name[0])
    .join("");
};

export const generatePassword = (length = 12, options = {}) => {
  // 1. Define the default configuration
  const config = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    ...options,
  };

  // 2. Map pool categories to character sets
  const charSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$",
  };

  let allowedChars = "";
  let password = "";
  const guaranteedCharacters = [];

  // 3. Build the character pool and guarantee character variety
  Object.keys(charSets).forEach((key) => {
    if (config[key]) {
      const currentPool = charSets[key];
      allowedChars += currentPool;

      // Gather one character from each active type to guarantee it's included
      const randomIndex = Math.floor(Math.random() * currentPool.length);
      guaranteedCharacters.push(currentPool[randomIndex]);
    }
  });

  // 4. Return an error string or empty if no characters are selected
  if (allowedChars.length === 0) {
    return "Error: Select at least one character type.";
  }

  // 5. Generate the remaining characters using standard random selection
  const remainingLength = length - guaranteedCharacters.length;
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = Math.floor(Math.random() * allowedChars.length);
    password += allowedChars.charAt(randomIndex);
  }

  // 6. Inject the guaranteed pool characters into the string
  guaranteedCharacters.forEach((char) => {
    // Insert at a randomized index inside the string to prevent predictable patterns
    const insertIndex = Math.floor(Math.random() * (password.length + 1));
    password =
      password.slice(0, insertIndex) + char + password.slice(insertIndex);
  });

  return password;
};
