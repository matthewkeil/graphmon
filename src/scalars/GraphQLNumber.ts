import { GraphQLScalarType, Kind } from "graphql";
import { inspect } from "util";

// As per the GraphQL Spec, Integers are only treated as valid when a valid
// 32-bit signed integer, providing the broadest support across platforms.
//
// n.b. JavaScript's integers are safe between -(2^53 - 1) and 2^53 - 1 because
// they are internally represented as IEEE 754 doubles.
const MAX_INT = 2147483647;
const MIN_INT = -2147483648;

function serializeNumber(value: any): number {
  if (Array.isArray(value)) {
    throw new TypeError(`Number cannot represent an array values`);
  }

  const num = Number(value);
  const isInt = Number.isInteger(num);

  if (value === "" || !isInt || !isFinite(num)) {
    throw new TypeError(
      `Number can only represent Int and Float: ${inspect(value)}`
    );
  }
  if (isInt && (num > MAX_INT || num < MIN_INT)) {
    throw new TypeError(
      `Number cannot represent non 32-bit signed integer value: ${inspect(
        value
      )}`
    );
  }
  return num;
}

function coerceNumber(value: any): number {
  const isInt = Number.isInteger(value);

  if (!(isFinite(value) && isInt)) {
    throw new TypeError(`Numbers must be numeric values: ${inspect(value)}`);
  }

  if (isInt && (value > MAX_INT || value < MIN_INT)) {
    throw new TypeError(
      `Number cannot represent non 32-bit signed integer value: ${inspect(
        value
      )}`
    );
  }
  return value;
}

const GraphQLNumber = new GraphQLScalarType({
  name: "Number",
  description: "decimal agnostic numeric type",
  parseValue: coerceNumber,
  serialize: serializeNumber,
  parseLiteral: ast => {
    if (ast.kind === Kind.INT) {
      const num = parseInt(ast.value, 10);
      if (num <= MAX_INT && num >= MIN_INT) {
        return num;
      }
    }

    if (ast.kind === Kind.FLOAT || ast.kind === Kind.INT)
      return parseFloat(ast.value);

    return undefined;
  }
});

export default GraphQLNumber;
