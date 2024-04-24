import { z } from "zod";

export enum WorkflowItemType {
  AGENT = "AGENT",
  VALIDATOR = "VALIDATOR",
  OMITTER = "OMITTER",
}

const BaseWorkflowItemSchema = z.object({
  type: z.enum([WorkflowItemType.AGENT, WorkflowItemType.VALIDATOR, WorkflowItemType.OMITTER]),
  file: z.string().min(3).max(255).optional(),

  agentId: z.string().optional(), // Required if type is AGENT

  validateQ: z.string().optional(), // Required if type is VALIDATOR

  omitJ: z.string().optional(), // Required if type is OMITTER
});

export type TWorkflowItemSchema = z.infer<typeof BaseWorkflowItemSchema> & {
  next?: z.infer<typeof BaseWorkflowItemSchema>;
  exit?: z.infer<typeof BaseWorkflowItemSchema>;
};

let WorkflowItemSchema: z.ZodType<TWorkflowItemSchema> = BaseWorkflowItemSchema.extend({});
WorkflowItemSchema = BaseWorkflowItemSchema.extend({
  next: WorkflowItemSchema.optional(),
  exit: WorkflowItemSchema.optional(),
});

export const AddWorkflowToProjectRequestValidator = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(32).max(255),
  workflowItems: WorkflowItemSchema,
});
