import { Request, Response } from "express";
import { ResponseStatus } from "../constants";
import { AddWorkflowToProjectRequest, AddWorkflowToProjectRequestParams, AddWorkflowToProjectResponse, GetWorkflowsByProjectIdRequestParams, RunWorkflowByIdRequestParams, RunWorkflowByIdResponse } from "../interfaces/workflows.interfaces";
import { AgentsService } from "../services/agents.services";
import { WorkflowsService } from "../services/workflows.services";
import loadFile from "../utils/load-file";
import { AddWorkflowToProjectRequestValidator, TWorkflowItemSchema, WorkflowItemType } from "../validators/workflows.validators";

export class WorkflowsController {
  private agentsService: AgentsService;
  private workflowsService: WorkflowsService;

  constructor() {
    this.agentsService = new AgentsService();
    this.workflowsService = new WorkflowsService();
  }

  private flattenWorkflowItems = (flattenedWorkflowItems: Array<TWorkflowItemSchema>, workflowItem: TWorkflowItemSchema) => {
    flattenedWorkflowItems.push(workflowItem);
    if (workflowItem.next) {
      this.flattenWorkflowItems(flattenedWorkflowItems, workflowItem.next);
    }
  };

  private validateInjectable = (injectable: string, sourceJSON: Record<string, boolean>): boolean => {
    const placeholders = injectable.match(/{{(.*?)}}/g)?.map((match) => match.substring(2, match.length - 2)) || [];

    for (let i = 0; i <= placeholders.length - 1; i++) {
      const placeholder = placeholders[i];
      const placeholderWithoutIndex = placeholder.replace(/\[\d+\]/, "");

      const keyExists = Object.keys(sourceJSON).some((key) => sourceJSON[placeholderWithoutIndex]);
      if (!keyExists) {
        return false;
      }
    }

    return true;
  };

  private inject = (injectable: string, sourceJSON: Record<string, any>): string => {
    return injectable.replace(/{{(.*?)}}/g, (_, placeholder) => {
      const [agentId, fieldWithOrWoIndex] = placeholder.split(".");
      const key = `${agentId}.${fieldWithOrWoIndex}`;

      let value = sourceJSON[key];
      if (value === undefined && fieldWithOrWoIndex.includes("[")) {
        const index = parseInt(fieldWithOrWoIndex.match(/\[(.*?)\]/)[1]);
        value = sourceJSON[key]?.[index];
      }

      if (value === undefined) {
        throw new Error(`Key ${key} not found in values map`);
      }

      return value;
    });
  };

  private validateWorkflow = async (flattenedWorkflowItems: Array<TWorkflowItemSchema>, agentTasks: Record<string, boolean>, projectId: string, userId: string): Promise<{ status: ResponseStatus; message: string; data: null } | null> => {
    if (flattenedWorkflowItems[flattenedWorkflowItems.length - 1].type !== WorkflowItemType.OMITTER) {
      return { status: "error", message: "Last WorkflowItem must be an Omitter", data: null };
    }

    for (let i = 0; i <= flattenedWorkflowItems.length - 1; i++) {
      const workflowItem = flattenedWorkflowItems[i];

      if (i !== flattenedWorkflowItems.length - 1) {
        if (!workflowItem.next) {
          return { status: "error", message: "Every WorkflowItem, except the last, must have a next", data: null };
        }
      }

      switch (workflowItem.type) {
        case WorkflowItemType.AGENT:
          if (!workflowItem.file) return { status: "error", message: "Every Agent must have a file", data: null };
          if (!workflowItem.agentId) return { status: "error", message: "Every Agent must have an agentId", data: null };

          const agent = await this.agentsService.getAgentById(workflowItem.agentId, projectId, userId);
          if (!agent) {
            return { status: "error", message: "Agent not found", data: null };
          }

          agent.tasks.forEach((task) => {
            agentTasks[`${agent.id}.${task.key}`] = true;
          });

          break;

        case WorkflowItemType.VALIDATOR:
          if (!workflowItem.validateQ) return { status: "error", message: "Every Validator must have a validateQ", data: null };
          if (!workflowItem.exit) return { status: "error", message: "Every Validator must have an exit", data: null };

          if (!this.validateInjectable(workflowItem.validateQ, agentTasks)) {
            return { status: "error", message: "Invalid validateQ", data: null };
          }

          const flattenedExitWorkflow: Array<TWorkflowItemSchema> = [];
          this.flattenWorkflowItems(flattenedExitWorkflow, workflowItem.exit);

          const exitWorkflowValidation = await this.validateWorkflow(flattenedExitWorkflow, agentTasks, projectId, userId);
          if (exitWorkflowValidation) {
            return exitWorkflowValidation;
          }

          break;

        case WorkflowItemType.OMITTER:
          if (!workflowItem.omitJ) return { status: "error", message: "Every Omitter must have an omitJ", data: null };

          if (!this.validateInjectable(workflowItem.omitJ, agentTasks)) {
            return { status: "error", message: "Invalid omitJ", data: null };
          }

          break;

        default:
          return { status: "error", message: "Invalid WorkflowItemType", data: null };
      }
    }

    return null;
  };

