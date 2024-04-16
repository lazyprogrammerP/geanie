"use client";

import Agent from "@/interfaces/agent.interface";
import { TaskWithoutId } from "@/interfaces/task.interface";
import service from "@/lib/service";
import { useParams } from "next/navigation";
import { FormEvent, Fragment, useState } from "react";
import { toast } from "react-toastify";

export default function AddAgentForm({ onAgentAdded }: { onAgentAdded: (agent: Agent) => void }) {
  const { projectId } = useParams();

  const [addingAgent, setAddingAgent] = useState(false);

  const [agentTasks, setAgentTasks] = useState<TaskWithoutId[]>([]);

  const handleAddTask = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const formData = new FormData(ev.currentTarget);

    const key = formData.get("key")?.toString();
    const dataType = formData.get("dataType")?.toString() as "NUMBER" | "TEXT" | "BOOLEAN" | "LIST";
    const type = formData.get("type")?.toString() as "EXTRACT" | "CLASSIFY" | "GENERATE";
    const instruction = formData.get("instruction")?.toString();

    if (!key || !dataType || !type || !instruction) {
      toast.error("Fill In All Fields!");
      return;
    }

    ev.currentTarget.reset();
    setAgentTasks((prev) => [...prev, { key: key?.toString(), dataType, type, instruction }]);
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
    <Fragment>
      <h2>Add Agent</h2>

      <form onSubmit={handleAddAgent}>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" />
        </div>

        <div>
          <label htmlFor="sourceType">Source Type</label>
          <select id="sourceType" name="sourceType">
            <option value="URL">URL</option>
            <option value="PDF">PDF</option>
            <option value="DOCX">DOCX</option>
            <option value="TXT">TXT</option>
            <option value="JPEG">JPEG</option>
            <option value="PNG">PNG</option>
          </select>
        </div>

        {agentTasks.length > 0 && (
          <div>
            <h3>Tasks</h3>
            {agentTasks.map((task, index) => (
              <div key={index}>
                <h4>{task.key}</h4>
                <p>{task.dataType}</p>
                <p>{task.type}</p>
                <p>{task.instruction}</p>
              </div>
            ))}
          </div>
        )}

        <button type="submit">{addingAgent ? "Adding Agent..." : "Add Agent"}</button>
      </form>

      <form onSubmit={handleAddTask}>
        <div>
          <label htmlFor="key">Key</label>
          <input id="key" name="key" />
        </div>

        <div>
          <label htmlFor="dataType">Data Type</label>
          <select id="dataType" name="dataType">
            <option value="NUMBER">Number</option>
            <option value="TEXT">Text</option>
            <option value="BOOLEAN">Boolean</option>
            <option value="LIST">List</option>
          </select>
        </div>

        <div>
          <label htmlFor="type">Type</label>
          <select id="type" name="type">
            <option value="EXTRACT">Extract</option>
            <option value="CLASSIFY">Classify</option>
            <option value="GENERATE">Generate</option>
          </select>
        </div>

        <div>
          <label htmlFor="instruction">Instruction</label>
          <textarea id="instruction" name="instruction" rows={5} />
        </div>

        <button type="submit">Add Task</button>
      </form>
    </Fragment>
  );
}
