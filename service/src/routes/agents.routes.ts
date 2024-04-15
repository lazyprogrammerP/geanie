import { Router } from "express";
import multer from "multer";
import path from "path";
import { TEMP_DIR } from "../constants";
import { AgentsController } from "../controllers/agents.controllers";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: TEMP_DIR,
  filename: (req, file, cb) => {
    const uuid = uuidv4();
    const extension = path.extname(file.originalname);

    cb(null, `${uuid}${extension}`);
  },
});

const upload = multer({ storage });

const agentsRoutes = Router();
const agentsController = new AgentsController();

// Create a New Agent in a Project
agentsRoutes.post("/:projectId", agentsController.addAgentToProject);

// Get All Agents in a Project
agentsRoutes.get("/:projectId", agentsController.fetchAgentsInProject);

// Get Agent by ID
agentsRoutes.get("/:projectId/:agentId", agentsController.fetchAgentById);

// Run Agent by ID
agentsRoutes.post("/:projectId/:agentId/run", upload.single("file"), agentsController.runAgentById);

export default agentsRoutes;
