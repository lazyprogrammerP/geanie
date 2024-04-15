import { Request, Response } from "express";
import {
  AddAgentToProjectRequest,
  AddAgentToProjectRequestParams,
  AddAgentToProjectResponse,
  GetAgentByIdRequestParams,
  GetAgentByIdResponse,
  GetAgentsInProjectRequestParams,
  GetAgentsInProjectResponse,
} from "../interfaces/agents.interfaces";
import { AgentsService } from "../services/agents.services";
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

  //   runAgentById = async (req: Request<RunAgentByIdRequestParams, RunAgentByIdResponse, RunAgentByIdRequest, null>, res: Response<RunAgentByIdResponse>) => {
  //     const userId = req.userId;
  //     if (!userId) {
  //       return res.status(401).send({ status: "error", message: "Unauthorized", data: null });
  //     }

  //     const projectId = req.params.projectId;
  //     const agentId = req.params.agentId;

  //     const body = req.body;

  //     const validation = RunAgentByIdRequestValidator.safeParse(body);
  //     if (!validation.success) {
  //       return res.status(400).send({ status: "error", message: "Invalid request body", data: validation.error });
  //     }

  //     const output = await this.agentsService.runAgentById(agentId, projectId, userId, body.fileURL);

  //     return res.status(200).send({ status: "success", message: "Agent executed successfully", data: output });
  //   };
}
