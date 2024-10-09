import { performChunk } from "@ocean/common";

type DOMElement<T> = Omit<React.ReactElement, "props"> & {
  props: React.ClassAttributes<T> & { children: DOMElement<any>[] };
};

export function createElement<T = any>(
  type: keyof HTMLElementTagNameMap | string,
  config: {} | null,
  ...children: DOMElement<any>[]
) {
  console.info(type, config, children);

  return {
    type,
    props: {
      ...(config || {}),
      children: Array.isArray(children)
        ? children.map((v) =>
            v && typeof v === "object" ? v : createTextElement(v)
          )
        : children,
    },
  };
}

export function createTextElement(text: string) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

export function render(
  element: DOMElement<any>,
  container: { appendChild: (...args: any[]) => any }
) {
  function _render(
    element: DOMElement<any>,
    container: { appendChild: (...args: any[]) => any },
    tasks: (() => void)[] = []
  ) {
    const dom =
      element.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(element.type as string);
    const isProperty = (p: string) => p !== "children";
    Object.keys(element.props)
      .filter(isProperty)
      .forEach((k) => {
        const d = dom as any;
        d[k] = element.props[k as keyof DOMElement<any>["props"]];
      });
    element.props.children?.forEach((v) => _render(v, dom, tasks));
    tasks.push(() => {
      container.appendChild(dom);
    });
    return tasks;
  }
  performChunk(_render(element, container));
}
