import { Nullable, defineProperty, performChunk, isArray } from "@ocean/common";
import { isComponent } from "@ocean/component";

const TEXT_NODE = "TEXT_NODE";

type ClassType =
  | string
  | (string | false | Nullable)[]
  | { [K in string]: boolean };

type DOMElement<T> = {
  type: T;
  props: {
    $ref?: IRef<any>;
    class?: ClassType;
  } & {
    children: DOMElement<any>[];
  };
};

function parseClass(classType: ClassType): string {
  if (typeof classType === "string") return classType;
  if (isArray(classType)) {
    return classType.reduce<string>((c, b) => {
      if (typeof b === "string") {
        return `${c} ${b}`;
      }
      return c;
    }, "");
  }
}

export function createElement(
  type: keyof HTMLElementTagNameMap | string,
  config: {} | null,
  ...children: DOMElement<any>[]
) {
  return {
    type,
    props: {
      ...(config || {}),
      children: children.map((v: any) =>
        v && typeof v === "object" ? v : createTextElement(v)
      ),
    },
  };
}

export function createTextElement(text: string) {
  return {
    type: TEXT_NODE,
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

export function createDom(element: DOMElement<any>) {
  let classInst: any = void 0;
  if (typeof element.type === "function") {
    // 如果是构造函数
    if (isComponent(element.type)) {
      const inst = (classInst = new element.type());
      element = inst.render();
      inst.rendered();
    } else {
      element = element.type();
    }
  }
  const dom =
    element.type === TEXT_NODE
      ? document.createTextNode("")
      : document.createElement(element.type as string);
  const isProperty = (p: string) => p !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((k) => {
      const d = dom as any;
      d[k] = element.props[k as keyof DOMElement<any>["props"]];
    });
  if (element.props.children && element.props.children.length > 0) {
    for (const c of element.props.children) {
      dom.appendChild(createDom(c));
    }
  }
  if (classInst) {
    defineProperty(dom, "$owner", 7, classInst);
    defineProperty(dom, "$parent", 7, ((classInst || {}) as any)["$parent"]);
    classInst.el = dom;
  }
  return dom;
}

export function render(element: any, container: HTMLElement) {
  container.appendChild(createDom(element));
}
