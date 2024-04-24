import { Router } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { TEMP_DIR } from "../constants";
import { WorkflowsController } from "../controllers/workflows.controllers";

const workflowsRoutes = Router();
const workflowsController = new WorkflowsController();

const storage = multer.diskStorage({
  destination: TEMP_DIR,
  filename: (req, file, cb) => {
    const uuid = uuidv4();
    const extension = path.extname(file.originalname);

    cb(null, `${uuid}${extension}`);
  },
});

const upload = multer({ storage });

// Create a New Workflow in a Project
workflowsRoutes.post("/:projectId", workflowsController.addWorkflowToProject);

// Run a Workflow in a Project
workflowsRoutes.post("/:projectId/:workflowId/run", upload.any(), workflowsController.runWorkflowById);

export default workflowsRoutes;
