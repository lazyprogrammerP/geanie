import { Router } from "express";
import { ProjectsController } from "../controllers/projects.controllers";

const projectsRoutes = Router();
const projectsController = new ProjectsController();

// Create New Project Route
projectsRoutes.post("/", projectsController.addProject);

// Get All Projects Route
projectsRoutes.get("/", projectsController.fetchProjects);

// Get Project By ID Route
projectsRoutes.get("/:projectId", projectsController.fetchProjectById);

export default projectsRoutes;
