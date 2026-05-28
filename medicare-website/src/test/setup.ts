import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

//In Vitest, afterEach is a lifecycle hook that executes a specific function
// after every single test in the current file or describe block.

afterEach(() => {
  cleanup();
});
