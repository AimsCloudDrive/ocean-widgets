import { assert } from "../assert";

export function inRange(
  data: number,
  { min, max }: { min?: number; max?: number }
) {
  if (min != undefined && max != undefined) {
    assert(min <= max, "max can't less than min");
    return Math.min(max, Math.max(min, data));
  }
  if (min != undefined) {
    return Math.max(min, data);
  }
  if (max != undefined) {
    return Math.min(max, data);
  }
  return data;
}
