import {Response} from "express";
import log4js from "log4js";
import {DishNotFoundError} from "../system/dishNotFoundError";
import {InternalError} from "../system/internalError";

export const handleError = (error: unknown, res: Response, customMessage: string) => {
  log4js.getLogger().error(customMessage, error);

  if (error instanceof DishNotFoundError) {
    res.status(404).send({ message: error.message });
  } else {
    const { message, status } = new InternalError(error);
    res.status(status).send({ message });
  }
};