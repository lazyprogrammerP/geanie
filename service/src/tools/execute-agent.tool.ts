import { Task } from "@prisma/client";
import openAIClient from "../lib/openai-client";

const SYSTEM_PROMPT = `As a SuperAgent AI, your task involves performing specific actions—EXTRACT, CLASSIFY, or GENERATE—based on the contents of provided documents.

You will receive a list of tasks structured as follows, along with the document's contents:
[
    {
        "key": "...",
        "dataType": "NUMBER | TEXT | BOOLEAN | LIST",
        "taskType": "EXTRACT | CLASSIFY | GENERATE",
        "instruction": "..."
    }
]

Your responsibility is to produce a JSON output according to the following format:
{
    "[key]": "value based on the key's data type"
}

Please adhere strictly to the specified data types. It is essential to thoroughly read the document contents before generating the JSON output.`;

export default async function executeAgent(tasks: Task[], ctx: string): Promise<string | null> {
  const executionResults = await openAIClient.chat.completions.create({
    model: "gpt-4-0125-preview",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `Task List:
${JSON.stringify(
  tasks.map((task) => ({
    key: task.key,
    dataType: task.dataType,
    type: task.type,
    instruction: task.instruction,
  }))
)}

Document Contents:
${ctx}`,
      },
    ],
    temperature: 0.2,
    max_tokens: 2048,
    response_format: { type: "json_object" },
  });

  return executionResults.choices[0].message.content;
}
