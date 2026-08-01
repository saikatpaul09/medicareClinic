import * as searchDoctors from "./searchDoctors.js";

export const toolDefinitions = [searchDoctors.definition];

export const toolExecutors = {
  searchDoctors: searchDoctors.execute,
};
