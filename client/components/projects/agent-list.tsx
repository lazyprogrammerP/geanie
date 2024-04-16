"use client";

import Agent from "@/interfaces/agent.interface";
import Project from "@/interfaces/project.interface";
import service from "@/lib/service";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddAgentForm from "./add-agent-form";

export default function AgentList() {
  const { projectId } = useParams();

  const [loadingProject, setLoadingProject] = useState(true);
  const [project, setProject] = useState<Project | null>(null);

  const handleAddedAgent = (agent: Agent) => {
    setProject((prev) => (prev ? { ...prev, agents: [...(prev.agents ?? []), agent] } : null));
  };

  useEffect(() => {
    service
      .request({
        method: "GET",
        url: `/projects/${projectId}`,
      })
      .then((response) => {
        if (response.data.status === "error") {
          toast.error(response.data.message);
        }

        if (response.data.status === "success") {
          setProject(response.data.data);
        }

        setLoadingProject(false);
      });
  }, []);

  return (
    <Fragment>
      <h2>Agent List</h2>

      {loadingProject ? (
        <span>Loading Project...</span>
      ) : (
        <Fragment>
          <div>
            <h3>{project?.name}</h3>
            <p>{project?.description}</p>
            <p>{project?.createdAt}</p>
            <p>{project?.updatedAt}</p>
          </div>

          {project?.agents?.map((agent) => (
            <div key={agent.id}>
              <h3>{agent.name}</h3>
              <p>{agent.sourceType}</p>
              <p>{agent.createdAt}</p>
              <p>{agent.updatedAt}</p>
            </div>
          ))}
        </Fragment>
      )}

      <AddAgentForm onAgentAdded={handleAddedAgent} />
    </Fragment>
  );
}
