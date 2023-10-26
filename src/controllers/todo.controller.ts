import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { v1 } from "uuid";
import { Todo } from "../@types/todo.js";
import AbsApiController from "../abstracts/abs-api-controller.js";
import TodoService from "../services/todo.service.js";

class TodoController extends AbsApiController<Todo> {
  service: TodoService = new TodoService()

  getAll = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => {
    try {
      const todos = await this.service.getAll();
      res.json(todos);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => {
    const todoId = req.params.id;
    try {
      const todo = await this.service.getById(todoId);
      if (todo) {
        res.json(todo);
      } else {
        throw new Error("Todo not found");
      }
    } catch (err) {
      next(err);
    }
  };
  create = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => {
    const { title, description } = req.body;
    try {
      const createdTodo = await this.service.create({
        id: v1(),
        title,
        description,
      });
      res.json(createdTodo);
    } catch (err) {
      next(err);
    }
  };
  update = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => {
    const todoId = req.params.id;
    const { title, description } = req.body;
    try {
      const updatedTodo = await this.service.update(todoId, {
        title,
        description,
      });
      if (updatedTodo) {
        res.json(updatedTodo);
      } else {
        throw new Error("Todo not found");
      }
    } catch (err) {
      next(err);
    }
  };
  delete = async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => {
    const todoId = req.params.id;
    try {
      const deletedTodo = await this.service.delete(todoId);
      if (deletedTodo) {
        res.json({ message: "Todo deleted successfully." });
      } else {
        res.status(404).json({ error: "Todo not found." });
      }
    } catch (err) {
      res.status(500).json({ error: "Unable to delete todo.", err });
    }
  };

}

export default TodoController;
