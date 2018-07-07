import { GraphQLScalarType, Kind } from "graphql";
import { isArray, isString } from "util";

const MAX_MAP_SIZE = 1000;

type SerializableFunction<T extends Function> = T;
type SerializableTypes =
  | "string"
  | "number"
  | "boolean"
  | SerializableFunction<any>;

function serializeMap(value: any): string {
  if (Array.isArray(value)) {
    throw new TypeError(`Maps cannot be an array`);
  }

  if (value._proto__ !== (Map as any).__proto__) {
    throw new TypeError(`maps must be a javascript Map`);
  }

  if ((value as Map<any, any>).size > MAX_MAP_SIZE)
    throw new Error(`maps have a maximum size of ${MAX_MAP_SIZE} elements`);

  let jsonMap = [] as string[];

  const stringify = (val: any): string => {
    switch (typeof val) {
      case "string":
      case "number":
      case "boolean":
      case "undefined":
        return `${val}`;
      case "object":
        if (isArray(val))
          throw new Error(
            "array serialization is not supported in GraphMongoose"
          );
        let test = JSON.stringify(val);
        let obj = JSON.parse(test);
        if (Object.keys(val).length !== Object.keys(obj).length)
          throw new Error("not all properties on object could be serialized");
        return test;
      case "function":
        throw new Error(
          "function serialization is not supported in GraphMongoose"
        );
      case "symbol":
        throw new Error("Symbols cannot be serialized");
      default:
        throw new Error("unknown data type");
    }
  };

  (value as Map<any, any>).forEach(
    ([key, value]) =>
      void jsonMap.push(`"${stringify(key)}":"${stringify(value)}"`)
  );

  return "{".concat(jsonMap.join(","), "}");
}

function parseMap(value: any): Map<SerializableTypes, SerializableTypes> {
  if (!isString(value)) {
    throw new TypeError(`Maps must be must be serialized via JSON`);
  }
  return new Map(Object.entries(JSON.parse(value)));
}

const GraphQLMap = new GraphQLScalarType({
  name: "Map",
  description: "serializable representation of the Javascript Map type",
  parseValue: parseMap,
  serialize: serializeMap,
  parseLiteral: ast => {
    if (ast.kind === Kind.STRING) return parseMap(ast.value);
    return undefined;
  }
});

export default GraphQLMap;
