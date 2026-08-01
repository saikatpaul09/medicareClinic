import { toolExecutors } from "./tools/index.js";

export const executeTool = async (toolName, args) => {
  const executor = toolExecutors[toolName];

  if (!executor) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  return await executor(args);
};
