import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

function formatErrors(errors: ValidationError[]) {
  const result: Record<string, string[]> = {};
  
  errors.forEach(error => {
    if (error.constraints) {
      result[error.property] = Object.values(error.constraints);
    }
    // handle nested validations if needed
    if (error.children && error.children.length > 0) {
      const childErrors = formatErrors(error.children);
      Object.assign(result, childErrors);
    }
  });
  
  return result;
}

export function validationMiddleware
<T extends object>(
  dtoClass: new () => T,
  source: "body" | "params" | "query" = "body"  // ✅ added "query" as valid option
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const plain =
      source === "body" ? req.body :
      source === "params" ? req.params :
      source === "query" ? req.query :
      {};

    const dto = plainToInstance(dtoClass, plain);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: formatErrors(errors),
      });
    }

    (req as any).validatedData = dto;
    next();
  };
}

