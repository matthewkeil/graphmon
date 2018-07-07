import { GraphQLScalarType, Kind } from "graphql";
import { inspect, isString, isArray } from "util";

const GraphQLDate = new GraphQLScalarType({
  name: "Date",
  description: "date object that serializes to JSON",
  parseValue: (value: any) => {
    if (!isString(value))
      throw new TypeError("Dates must be serialized using toUTCString");

    return new Date(value);
  },
  serialize: (value: any) => {
    if (isArray(value))
      throw new TypeError(
        `Date cannot represent an array value: ${inspect(value)}`
      );

    return value.toUTCString
      ? value.toUTCString()
      : isString(value)
        ? value
        : undefined;
  },
  parseLiteral: ast => {
    if (ast.kind === Kind.STRING) return new Date(ast.value);
    return undefined;
  }
});

export default GraphQLDate;
