"use client";

import Project from "@/interfaces/project.interface";
import service from "@/lib/service";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddProjectForm from "./add-project-form";

export default function ProjectList() {
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  const handleAddedProject = (project: Project) => {
    setProjects((prev) => [...prev, project]);
  };

  useEffect(() => {
    service
      .request({
        method: "GET",
        url: "/projects",
      })
      .then((response) => {
        if (response.data.status === "error") {
          toast.error(response.data.message);
        }

        if (response.data.status === "success") {
          setProjects(response.data.data);
        }
      });

    setLoadingProjects(false);
  }, []);

  return (
    <Fragment>
      <h2>Project List</h2>

      {loadingProjects ? (
        <span>Loading Projects...</span>
      ) : (
        projects.map((project) => (
          <div key={project.id}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <p>{project.createdAt}</p>
            <p>{project.updatedAt}</p>
          </div>
        ))
      )}

      <AddProjectForm onProjectAdded={handleAddedProject} />
    </Fragment>
  );
}
