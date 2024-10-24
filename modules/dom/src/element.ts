import { performChunk } from "@ocean/common";

const TEXT_NODE = "TEXT_NODE";

type DOMElement<T> = {
  type: T;
  props: React.ClassAttributes<T> & {
    children: DOMElement<any>[];
  };
};

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

// declare function isComponent(ctor: any): true;

export function createDom(element: DOMElement<any>) {
  if (typeof element.type === "function") {
    // 如果是构造函数
    // if (isComponent(element.type)) {
    const inst = new element.type();
    element = inst.render();
    // }
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
  return dom;
}

export function render(element: DOMElement<any>, container: HTMLElement) {
  container.appendChild(createDom(element));
}
