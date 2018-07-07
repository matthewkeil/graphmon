import { GraphQLObjectTypeConfig, GraphQLFieldConfig } from "graphql";

export const convertSchemaTypeOptsToGraphQLConfig = <T, Context>(
  value: any
): Error[] | GraphQLFieldConfig<T, Context> => {};

export default convertSchemaTypeOptsToGraphQLConfig;
