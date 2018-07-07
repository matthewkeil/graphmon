import { SchemaTypeOpts, SchemaType } from "mongoose";
import {
  isObject,
  isBoolean,
  isFunction,
  isNumber,
  isString,
  isArray,
  isDate,
  isRegExp
} from "util";
import { isIndexOpts } from "./isIndexOpts";

export const isSchemaTypeOpts = <T>(
  value: any
): Error[] | SchemaTypeOpts<T> => {
  if (!isObject(value)) return [new Error("SchemaTypeOpts must be an object")];

  const errors = [] as Error[];

  Object.entries(value).forEach(([option, value]) => {
    switch (option) {
      //   lowercase?: boolean | any;
      //   trim?: boolean | any;
      //   uppercase?: boolean | any;
      //   auto?: boolean | any;
      //   sparse?: boolean | any;
      //   text?: boolean | any;
      //   select?: boolean | any;
      //   unique?: boolean | any;
      //   required?:
      //     | SchemaTypeOpts.RequiredFn<T>
      //     | boolean
      //     | [boolean, string]
      //     | string
      //     | [string, string]
      //     | any;
      case "required":
      case "unique":
      case "auto":
      case "lowercase":
      case "select":
      case "sparse":
      case "text":
      case "trim":
      case "uppercase":
        if (!!value && !isBoolean(value))
          errors.push(new Error(`SchemaTypeOpts ${name} must be a boolean`));
        break;
      //   get?: (value: T, schematype?: this) => T | any;
      //   set?: (value: T, schematype?: this) => T | any;
      case "get":
      case "set":
        if (!!value && !isFunction(value))
          errors.push(
            new Error(`SchemaTypeOpts get or set must be a function`)
          );
        break;
      //   expires?: number | string | any;
      case "expires":
        if (!!value && !(isNumber(value) || isString(value)))
          errors.push(
            new Error(`SchemaTypeOpts expires must be a number or a string`)
          );
        break;
      //   maxlength?: number | [number, string] | any;
      //   minlength?: number | [number, string] | any;
      case "maxlength":
      case "minlength":
        if (
          !!value &&
          !isNumber(value) &&
          !(isArray(value) && isNumber(value[0]) && isString(value[1]))
        )
          errors.push(
            new Error(
              `SchemaTypeOpts min/maxlength may be a number or a [number, string] tuple`
            )
          );
        break;
      //   min?: number | [number, string] | Date | [Date, string] | any;
      //   max?: number | [number, string] | Date | [Date, string] | any;
      case "min":
      case "max":
        if (
          !!value &&
          !(
            isNumber(value) ||
            (isArray(value) && isNumber(value[0]) && isString(value[1])) ||
            isDate(value) ||
            (isArray(value) && isDate(value[0]) && isString(value[1]))
          )
        )
          errors.push(
            new Error(
              `SchemaTypeOpts min/max may be number, Date, [number, string], [number, Date]`
            )
          );
        break;
      //   match?: RegExp | [RegExp, string] | any;
      case "match":
        if (
          !!value &&
          !(
            isRegExp(value) ||
            (isArray(value) && isRegExp(value[0]) && isString(value[1]))
          )
        )
          errors.push(
            new Error(
              `SchemaTypeOpts match may be a regex or a [regex, string] tuple`
            )
          );
        break;
      //   default?: SchemaTypeOpts.DefaultFn<T> | T;
      case "default":
        if (!!value && isFunction(value))
          try {
            let test = (value as any)();
            if (!test)
              errors.push(
                new Error(`SchemaTypeOpts default function must return a value`)
              );
          } catch (err) {
            errors.push(
              new Error(`SchemaTypeOpts default prop function threw an error`)
            );
          }
        break;
      //   enum?: T[] | SchemaTypeOpts.EnumOpts<T> | any;
      case "enum":
        const isEnumOpts = (_value: any) =>
          isObject(_value) &&
          isString(_value.message) &&
          isArray(_value.values) &&
          !_value.values.filter((val: any) => !isString(val)).length;

        const arrayOfEnum = (_value: any) =>
          isArray(value) && !value.filter(val => !isString(val)).length;

        if (!!value && !(isEnumOpts(value) || arrayOfEnum(value)))
          errors.push(
            new Error(`SchemaTypeOpts enum may be a string[] or EnumOpts`)
          );
        break;

      // index ?: SchemaTypeOpts.IndexOpts | boolean | string;
      case "index":
        if (!!value && !(isBoolean(value) || isIndexOpts(value)))
          errors.push(
            new Error(`SchemaTypeOpts ${value} must be a boolean or IndexOpts`)
          );
        break;
      // graphql is agnostic of indexing
      case "validate": // will write a function to validate this in the future
      case "type": // main parse function will check this
        break;
      default:
        errors.push(
          new Error(`${option} is not a know property on SchemaTypeOpts`)
        );
    }
  });

  return errors.length ? errors : (value as SchemaTypeOpts<T>);
};

export default isSchemaTypeOpts;
