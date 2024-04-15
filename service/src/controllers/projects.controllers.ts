import { Request, Response } from "express";
import { AddProjectRequest, AddProjectResponse, FetchProjectByIdRequestParams, FetchProjectByIdResponse, FetchProjectsResponse } from "../interfaces/projects.interfaces";
import { ProjectsService } from "../services/projects.service";
import { AddProjectRequestValidator } from "../validators/projects.validators";

export class ProjectsController {
  private projectsService: ProjectsService;

  constructor() {
    this.projectsService = new ProjectsService();
  }

  addProject = async (req: Request<null, AddProjectResponse, AddProjectRequest, null>, res: Response<AddProjectResponse>) => {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).send({ status: "error", message: "Unauthorized", data: null });
    }

    const body = req.body;

    const validation = AddProjectRequestValidator.safeParse(body);
    if (!validation.success) {
      return res.status(400).send({ status: "error", message: "Invalid request body", data: validation.error });
    }

    const project = await this.projectsService.createProject(body, userId);

    return res.status(201).send({ status: "success", message: "Project created", data: project });
  };

  fetchProjects = async (req: Request<null, FetchProjectsResponse, null, null>, res: Response<FetchProjectsResponse>) => {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).send({ status: "error", message: "Unauthorized", data: null });
    }

    const projects = await this.projectsService.getProjects(userId);

    return res.status(200).send({ status: "success", message: "Projects fetched", data: projects });
  };

  fetchProjectById = async (req: Request<FetchProjectByIdRequestParams, FetchProjectByIdResponse, null, null>, res: Response<FetchProjectByIdResponse>) => {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).send({ status: "error", message: "Unauthorized", data: null });
    }

    const projectId = req.params.projectId;
    if (!projectId) {
      return res.status(400).send({ status: "error", message: "Invalid request", data: null });
    }

    const project = await this.projectsService.getProjectById(userId, projectId);
    if (!project) {
      return res.status(404).send({ status: "error", message: "Project not found", data: null });
    }

    return res.status(200).send({ status: "success", message: "Project fetched", data: project });
  };
}
