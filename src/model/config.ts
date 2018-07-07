import { Context } from "../../graphql";
import { SchemaTypeOpts, SchemaType, Schema, SchemaDefinition } from "mongoose";
import { GraphQLFieldConfig } from "graphql";

// type TypeOptDecoder<T, K extends string, F extends Function> = {
//   [key in keyof SchemaTypeOpts<T>]: F
// };

// const typeOptDecoder = {
//   type: () => null,
//   required: () => null,
//   unique: () => null,
//   default: () => null
// };

// type TypeOptDecoder = typeof typeOptDecoder;
// type DecoderKeys = keyof TypeOptDecoder;
// type SchemaOptKeys<T extends SchemaTypeOpts<any>> = keyof T;

// type SupportedTypeOpts<T> = SchemaTypeOpts<T>[Extract<SchemaOptKeys<T>, DecoderKeys>];

interface SupportedSchemaTypeOpts<T> {
  //   select?: boolean | any;
  //   validate?:
  //     | RegExp
  //     | [RegExp, string]
  //     | SchemaTypeOpts.ValidateFn<T>
  //     | [SchemaTypeOpts.ValidateFn<T>, string]
  //     | SchemaTypeOpts.ValidateOpts
  //     | SchemaTypeOpts.ValidateOpts[]
  //     | any;
  //   index?: SchemaTypeOpts.IndexOpts | boolean | string;
  //   sparse?: boolean | any;
  //   text?: boolean | any;
  //   get?: (value: T, schematype?: this) => T | any;
  //   set?: (value: T, schematype?: this) => T | any;
  //   lowercase?: boolean | any;
  //   match?: RegExp | [RegExp, string] | any;
  //   maxlength?: number | [number, string] | any;
  //   minlength?: number | [number, string] | any;
  //   trim?: boolean | any;
  //   uppercase?: boolean | any;
  //   min?: number | [number, string] | Date | [Date, string] | any;
  //   max?: number | [number, string] | Date | [Date, string] | any;
  //   expires?: number | string | any;
  //   auto?: boolean | any;
  //   enum?: T[] | SchemaTypeOpts.EnumOpts<T> | any;
  //   [other: string]: any;
  type?: T;
  required?:
    | SchemaTypeOpts.RequiredFn<T>
    | boolean
    | [boolean, string]
    | string
    | [string, string]
    | any;
  unique?: boolean | any;
  default?: SchemaTypeOpts.DefaultFn<T> | T;
}
type MongoosePropValue<T> = SupportedSchemaTypeOpts<T> | Schema | SchemaType;

export interface ModelConfig<T> extends SchemaDefinition {
  [prop: string]: GraphQLFieldConfig<T, Context> | MongoosePropValue<T>;
}
