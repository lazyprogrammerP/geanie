import { Project } from "@prisma/client";
import { z } from "zod";
import { AddProjectRequestValidator } from "../validators/projects.validators";
import { ResponseStatus } from "../constants";

export type AddProjectRequest = z.infer<typeof AddProjectRequestValidator>;

export type AddProjectResponse = {
  status: ResponseStatus;
  message: string;
  data: z.ZodError | null | Project;
};

export type FetchProjectsResponse = {
  status: ResponseStatus;
  message: string;
  data: null | Project[];
};

export type FetchProjectByIdRequestParams = {
  projectId: string;
};

export type FetchProjectByIdResponse = {
  status: ResponseStatus;
  message: string;
  data: null | Project;
};
