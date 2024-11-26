import { isArray } from "../array";
import { Nullable } from "../global";

export type ClassType =
  | string
  | (string | false | Nullable)[]
  | { [K in string]: boolean };

export function parseClass(classType: ClassType): string {
  if (typeof classType === "string") return classType;
  if (isArray(classType)) {
    return classType.reduce<string>((c, b) => {
      if (typeof b === "string") {
        return `${c} ${b}`;
      }
      return c;
    }, "");
  }
  return Object.entries(classType).reduce<string>(
    (c, [C, IS]) => (IS ? `${c} ${C}` : c),
    ""
  );
}

export type CSSStyle =
  | string
  | {
      [K in keyof CSSStyleDeclaration]?: number | string;
    };

export function parseStyle(style: CSSStyle): string {
  if (typeof style === "string") return style;
  return Object.entries(style)
    .map<string>((s, [n, v]) => {
      if (typeof v === "number") {
        v = ("" + v) as any;
      }
      return `${n}: ${v}`;
    })
    .join("; ");
}
