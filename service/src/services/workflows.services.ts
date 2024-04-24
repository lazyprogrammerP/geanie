import { Workflow } from "@prisma/client";
import { AddWorkflowToProjectRequest } from "../interfaces/workflows.interfaces";
import prisma from "../prisma";

export class WorkflowsService {
  createWorkflow = async (data: AddWorkflowToProjectRequest, projectId: string, userId: string): Promise<Workflow> => {
    return prisma.workflow.create({
      data: {
        name: data.name,
        description: data.description,
        project: {
          connect: {
            id: projectId,
            users: {
              some: { id: userId },
            },
          },
        },
        workflowItems: data.workflowItems,
      },
    });
  };

  getWorkflowById = async (workflowId: string, projectId: string, userId: string): Promise<null | Workflow> => {
    return prisma.workflow.findUnique({
      where: {
        id: workflowId,
        project: {
          id: projectId,
          users: {
            some: { id: userId },
          },
        },
      },
    });
  };

  runWorkflowById = async (workflowId: string, projectId: string, userId: string) => {};
}
