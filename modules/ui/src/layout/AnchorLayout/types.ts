import { nil } from "@msom/common";

type VecHelper<
  T extends number,
  Acc extends number[] = []
> = Acc["length"] extends T ? Acc : VecHelper<T, [...Acc, number]>;

export type Vec<T extends number> = VecHelper<T>;
export type Vec2 = Vec<2>;
export type Vec3 = Vec<3>;
export type Vec4 = Vec<4>;

//#region AnchorRect
export type AnchorRect = [number, number, number?, number?];
export type AnchorRectLike =
  | AnchorRect
  | Pick<Element, "getBoundingClientRect">;
//#endregion

//#region Anchor
export type AnchorLike = number | "start" | "center" | "end";
export type AnchorLocation = [AnchorLike?, AnchorLike?];
//#endregion

//#region Margin、Offset
export type Margin = [number?, number?];
//#endregion

//#region parser
export function parseRectLike(rectLike: AnchorRectLike): Vec<4> {
  if (Array.isArray(rectLike)) {
    return rectLike.map((r) => nil(r, 0)) as Vec<4>;
  } else {
    const { x, y, width, height } = rectLike.getBoundingClientRect();
    return [x, y, width, height];
  }
}
export function parseAnchorLike(
  anchorLike: AnchorLike = 0,
  length: number
): number {
  if (typeof anchorLike === "number") {
    return length * anchorLike;
  }
  switch (anchorLike) {
    case "start":
      return 0;
    case "center":
      return length / 2;
    case "end":
      return length;
    default: {
      const n: never = anchorLike;
      return 0;
    }
  }
}
export function parseMargin(margin: Margin | undefined): Vec<2> {
  if (!margin) {
    return [0, 0];
  }
  return margin.map((m) => Math.max(nil(m, 0), 0)) as Vec<2>;
}
//#endregion
