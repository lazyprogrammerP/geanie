import { Project } from "@prisma/client";
import { AddProjectRequest } from "../interfaces/projects.interfaces";
import prisma from "../prisma";

export class ProjectsService {
  createProject = async (data: AddProjectRequest, userId: string): Promise<Project> => {
    return await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
  };

  getProjects = async (userId: string): Promise<Project[]> => {
    return await prisma.project.findMany({
      where: {
        users: {
          some: { id: userId },
        },
      },
    });
  };

  getProjectById = async (userId: string, projectId: string): Promise<Project | null> => {
    return await prisma.project.findFirst({
      where: {
        id: projectId,
        users: {
          some: { id: userId },
        },
      },
      include: {
        agents: true,
      },
    });
  };
}
