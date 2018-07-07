import { SchemaOptions } from "mongoose";
import { isObject, isString } from "util";

export interface ModelOptions extends SchemaOptions {
  collection: string;
  name: string;
  description?: string;
}

export const validateModelOptions = (_options: any) => {
  if (!isObject(_options)) throw new Error("model options must be an object");

  const options = {} as ModelOptions;
  const schemaOptions = {} as SchemaOptions;

  Object.entries(_options).forEach(([key, value]) => {
    switch (key) {
      case "name":
        if (!isString(value))
          throw new Error("ModelOptions.name must be a string");
        return void (options.name = value);
      case "collection":
        if (!isString(value))
          throw new Error("ModelOptions.collection must be a string");
        return void (options.collection = value);
      case "description":
        if (!isString(value))
          throw new Error("ModelOptions.description must be a string");
        return void (options.description = value);
      default:
        throw new Error(
          `unknown prop ModelOptions.${isString(key) ? key : typeof key}`
        );
    }
  });

  return { options, schemaOptions };
};
