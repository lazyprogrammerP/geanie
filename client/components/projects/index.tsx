import { Fragment } from "react";
import AgentList from "./agent-list";

export default function ProjectView() {
  return (
    <Fragment>
      <h1 className="text-2xl font-bold">Project View</h1>

      <AgentList />
    </Fragment>
  );
}
