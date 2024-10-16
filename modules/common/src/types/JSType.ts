export type JSTypeMap = {
  number: number;
  string: string;
  boolean: boolean;
  bigint: bigint;
  null: null;
  undefined: undefined;
  symbol: symbol;
  object: object;
};

export type JSTypeString = keyof JSTypeMap;

export type JSType = JSTypeMap[JSTypeString];

export type GetJSTypeString<T extends JSType> = T extends number
  ? "number"
  : T extends string
  ? "string"
  : T extends boolean
  ? "boolean"
  : T extends bigint
  ? "bigint"
  : T extends null
  ? "null"
  : T extends symbol
  ? "symbol"
  : T extends object
  ? "object"
  : T extends undefined
  ? "undefined"
  : T;
