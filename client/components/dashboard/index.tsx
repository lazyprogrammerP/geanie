import { Fragment } from "react";
import ProjectList from "./project-list";

export default async function Dashboard() {
  return (
    <Fragment>
      <h1>Dashboard</h1>

      <ProjectList />
    </Fragment>
  );
}
