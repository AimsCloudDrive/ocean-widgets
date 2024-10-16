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

export type JSType = keyof JSTypeMap;
