"use client";

import Agent from "@/interfaces/agent.interface";
import Project from "@/interfaces/project.interface";
import service from "@/lib/service";
import {
  ClipboardIcon,
  ClockIcon,
  EnvelopeOpenIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import AddAgentForm from "./add-agent-form";

export default function AgentList() {
  const { projectId } = useParams();

  const [showAddAgentDialog, setShowAddAgentDialog] = useState(false);
  const toggleAddAgentDialog = () => setShowAddAgentDialog((prev) => !prev);

  const [loadingProject, setLoadingProject] = useState(true);
  const [project, setProject] = useState<Project | null>(null);

  const handleAddedAgent = (agent: Agent) => {
    setProject((prev) =>
      prev ? { ...prev, agents: [...(prev.agents ?? []), agent] } : null,
    );
    setShowAddAgentDialog(false);
  };

  useEffect(() => {
    if (!projectId) return;

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
  }, [projectId]);

  return (
    <Fragment>
      <div>
        <div className="space-y-4 rounded-md border border-zinc-800 bg-zinc-800/25 p-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-medium">Agents</h2>

            <button
              type="submit"
              onClick={toggleAddAgentDialog}
              className="flex items-center justify-center gap-2 rounded-md bg-zinc-100 px-4 py-2 font-medium text-zinc-900"
            >
              <span>Add Agent</span>
            </button>
          </div>

          {loadingProject ? (
            <div className="flex items-center justify-center gap-4 p-4 text-zinc-300 sm:p-8">
              <ClipLoader size={24} color="rgb(244, 244, 245)" />
            </div>
          ) : project?.agents?.length ? (
            <div className="grid w-full grid-cols-12 gap-4">
              {project?.agents?.map((agent) => (
                <div
                  key={agent.id}
                  className="col-span-12 space-y-4 rounded-md border border-zinc-800 bg-zinc-900 p-4 md:col-span-6 lg:col-span-4"
                >
                  <div className="space-y-2">
                    <h3 className="font-medium">{agent.name}</h3>
                    <p className="text-sm text-zinc-300">{agent.sourceType}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5" />
                    <span className="text-sm text-zinc-300">
                      {new Date(agent.createdAt).toUTCString()}
                    </span>
                  </div>

                  <button
                    onClick={(ev) => {
                      navigator.clipboard.writeText(
                        `POST http://127.0.0.1:8080/agents/${agent.projectId}/${agent.id}/run`,
                      );

                      ev.currentTarget.textContent = "Copied!";

                      let thisButton = ev.currentTarget;
                      setTimeout(() => {
                        thisButton.textContent = "Copy Inference Endpoint";
                      }, 1000);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-zinc-100 px-4 py-2 font-medium text-zinc-900"
                  >
                    <ClipboardIcon className="h-5 w-5" />
                    <span>Copy Inference Endpoint</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4 p-4 text-zinc-300 sm:p-8">
              <EnvelopeOpenIcon className="hidden h-10 w-10 md:block" />
              <div>
                <h2 className="text-lg font-medium">No Agents Yet!</h2>
                <p>Watch us do the magic, create an Agent now!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <dialog
        open={showAddAgentDialog}
        onClick={toggleAddAgentDialog}
        className="fixed -top-4 left-0 h-screen w-full bg-zinc-800/25 backdrop-blur"
      />
      <dialog
        open={showAddAgentDialog}
        className="fixed left-1/2 top-[calc(50%-16px)] flex w-11/12 -translate-x-1/2  -translate-y-1/2 items-center justify-center bg-transparent"
      >
        {showAddAgentDialog ? (
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-scroll rounded-2xl bg-zinc-900 p-8 text-zinc-100">
            <button
              onClick={toggleAddAgentDialog}
              className="absolute right-4 top-4"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>

            <AddAgentForm onAgentAdded={handleAddedAgent} />
          </div>
        ) : null}
      </dialog>
    </Fragment>
  );
}
