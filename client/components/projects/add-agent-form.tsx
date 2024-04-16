"use client";

import Agent from "@/interfaces/agent.interface";
import { TaskWithoutId } from "@/interfaces/task.interface";
import service from "@/lib/service";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function AddAgentForm({
  onAgentAdded,
}: {
  onAgentAdded: (agent: Agent) => void;
}) {
  const { projectId } = useParams();

  const [addingAgent, setAddingAgent] = useState(false);

  const [agentTasks, setAgentTasks] = useState<TaskWithoutId[]>([]);

  const handleAddTask = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const formData = new FormData(ev.currentTarget);

    const key = formData.get("key")?.toString();
    const dataType = formData.get("dataType")?.toString() as
      | "NUMBER"
      | "TEXT"
      | "BOOLEAN"
      | "LIST";
    const type = formData.get("type")?.toString() as
      | "EXTRACT"
      | "CLASSIFY"
      | "GENERATE";
    const instruction = formData.get("instruction")?.toString();

    if (!key || !dataType || !type || !instruction) {
      toast.error("Fill In All Fields!");
      return;
    }

    ev.currentTarget.reset();
    setAgentTasks((prev) => [
      ...prev,
      { key: key?.toString(), dataType, type, instruction },
    ]);
  };

  const handleAddAgent = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    ev.stopPropagation();

    setAddingAgent(true);

    const formData = new FormData(ev.currentTarget);

    const name = formData.get("name");
    const sourceType = formData.get("sourceType");

    const addAgentResponse = await service.request({
      method: "POST",
      url: `/agents/${projectId}`,
      data: {
        name,
        sourceType,
        tasks: agentTasks,
      },
    });

    if (addAgentResponse.data.status === "error") {
      toast.error(addAgentResponse.data.message);
    }

    if (addAgentResponse.data.status === "success") {
      toast.success("Agent Created!");
    }

    onAgentAdded(addAgentResponse.data.data);
    setAddingAgent(false);
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium">Add Agent</h2>

      <form onSubmit={handleAddAgent} className="space-y-4">
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
          <label htmlFor="sourceType" className="text-sm font-medium">
            Source Type
          </label>
          <select
            id="sourceType"
            name="sourceType"
            className="rounded-md border border-zinc-800 bg-zinc-800/25 p-4 text-sm"
          >
            <option value="URL">URL</option>
            <option value="PDF">PDF</option>
            <option value="DOCX">DOCX</option>
            <option value="TXT">TXT</option>
            <option value="JPEG">JPEG</option>
            <option value="PNG">PNG</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={addingAgent}
          className="flex items-center justify-center gap-2 rounded-md bg-zinc-100 px-4 py-2 font-medium text-zinc-900"
        >
          <span>Add Agent</span>
          {addingAgent ? (
            <ClipLoader size={18} color="rgb(24, 24, 27)" />
          ) : null}
        </button>
      </form>

      {agentTasks.length ? (
        <div className="pt-4">
          <h3 className="font-medium">Tasks</h3>

          <div className="overflow-x-auto">
            <div className="min-w-full">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap p-4 text-left text-sm font-medium text-zinc-100">
                      Sl. No.
                    </th>
                    <th className="whitespace-nowrap p-4 text-left text-sm font-medium text-zinc-100">
                      Key
                    </th>
                    <th className="whitespace-nowrap p-4 text-left text-sm font-medium text-zinc-100">
                      Data Type
                    </th>
                    <th className="whitespace-nowrap p-4 text-left text-sm font-medium text-zinc-100">
                      Task Type
                    </th>
                    <th className="whitespace-nowrap p-4 text-left text-sm font-medium text-zinc-100">
                      Instructions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-800">
                  {agentTasks.map((agentTask, idx) => (
                    <tr key={agentTask.key}>
                      <td className="whitespace-nowrap p-4 text-sm text-zinc-300">
                        {idx + 1}
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm text-zinc-300">
                        {agentTask.key}
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm text-zinc-300">
                        {agentTask.dataType}
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm text-zinc-300">
                        {agentTask.type}
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm text-zinc-300">
                        {agentTask.instruction}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-4 pt-4">
        <h3 className="font-medium">Create Task</h3>

        <form onSubmit={handleAddTask} className="grid grid-cols-12 gap-4">
          <div className="col-span-12 flex flex-col space-y-2 md:col-span-6">
            <label htmlFor="key">Key</label>
            <input
              id="key"
              name="key"
              className="rounded-md border border-zinc-800 bg-zinc-800/25 p-4 text-sm"
            />
          </div>

          <div className="col-span-12 flex flex-col space-y-2 md:col-span-6">
            <label htmlFor="dataType">Data Type</label>
            <select
              id="dataType"
              name="dataType"
              className="rounded-md border border-zinc-800 bg-zinc-800/25 p-4 text-sm"
            >
              <option value="NUMBER">Number</option>
              <option value="TEXT">Text</option>
              <option value="BOOLEAN">Boolean</option>
              <option value="LIST">List</option>
            </select>
          </div>

          <div className="col-span-12 flex flex-col space-y-2">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              className="rounded-md border border-zinc-800 bg-zinc-800/25 p-4 text-sm"
            >
              <option value="EXTRACT">Extract</option>
              <option value="CLASSIFY">Classify</option>
              <option value="GENERATE">Generate</option>
            </select>
          </div>

          <div className="col-span-12 flex flex-col space-y-2">
            <label htmlFor="instruction">Instruction</label>
            <textarea
              id="instruction"
              name="instruction"
              rows={5}
              className="rounded-md border border-zinc-800 bg-zinc-800/25 p-4 text-sm"
            />
          </div>

          <div className="col-span-12">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-md border border-zinc-800 bg-zinc-800/25 px-4 py-2 font-medium text-zinc-100"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
