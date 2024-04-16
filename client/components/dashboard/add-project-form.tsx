"use client";

import Project from "@/interfaces/project.interface";
import service from "@/lib/service";
import { FormEvent, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function AddProjectForm({
  onProjectAdded,
}: {
  onProjectAdded: (project: Project) => void;
}) {
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
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Add Project</h2>

      <form onSubmit={handleAddProject} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            className="rounded-md border border-zinc-800 bg-zinc-800/25 p-4 text-sm"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            className="rounded-md border border-zinc-800 bg-zinc-800/25 p-4 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={addingProject}
          className="flex items-center justify-center gap-2 rounded-md bg-zinc-100 px-4 py-2 font-medium text-zinc-900"
        >
          <span>Add Project</span>
          {addingProject ? (
            <ClipLoader size={18} color="rgb(24, 24, 27)" />
          ) : null}
        </button>
      </form>
    </div>
  );
}
