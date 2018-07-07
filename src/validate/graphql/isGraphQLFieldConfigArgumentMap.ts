import { isObject, isString } from "util";
import {
  GraphQLFieldConfigArgumentMap,
  GraphQLArgumentConfig,
  isInputType
} from "graphql";
export const isGraphQLFieldConfigArgumentMap = (obj: any) => {
  if (!isObject(obj))
    throw new Error("GraphQLFieldConfigArgumentMap must be an object");

  const args = {} as GraphQLFieldConfigArgumentMap;

  Object.entries(obj).forEach(([argName, config]) => {
    if (typeof argName !== "string")
      throw new Error("argName must be a string");
    if (!isObject(config))
      throw new Error("GraphQLArgumentConfig must be an object");

    const argConfig = {} as GraphQLArgumentConfig;

    Object.entries(config).forEach(([key, value]) => {
      switch (key) {
        case "type":
          if (!isInputType(value))
            throw new Error("arg types must be valid GraphQLInputType");
          return void (argConfig.type = value);

        case "defaultValue":
          return void (argConfig.defaultValue = value);

        case "description":
          if (!isString(value)) throw new Error("description must be a string");
          return void (argConfig.description = value);

        default:
          throw new Error("only valid GraphQLArgumentConfig properties");
      }
    });

    args[argName] = argConfig;
  });

  return args;
};

export default isGraphQLFieldConfigArgumentMap;
