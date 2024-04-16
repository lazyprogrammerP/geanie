import Agent from "./agent.interface";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  agents?: Agent[];
}

export default Project;
