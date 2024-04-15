import { Agent, Task } from "@prisma/client";
import { z } from "zod";
import { ResponseStatus } from "../constants";
import { AddAgentToProjectRequestValidator, RunAgentByIdRequestValidator } from "../validators/agents.validators";

export type AddAgentToProjectRequest = z.infer<typeof AddAgentToProjectRequestValidator>;

export type AddAgentToProjectRequestParams = {
  projectId: string;
};

export type AddAgentToProjectResponse = {
  status: ResponseStatus;
  message: string;
  data: z.ZodError | null | Agent;
};

export type GetAgentsInProjectRequestParams = {
  projectId: string;
};

export type GetAgentsInProjectResponse = {
  status: ResponseStatus;
  message: string;
  data: null | Agent[];
};

export type GetAgentByIdRequestParams = {
  projectId: string;
  agentId: string;
};

export type AgentWithTasks = Agent & {
  tasks: Task[];
};

export type GetAgentByIdResponse = {
  status: ResponseStatus;
  message: string;
  data: null | AgentWithTasks;
};

export type RunAgentByIdRequestParams = {
  projectId: string;
  agentId: string;
};

export type RunAgentByIdRequest = z.infer<typeof RunAgentByIdRequestValidator>;

export type RunAgentByIdResponse = {
  status: ResponseStatus;
  message: string;
  data: z.ZodError | null | Record<string, any>;
};