  addWorkflowToProject = async (req: Request<AddWorkflowToProjectRequestParams, AddWorkflowToProjectResponse, AddWorkflowToProjectRequest, null>, res: Response<AddWorkflowToProjectResponse>) => {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).send({ status: "error", message: "Unauthorized", data: null });
    }

    const projectId = req.params.projectId;

    const body = req.body;

    const validation = AddWorkflowToProjectRequestValidator.safeParse(body);
    if (!validation.success) {
      return res.status(400).send({ status: "error", message: "Invalid request body", data: validation.error });
    }

    const flattenedWorkflowItems: Array<TWorkflowItemSchema> = [];
    this.flattenWorkflowItems(flattenedWorkflowItems, body.workflowItems);

    let agentTasks: Record<string, boolean> = {};
    const workflowValidation = await this.validateWorkflow(flattenedWorkflowItems, agentTasks, projectId, userId);
    if (workflowValidation) {
      return res.status(400).send(workflowValidation);
    }

    const workflow = await this.workflowsService.createWorkflow(body, projectId, userId);

    return res.status(201).send({ status: "success", message: "Workflow created successfully", data: workflow });
  };

  runWorkflowById = async (req: Request<RunWorkflowByIdRequestParams, RunWorkflowByIdResponse, null, null>, res: Response<RunWorkflowByIdResponse>) => {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).send({ status: "error", message: "Unauthorized", data: null });
    }

    const projectId = req.params.projectId;
    const workflowId = req.params.workflowId;

    const files = req.files;

    const workflow = await this.workflowsService.getWorkflowById(workflowId, projectId, userId);

    let workflowItem = workflow?.workflowItems as TWorkflowItemSchema;
    if (!workflowItem) {
      return res.status(404).send({ status: "error", message: "Workflow not found", data: null });
    }

    const agentTasks: Record<string, any> = {};

    while (workflowItem) {
      switch (workflowItem.type) {
        case WorkflowItemType.AGENT:
          if (!workflowItem.agentId) {
            return res.status(400).send({ status: "error", message: "Agent must have an agentId", data: null });
          }

          if (!workflowItem.file) {
            return res.status(400).send({ status: "error", message: "Agent must have a file", data: null });
          }

          // @ts-ignore - TODO: get rid of this ts-ignore
          const file = files?.find((file) => file.fieldname === workflowItem.file) as null | Express.Multer.File;
          if (!file) {
            return res.status(400).send({ status: "error", message: "File not found", data: null });
          }

          const contents = await loadFile(file);

          const executionResults = await this.agentsService.runAgentById(workflowItem.agentId, projectId, userId, contents);
          if (!executionResults) {
            return res.status(404).send({ status: "error", message: "Agent not found", data: null });
          }

          Object.keys(executionResults).forEach((key) => {
            agentTasks[`${workflowItem.agentId}.${key}`] = executionResults[key];
          });

          break;

        case WorkflowItemType.VALIDATOR:
          if (!workflowItem.validateQ) {
            return res.status(400).send({ status: "error", message: "Validator must have a validateQ", data: null });
          }

          if (!workflowItem.exit) {
            return res.status(400).send({ status: "error", message: "Validator must have an exit", data: null });
          }

          const validator = this.inject(workflowItem.validateQ, agentTasks);

          const validation = eval(validator);
          if (!validation) {
            workflowItem = workflowItem.exit;
            continue;
          }

          break;

        case WorkflowItemType.OMITTER:
          if (!workflowItem.omitJ) {
            return res.status(400).send({ status: "error", message: "Omitter must have an omitJ", data: null });
          }

          const omit = this.inject(workflowItem.omitJ, agentTasks);
          return res.status(200).send({ status: "success", message: "Workflow ran successfully", data: JSON.parse(omit) });

        default:
          return res.status(400).send({ status: "error", message: "Invalid WorkflowItemType", data: null });
      }

      if (!workflowItem.next) {
        return res.status(400).send({ status: "error", message: "Every WorkflowItem, except the last, must have a next", data: null });
      }

      workflowItem = workflowItem.next;
    }
  };
}
