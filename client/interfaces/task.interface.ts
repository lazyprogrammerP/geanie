export interface TaskWithoutId {
  key: string;
  dataType: "NUMBER" | "TEXT" | "BOOLEAN" | "LIST";
  type: "EXTRACT" | "CLASSIFY" | "GENERATE";
  instruction: string;
}

interface Task {
  id: string;
  key: string;
  dataType: "NUMBER" | "TEXT" | "BOOLEAN" | "LIST";
  type: "EXTRACT" | "CLASSIFY" | "GENERATE";
  instruction: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

export default Task;
