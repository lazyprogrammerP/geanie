import { AgentSourceType, TaskDataType, TaskType } from "@prisma/client";
import { z } from "zod";

export const AddAgentToProjectRequestValidator = z.object({
  name: z.string().min(3).max(255),
  sourceType: z.enum([AgentSourceType.URL, AgentSourceType.PDF, AgentSourceType.DOCX, AgentSourceType.TXT, AgentSourceType.JPEG, AgentSourceType.PNG]),
  tasks: z
    .array(
      z.object({
        key: z.string().min(3).max(255),
        dataType: z.enum([TaskDataType.NUMBER, TaskDataType.TEXT, TaskDataType.BOOLEAN, TaskDataType.LIST]),
        type: z.enum([TaskType.EXTRACT, TaskType.CLASSIFY, TaskType.GENERATE]),
        instruction: z.string().min(32).max(255),
      })
    )
    .min(1)
    .max(12),
});

export const RunAgentByIdRequestValidator = z.object({
  fileURL: z.string().url(),
});
