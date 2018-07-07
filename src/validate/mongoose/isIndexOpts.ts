import { isObject, isBoolean, isString, isNumber } from "util";

export const isIndexOpts = (value: any) => {
  // interface IndexOpts {
  //   background?: boolean;
  //   expires?: number | string;
  //   sparse?: boolean;
  //   type?: string;
  //   unique?: boolean;
  // }
  let isIndex = false;
  if (isObject(value)) {
    isIndex = true;
    Object.entries(value).map(([key, value]) => {
      switch (key) {
        case "background":
          if (!isBoolean(value)) isIndex = false;
          break;
        case "expires":
          if (!(isNumber(value) || isString(value))) isIndex = false;
          break;
        case "sparse":
          if (!isBoolean(value)) isIndex = false;
          break;
        case "unique":
          if (!isBoolean(value)) isIndex = false;
          break;
        case "type":
          if (!isString(value)) isIndex = false;
          break;
      }
    });
  }

  return isIndex;
};
export default isIndexOpts;
