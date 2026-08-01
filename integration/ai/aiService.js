import llmClient from "./llmClient.js";
import systemPrompt from "./prompts/systemPrompt.js";
import { toolDefinitions } from "./tools/index.js";
import { executeTool } from "./toolExecutor.js";

export const generateReply = async ({ message, history = [] }) => {
  try {
    const sanitizedHistory = history
      .filter(
        (item) =>
          item &&
          ["user", "assistant"].includes(item.role) &&
          typeof item.content === "string",
      )
      .slice(-10);
    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...sanitizedHistory,
      {
        role: "user",
        content: message,
      },
    ];

    // Store structured results from tools
    const toolResults = {};

    while (true) {
      const response = await llmClient.chat.completions.create({
        model: process.env.LLM_MODEL,
        messages,
        tools: toolDefinitions,
        tool_choice: "auto",
      });

      const assistantMessage = response.choices[0].message;

      // No tool requested -> final response
      if (!assistantMessage.tool_calls) {
        return {
          success: true,
          reply: assistantMessage.content,
          toolResults,
        };
      }

      // Add assistant tool-call message
      messages.push(assistantMessage);

      // Execute every tool requested
      for (const toolCall of assistantMessage.tool_calls) {
        const toolName = toolCall.function.name;

        let toolArgs = {};

        try {
          toolArgs = JSON.parse(toolCall.function.arguments);
        } catch (error) {
          throw new Error(`Invalid arguments received for tool "${toolName}".`);
        }

        const toolResult = await executeTool(toolName, toolArgs);

        // Store structured response for frontend
        if (toolResult?.type) {
          toolResults[toolResult.type] = toolResult;
        }

        // Give tool result back to GPT
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        });
      }
    }
  } catch (error) {
    console.error("AI Service Error:", error);

    return {
      success: false,
      error: "Unable to generate AI response.",
    };
  }
};
