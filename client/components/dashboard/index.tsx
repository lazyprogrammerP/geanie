import { Fragment } from "react";
import ProjectList from "./project-list";

export default async function Dashboard() {
  return (
    <Fragment>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <ProjectList />
    </Fragment>
  );
}
