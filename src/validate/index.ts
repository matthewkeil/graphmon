// import { ModelConfig, ModelOptions } from "../Model";
// import {
//   GraphQLObjectTypeConfig,
//   GraphQLFieldConfigMap,
//   Thunk,
//   GraphQLOutputType,
//   GraphQLFieldConfigArgumentMap,
//   GraphQLArgumentConfig,
//   isInputType,
//   isOutputType,
//   GraphQLFieldConfig,
//   GraphQLList,
//   GraphQLNonNull,
//   GraphQLFieldResolver,
//   isSchema,
//   GraphQLObjectType
// } from "graphql";
// import { Context } from "../../graphql/index";
// import { isObject, isString, isArray, isFunction } from "util";
// import { Schema } from "mongoose";

/**
 *
 * - parse incoming config into path/type pairs
 * - isolate any graphql specific fields
 * - normalize types
 * - separate any graphql specific fields
 *
 */

// const normalizeModelConfig = <T>(_config: any): NormalizedConfig<T> => {
//   if (!isObject(_config)) throw new Error("model config must be an object");

//   const config = {} as NormalizedConfig<T>;

//   Object.entries(_config).forEach(([name, type]) => {
//     if (!isString(name)) throw new Error(`${typeof name} must be a string`);
//     config[name] = normalizeModelConfigField(type);
//   });

//   return config;
// };

// const buildGraphQLFields = <T>(config: NormalizedConfig<T>): Fields<T> => {
//   const fields = {} as Fields<T>;

//   Object.entries(config).forEach(
//     ([
//       name,
//       {
//         type: _type,
//         list,
//         required,
//         description,
//         deprecationReason,
//         args,
//         resolve
//       }
//     ]) => {
//       let type = _type;
//       if (list) type = new GraphQLList(type);
//       if (required) type = new GraphQLNonNull(type);

//       fields[name] = {
//         type,
//         deprecationReason,
//         description: description || "GraphMongo rocks yo...",
//         args,
//         resolve
//       };
//     }
//   );

//   return fields;
// };

/**
 *
 * Validate object
 *
 */
// export const Validate = {
//   Model: { constructorArgs: validateModelConstructorArgs },
//   GraphQL: { Object: { field: { config: null, configArgMap: null } } }
// };

/**
 *
 *
 *
 *
 *
 *
 *
 */
// const isValidGraphQLFieldConfigArgumentMap = (
//   obj: any
// ): GraphQLFieldConfigArgumentMap => {
//   if (!isObject(obj))
//     throw new Error("GraphQLFieldConfigArgumentMap must be an object");

//   const args = {} as GraphQLFieldConfigArgumentMap;

//   Object.entries(obj).forEach(([argName, config]) => {
//     if (typeof argName !== "string")
//       throw new Error("argName must be a string");
//     if (!isObject(config))
//       throw new Error("GraphQLArgumentConfig must be an object");

//     const argConfig = {} as GraphQLArgumentConfig;

//     Object.entries(config).forEach(entry => {
//       switch (entry[0]) {
//         case "type":
//           if (!isInputType(entry[1]))
//             throw new Error("arg types must be valid GraphQLInputType");
//           return void (argConfig.type = entry[1]);

//         case "defaultValue":
//           return void (argConfig.defaultValue = entry[1]);

//         case "description":
//           if (!isString(entry[1]))
//             throw new Error("description must be a string");
//           return void (argConfig.description = entry[1]);

//         default:
//           throw new Error("only valid GraphQLArgumentConfig properties");
//       }
//     });

//     args[argName] = argConfig;
//   });

//   return args;
// };

// const isGraphQLFieldConfig = <T>(
//   obj: any
// ): GraphQLFieldConfig<T, Context> | Error[] => {
//   const errors = [] as Error[];

//   let args = {} as GraphQLFieldConfigArgumentMap;

//   Object.keys(obj).forEach(key => {
//     switch (key) {
//       case "type":
//         if (isOutputType(obj[key])) return;
//         return void errors.push(new Error("type must be a GraphQLOutputType"));
//       case "args":
//         try {
//           args = isValidGraphQLFieldConfigArgumentMap(obj[key]);
//         } catch (err) {
//           errors.push(err);
//         }
//         return;
//       case "resolve":
//         if (!isFunction(obj[key])) throw new Error("resolve must be function");
//         return;
//       case "deprecationReason":
//         if (!isString(obj[key]))
//           errors.push(new Error("deprecation reason must be a string"));
//         return;
//       case "description":
//         if (!isString(obj[key]))
//           errors.push(new Error("description must be a string"));
//         return;
//       default:
//         return void errors.push(
//           new Error("only valid GraphQLFieldConfig properties")
//         );
//     }
//   });

//   return errors.length > 0 ? errors : obj;
// };
