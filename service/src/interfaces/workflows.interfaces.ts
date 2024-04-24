import { Workflow } from "@prisma/client";
import { z } from "zod";
import { ResponseStatus } from "../constants";
import { AddWorkflowToProjectRequestValidator } from "../validators/workflows.validators";

export type AddWorkflowToProjectRequest = z.infer<typeof AddWorkflowToProjectRequestValidator>;

export type AddWorkflowToProjectRequestParams = {
  projectId: string;
};

export type AddWorkflowToProjectResponse = {
  status: ResponseStatus;
  message: string;
  data: null | z.ZodError | Workflow;
};

export type RunWorkflowByIdRequestParams = {
  projectId: string;
  workflowId: string;
};
