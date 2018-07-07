import {
  Schema,
  SchemaDefinition,
  Model as MongooseModel
  // Document
} from "mongoose";
import * as mongoose from "mongoose";
// const {ObjectId, Boolean, String, Number} = Schema.Types;
const Types = Schema.Types;

import {
  GraphQLObjectType,
  GraphQLObjectTypeConfig,
  isOutputType,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLArgumentConfig,
  isInputType,
  GraphQLFieldConfigMap,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
  GraphQLIncludeDirective,
  GraphQLInt,
  GraphQLList,
  GraphQLOutputType
} from "graphql";

import { ModelOptions, validateModelOptions } from "./options";
import { Context } from "../../graphql";
import { isObject, isFunction, isString, isArray, isBoolean } from "util";
import { ModelConfig } from "./config";
import GraphQLNumber from "../GraphQLNumber";
import { ObjectId } from "mongodb";
import GraphQLDate from "../GraphQLDate";
import GraphQLBuffer from "../GraphQLBuffer";
import {
  isObjectLiteral,
  isGraphQLFieldConfig,
  isSchemaTypeOpts,
  convertSchemaTypeOptsToGraphQLConfig
} from "../util";
// import GraphQLMap from "../GraphQLMap";

interface DBRef {
  $ref: string;
  $id: ObjectId;
  $db?: string;
}

export type JavascriptTypeConstructor<
  T extends Number | String | Boolean | Date | Buffer | Map<any, any>
> = T;

export type MongooseMapToInterface<T extends JavascriptTypeConstructor<any>> = {
  [P in keyof T]?: T[P]
};

// type GraphQL<T extends> = T extends String ? string :
//   T extends Number ? number :
//   T extends Boolean ?

type BuildType<T> = GraphQLFieldConfig<T, Context> & {
  type: boolean;
  base: (type: GraphQLOutputType) => GraphQLOutputType;
};
const buildGraphQLFieldConfig = <T, Context>(
  [name, value]: [string, any],
  parent: string,
  field: BuildType<T> = {} as BuildType<T>
): GraphQLFieldConfig<T, Context> => {
  /**
   *    = recursively wrap finalized type
   */
  function finalize(type: GraphQLOutputType): GraphQLFieldConfig<T, Context> {
    return { type: isBoolean(field.type) ? field.base(type) : type };
  }

  function isScalarType(value: any): undefined | GraphQLOutputType {
    /**
     *    = base mongoose/Javascript types
     *        - Number
     *        - String
     *        - Boolean
     *        - Date
     *        - Buffer
     *        - ObjectId
     */
    if (value === Types.ObjectId) return GraphQLID;
    if (value === Date || value === Types.Date) return GraphQLDate;
    if (value === Number || value === Types.Number) return GraphQLNumber;
    if (value === String || value === Types.String) return GraphQLString;
    if (value === Boolean || value === Types.Boolean) return GraphQLBoolean;
    if (value === Buffer || value === Types.Buffer) return GraphQLBuffer;

    /**
     *    = unsupported mongoose/Javascript types
     *        - Symbol
     *        - Mixed
     *        - Array
     */
    if (value === Symbol) throw new Error("Symbols are not serializable");
    if (value === Types.Mixed || value === Array || value === Types.Array)
      throw new Error("Mixed/Unknown types are not supported by GraphQL");

    /**
     *    = unsupported types to be added as features
     *        - Map
     *        - Schema-based sub-documents
     *        - Decimal128
     */
    if (value === Map)
      //return GraphQLMap;
      throw new Error("Maps are not supported by GraphMon yet...");
    if (value instanceof Schema)
      throw new Error("Sub-documents are not supported by GraphMon yet...");
    if (value === Types.Decimal128)
      throw new Error("Decimal128 types are not supported by GraphMon yet...");

    return;
  }

  /**
   *    = possible encountered values
   *    - array wraps
   */
  if (isArray(value))
    if (value.length === 1) {
      let base;

      field.base && typeof field.base === "function"
        ? (base = (type: GraphQLOutputType) =>
            field.base(new GraphQLList(type)))
        : (base = (type: GraphQLOutputType) => new GraphQLList(type));

      let _field = { ...field, type: false, base } as BuildType<T>;

      return buildGraphQLFieldConfig<T, Context>(
        [name, value[0]],
        parent,
        _field
      );
    } else throw new Error("array elements must be one type");

  /**
   *    = scalar types
   */
  let scalar = isScalarType(value);
  if (scalar) finalize(scalar);

  /**
   *    = Known object literal type
   *      - GraphQLFieldConfig<T, Context>
   *      - SchemaTypeOpts<T>
   */
  if (isObjectLiteral(value)) {
    let results = isGraphQLFieldConfig<T, Context>(value);
    if (!isArray(results)) return results;

    if (!isArray(isSchemaTypeOpts<T>(value))) {
      let results = convertSchemaTypeOptsToGraphQLConfig<T, Context>(value);
      if (!isArray(results)) return results;
      throw new Error(`field ${name} has an invalid SchemaTypeOpts`);
    }
    /**
     *    = Nested simple object
     *
     */
    finalize(
      new GraphQLObjectType({
        name: `${parent}.${name}`,
        fields: buildGraphQLFieldConfigMap(value, `${parent}.${name}`)
      })
    );
  }

  throw new TypeError(
    `unknown type ${typeof value} named ${value.name ? value.name : "NO NAME"}`
  );
};

const buildGraphQLFieldConfigMap = <T, Context>(
  config: ModelConfig<T>,
  parent: string
): GraphQLFieldConfigMap<T, Context> => {
  const fields = {} as GraphQLFieldConfigMap<T, Context>;

  Object.entries(config).map(([key, value]) => {
    const fieldConfig = buildGraphQLFieldConfig([key, value], parent);

    // const fieldConfig = {
    //   resolve: (obj, args, ctx, info) => {}
    // } as GraphQLFieldConfig<T, Context>;

    fields[key] = fieldConfig;
  });

  return fields;
};

class Model<T extends mongoose.Document> extends GraphQLObjectType {
  public static create<T>(
    config: ModelConfig<T>,
    options: ModelOptions
  ): Model<T> {
    const { options: _options, schemaOptions } = validateModelOptions(options);

    const schemaDefinition = Object.assign(
      {} as SchemaDefinition,
      ...Object.entries(config)
        .filter(([_, value]) => {
          let valid = isGraphQLFieldConfig<T, Context>(value);
          return !valid || !isArray(valid);
        })
        .map(([key, value]) => ({ [key]: value }))
    );

    const schema = new Schema(schemaDefinition, schemaOptions);

    const model = mongoose.model(
      _options.name,
      schema,
      schemaOptions.collection
    );

    const fields = buildGraphQLFieldConfigMap(config, _options.name);

    const _config: GraphQLObjectTypeConfig<T, Context> = {
      name: _options.name,
      description: _options.description || "GraphMongo rocks yo...",
      fields: () => fields
    };

    return new Model(_config, schema, model);
  }

  private constructor(
    public config: GraphQLObjectTypeConfig<T, Context>,
    public schema: Schema,
    public model: MongooseModel<any>
  ) {
    super(config);
  }
}

export default Model.create;
