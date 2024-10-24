export const CONTEXT: {
  creating?: any;
} = {};

export const COMPONENTNAME_KEY = Symbol("component");

export const COMPONENT_Map = new Map<string, any>();

export function isComponent(ctor: any) {
  const name = ctor[COMPONENTNAME_KEY];
  if (name == undefined) {
    return false;
  }
  if (!!COMPONENT_Map.get(name)) {
    return true;
  }
  return false;
}
