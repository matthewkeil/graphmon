import { isObject, isError } from "util";
import { SchemaDefinition, Schema, SchemaTypeOpts, SchemaType } from "mongoose";
import * as mongoose from "mongoose";
import { isObjectLiteral } from "../isObjectLiteral";
import { isSchemaTypeOpts } from "./isSchemaTypeOpts";
const Types = mongoose.Schema.Types;

type PathType = Schema | SchemaType | SchemaTypeOpts<any>;
type PathValue = PathType | PathType[];
type PathDefinition = [string, PathValue];

const isValidType = (type: any): Error[] | PathValue => {
  if (Array.isArray(type)) {
    if (!type.length || type.length > 1)
      return [new TypeError("arrays must be of exactly one type")];

    return isValidType([type[0]]);
  }

  if (type instanceof SchemaType) return type;

  if (type instanceof Schema) return type;

  if (isObjectLiteral(type)) return isSchemaTypeOpts(type);

  return [
    new TypeError(
      "types must be a Schema | [Schema] | SchemaType | [SchemaType] | SchemaTypeOpts | [SchemaTypeOpts]"
    )
  ];
};

const isErrArray = (arg: any) => Array.isArray(arg) && isError(arg[0]);
export const isSchemaDefinition = (obj: any) => {
  const errors = [] as Error[];
  const definition = {} as SchemaDefinition;

  if (isObject(obj))
    Object.entries(obj)
      .map(([path, value]) => {
        const type = isValidType(value);
        return isErrArray(type)
          ? (type as Error[])
          : ([path, type] as PathDefinition);
      })
      .forEach(result => {
        const [path, type] = result as any;
        return isErrArray(result)
          ? void errors.concat(result as Error[])
          : void (definition[path] = type);
      });
  else errors.push(new TypeError("SchemaDefinition must be an object"));

  return errors.length ? errors : definition;
};

// if (isSchemaType(type)) {
//   switch (type) {
//     case Types.Boolean:
//     case Types.Buffer:
//     case Types.Date:
//     case Types.Decimal128:
//     case Types.DocumentArray:
//     case Types.Embedded:
//     case Types.Mixed:
//     case Types.Number:
//     case Types.ObjectId:
//     case Types.String:
//   }
//   return;
// }
