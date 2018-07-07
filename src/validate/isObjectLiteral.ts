export const isObjectLiteral = (obj: any) =>
  obj.__proto__ === ({} as any).__proto__;

export default isObjectLiteral;
