import { Router } from "express";
import { AgentsController } from "../controllers/agents.controllers";

const agentsRoutes = Router();
const agentsController = new AgentsController();

// Create a New Agent in a Project
agentsRoutes.post("/:projectId", agentsController.addAgentToProject);

// Get All Agents in a Project
agentsRoutes.get("/:projectId", agentsController.fetchAgentsInProject);

// Get Agent by ID
agentsRoutes.get("/:projectId/:agentId", agentsController.fetchAgentById);

// Run Agent by ID
// agentsRoutes.post("/:projectId/:agentId/run", agentsController.runAgentById);

export default agentsRoutes;
