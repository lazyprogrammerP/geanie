import { Request, Response } from "express";
import path from "path";
import { TEMP_DIR } from "../constants";
import {
  AddAgentToProjectRequest,
  AddAgentToProjectRequestParams,
  AddAgentToProjectResponse,
  GetAgentByIdRequestParams,
  GetAgentByIdResponse,
  GetAgentsInProjectRequestParams,
  GetAgentsInProjectResponse,
  RunAgentByIdRequest,
  RunAgentByIdRequestParams,
  RunAgentByIdResponse,
} from "../interfaces/agents.interfaces";
import { AgentsService } from "../services/agents.services";
import FileLoader from "../tools/load-files";
import { AddAgentToProjectRequestValidator } from "../validators/agents.validators";

export class AgentsController {
  private agentsService: AgentsService;

  constructor() {
    this.agentsService = new AgentsService();
  }

  addAgentToProject = async (req: Request<AddAgentToProjectRequestParams, AddAgentToProjectResponse, AddAgentToProjectRequest, null>, res: Response<AddAgentToProjectResponse>) => {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).send({ status: "error", message: "Unauthorized", data: null });
    }

    const projectId = req.params.projectId;

    const body = req.body;

    const validation = AddAgentToProjectRequestValidator.safeParse(body);
    if (!validation.success) {
      return res.status(400).send({ status: "error", message: "Invalid request body", data: validation.error });
    }

    const agent = await this.agentsService.createAgent(body, projectId, userId);

    return res.status(201).send({ status: "success", message: "Agent created successfully", data: agent });
  };

  fetchAgentsInProject = async (req: Request<GetAgentsInProjectRequestParams, GetAgentsInProjectResponse, null, null>, res: Response<GetAgentsInProjectResponse>) => {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).send({ status: "error", message: "Unauthorized", data: null });
    }

    const projectId = req.params.projectId;

    const agents = await this.agentsService.getAgents(projectId, userId);

    return res.status(200).send({ status: "success", message: "Agents retrieved successfully", data: agents });
  };

  fetchAgentById = async (req: Request<GetAgentByIdRequestParams, GetAgentByIdResponse, null, null>, res: Response<GetAgentByIdResponse>) => {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).send({ status: "error", message: "Unauthorized", data: null });
    }

    const projectId = req.params.projectId;
    const agentId = req.params.agentId;

    const agent = await this.agentsService.getAgentById(agentId, projectId, userId);
    if (!agent) {
      return res.status(404).send({ status: "error", message: "Agent not found", data: null });
    }

    return res.status(200).send({ status: "success", message: "Agent retrieved successfully", data: agent });
  };

  // TODO: Add support for URLs
  runAgentById = async (req: Request<RunAgentByIdRequestParams, RunAgentByIdResponse, RunAgentByIdRequest>, res: Response<RunAgentByIdResponse>) => {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).send({ status: "error", message: "Unauthorized", data: null });
    }

    const projectId = req.params.projectId;
    const agentId = req.params.agentId;

    const file = req.file;
    if (!file) {
      return res.status(400).send({ status: "error", message: "No file uploaded", data: null });
    }

    const filePath = path.join(TEMP_DIR, file.filename);
    const extension = path.extname(file.originalname);

    const fileLoader = new FileLoader();

    let contents = "";
    switch (extension.toLowerCase()) {
      case ".pdf":
        contents = await fileLoader.loadPDF(filePath, file);
        break;
      case ".docx":
        contents = await fileLoader.loadDOCX(filePath);
        break;
      case ".txt":
        contents = fileLoader.loadTXT(filePath);
        break;
      case ".jpeg":
      case ".jpg":
      case ".png":
        contents = await fileLoader.loadImage(filePath, file);
        break;
      default:
        return res.status(400).send({ status: "error", message: "Invalid file type", data: null });
    }

    const executionResults = await this.agentsService.runAgentById(agentId, projectId, userId, contents);
    if (!executionResults) {
      return res.status(404).send({ status: "error", message: "Agent not found", data: null });
    }

    return res.status(200).send({ status: "success", message: "Agent executed successfully", data: executionResults });
  };
}
