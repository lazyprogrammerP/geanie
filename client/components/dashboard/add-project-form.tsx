"use client";

import Project from "@/interfaces/project.interface";
import service from "@/lib/service";
import { FormEvent, Fragment, useState } from "react";
import { toast } from "react-toastify";

export default function AddProjectForm({ onProjectAdded }: { onProjectAdded: (project: Project) => void }) {
  const [addingProject, setAddingProject] = useState(false);

  const handleAddProject = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    setAddingProject(true);

    const formData = new FormData(ev.currentTarget);

    const name = formData.get("name");
    const description = formData.get("description");

    const addProjectResponse = await service.request({
      method: "POST",
      url: "/projects",
      data: {
        name,
        description,
      },
    });

    if (addProjectResponse.data.status === "error") {
      toast.error(addProjectResponse.data.message);
    }

    if (addProjectResponse.data.status === "success") {
      toast.success("Project Created!");
    }

    onProjectAdded(addProjectResponse.data.data);
    setAddingProject(false);
  };

  return (
    <Fragment>
      <h2>Add Project</h2>

      <form onSubmit={handleAddProject}>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={5} />
        </div>

        <button type="submit">{addingProject ? "Adding Project..." : "Add Project"}</button>
      </form>
    </Fragment>
  );
}
