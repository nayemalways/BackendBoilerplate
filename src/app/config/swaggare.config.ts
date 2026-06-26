import path from "path";
import { NextFunction, Request, Response } from "express";
import SwaggerParser from "@apidevtools/swagger-parser";
import swaggerUi from "swagger-ui-express"; 

// Resolve all external $refs
const swaggerDocument = SwaggerParser.bundle(path.join(__dirname, "../docs/openapi.yaml"));

export const swaggerUiServe = swaggerUi.serve;
export const swaggerUiSetup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const document = await swaggerDocument;
    return swaggerUi.setup(document)(req, res, next);
  } catch (error) {
    return next(error);
  }
};
