interface Agent {
  id: string;
  name: string;
  sourceType: "URL" | "PDF" | "DOCX" | "TXT" | "JPEG" | "PNG";
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export default Agent;
