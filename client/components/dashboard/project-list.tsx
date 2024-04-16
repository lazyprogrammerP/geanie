"use client";

import Project from "@/interfaces/project.interface";
import service from "@/lib/service";
import {
  ClockIcon,
  EnvelopeOpenIcon,
  LinkIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import AddProjectForm from "./add-project-form";

export default function ProjectList() {
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
  const toggleAddProjectDialog = () => setShowAddProjectDialog((prev) => !prev);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  const handleAddedProject = (project: Project) => {
    setProjects((prev) => [...prev, project]);
    setShowAddProjectDialog(false);
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
      <div className="space-y-4 rounded-md border border-zinc-800 bg-zinc-800/25 p-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium">Projects</h2>

          <button
            type="submit"
            onClick={toggleAddProjectDialog}
            className="flex items-center justify-center gap-2 rounded-md bg-zinc-100 px-4 py-2 font-medium text-zinc-900"
          >
            <span>Add Project</span>
          </button>
        </div>

        {loadingProjects ? (
          <div className="flex items-center justify-center gap-4 p-4 text-zinc-300 sm:p-8">
            <ClipLoader size={24} color="rgb(244, 244, 245)" />
          </div>
        ) : projects.length ? (
          <div className="grid w-full grid-cols-12">
            {projects.map((project) => (
              <div
                key={project.id}
                className="col-span-12 space-y-4 rounded-md border border-zinc-800 bg-zinc-900 p-4 md:col-span-6 lg:col-span-4"
              >
                <div className="space-y-2">
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-zinc-300">{project.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  <span className="text-sm text-zinc-300">
                    {new Date(project.createdAt).toUTCString()}
                  </span>
                </div>

                <button className="flex items-center justify-center gap-2 rounded-md bg-zinc-100 px-4 py-2 font-medium text-zinc-900">
                  <LinkIcon className="h-5 w-5" />
                  <span>View Project</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4 p-4 text-zinc-300 sm:p-8">
            <EnvelopeOpenIcon className="hidden h-10 w-10 md:block" />
            <div>
              <h2 className="text-lg font-medium">No Projects Yet!</h2>
              <p>Start using Geanie by creating a Project.</p>
            </div>
          </div>
        )}
      </div>

      <dialog
        open={showAddProjectDialog}
        onClick={toggleAddProjectDialog}
        className="fixed left-0 top-0 h-screen w-full bg-zinc-800/25 backdrop-blur"
      />
      <dialog
        open={showAddProjectDialog}
        className="relative w-11/12 max-w-lg rounded-2xl bg-zinc-900 p-8 text-zinc-100"
      >
        <button
          onClick={toggleAddProjectDialog}
          className="absolute right-4 top-4"
        >
          <XCircleIcon className="h-5 w-5" />
        </button>
        <AddProjectForm onProjectAdded={handleAddedProject} />
      </dialog>
    </Fragment>
  );
}
