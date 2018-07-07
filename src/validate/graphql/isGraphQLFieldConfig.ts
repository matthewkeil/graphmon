import { isObject, isFunction, isString } from "util";
import { GraphQLFieldConfig, isOutputType } from "graphql";
import { isGraphQLFieldConfigArgumentMap } from "./isGraphQLFieldConfigArgumentMap";

export const isGraphQLFieldConfig = <T, Context>(field: any) => {
  if (!isObject(field)) throw new Error("GraphQLFieldConfig must be an object");

  const errors = [] as Error[];
  // let args = {} as GraphQLFieldConfigArgumentMap;

  Object.entries(field as GraphQLFieldConfig<T, Context>).forEach(
    ([key, value]) => {
      switch (key) {
        case "type":
          if (isOutputType(value)) return;
          return void errors.push(
            new Error("type must be a GraphQLOutputType")
          );
        case "args":
          try {
            isGraphQLFieldConfigArgumentMap(value);
          } catch (err) {
            errors.push(err);
          }
          return;
        case "resolve":
          if (!isFunction(value)) throw new Error("resolve must be function");
          return;
        case "deprecationReason":
          if (!isString(value))
            errors.push(new Error("deprecation reason must be a string"));
          return;
        case "description":
          if (!isString(value))
            errors.push(new Error("description must be a string"));
          return;
        default:
          return void errors.push(
            new Error("only valid GraphQLFieldConfig properties")
          );
      }
    }
  );

  return errors.length > 0 ? errors : (field as GraphQLFieldConfig<T, Context>);
};

export default isGraphQLFieldConfig;
