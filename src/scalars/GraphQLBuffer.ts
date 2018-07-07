import { GraphQLScalarType, Kind } from "graphql";
import { inspect, isString, isArray, isBuffer } from "util";

const GraphQLBuffer = new GraphQLScalarType({
  name: "Buffer",
  description: `byte sequence that serializes using base64 encoding.
  correlates to mongo datatype #5-binData`,
  parseValue: (value: any) => {
    if (!isString(value))
      throw new TypeError(
        "Buffers must be serialized to string with base64 encoding"
      );
    return Buffer.from(value, "base64");
  },
  serialize: (value: any) => {
    if (!isBuffer(value)) throw new TypeError(`Buffer must be of type Buffer`);
    return value.toString("base64");
  },
  parseLiteral: ast => {
    if (ast.kind === Kind.STRING) return Buffer.from(ast.value, "base64");
    return undefined;
  }
});

export default GraphQLBuffer;
