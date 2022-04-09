import { ValidationError } from "./errorUtils";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

export const validateDto = <T extends object>(c: Class<T>) => async (
  values: T
): Promise<T> => {
  const dtoClass = plainToClass(c, values, {
    excludeExtraneousValues: true,
  });
  const errors = await validate(dtoClass, {
    whitelist: true,
    forbidUnknownValues: true,
  });
  if (errors.length) {
    throw new ValidationError({ details: errors });
  } else return values;
};

interface Class<T> {
  new (...args: any[]): T;
}
