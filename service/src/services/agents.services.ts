import { Agent } from "@prisma/client";
import { AddAgentToProjectRequest, AgentWithTasks } from "../interfaces/agents.interfaces";
import prisma from "../prisma";

export class AgentsService {
  createAgent = async (data: AddAgentToProjectRequest, projectId: string, userId: string): Promise<Agent> => {
    return await prisma.agent.create({
      data: {
        name: data.name,
        sourceType: data.sourceType,
        project: {
          connect: {
            id: projectId,
            users: {
              some: { id: userId },
            },
          },
        },
        tasks: {
          create: data.tasks,
        },
      },
    });
  };

  getAgents = async (projectId: string, userId: string): Promise<Agent[]> => {
    return await prisma.agent.findMany({
      where: {
        projectId,
        project: {
          users: {
            some: { id: userId },
          },
        },
      },
    });
  };

  getAgentById = async (agentId: string, projectId: string, userId: string): Promise<null | AgentWithTasks> => {
    return await prisma.agent.findUnique({
      where: {
        id: agentId,
        project: {
          id: projectId,
          users: {
            some: { id: userId },
          },
        },
      },
      include: {
        tasks: true,
      },
    });
  };

  //   runAgentById = async (agentId: string, projectId: string, userId: string, fileURL: string): Promise<null | Agent> => {
  //     const agent = await this.getAgentById(agentId, projectId, userId);

  //     if (!agent) {
  //       return null;
  //     }

  //     const tasks = agent.tasks;

  //     return results;
  //   };
}
