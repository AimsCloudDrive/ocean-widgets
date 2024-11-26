import {
  defineProperty,
  ClassType,
  isArray,
  parseClass,
  CSSStyle,
  parseStyle,
  getGlobalData,
  setGlobalData,
} from "@ocean/common";
import { IRef, isComponent } from "@ocean/component";
import { createReaction } from "@ocean/reaction";

declare global {
  export namespace Component {
    export interface Context {}
  }
}

const TEXT_NODE = "TEXT_NODE";

type DOMElement<T> = {
  type: T;
  props: {
    $ref?: IRef<any>;
    class?: ClassType;
    context?: Partial<Component.Context>;
  } & {
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

export function createDom(element: DOMElement<any>) {
  // 创建元素
  const dom =
    element.type === TEXT_NODE
      ? document.createTextNode("")
      : document.createElement(element.type as string);
  const isProperty = (p: string) => p !== "children";
  // 给元素赋属性值
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((k) => {
      const d = dom as any;
      let value = element.props[k as keyof DOMElement<any>["props"]];
      if (k === "class") {
        value = parseClass(value as ClassType);
      }
      if (k === "style") {
        value = parseStyle(value as CSSStyle);
      }
      d[k] = value;
    });
  return dom;
}

export function render(element: any, container: HTMLElement) {
  let dom: any = void 0;
  let classInst: any = void 0;
  const cb = () => {
    // 通过配置生成元素
    dom = createDom(element);
    if (classInst) {
      // 类组件实例附着在元素上
      defineProperty(dom, "$owner", 7, classInst);
      defineProperty(dom, "$parent", 7, ((classInst || {}) as any)["$parent"]);
      // 根元素附着在类组件实例上
      classInst.el = dom;
    }
    // 渲染子元素
    if (element.props.children && element.props.children.length > 0) {
      for (const c of element.props.children) {
        render(c, dom);
      }
    }
    // 将根元素添加进父容器
    container.appendChild(dom);
  };
  if (typeof element.type === "function") {
    const props = { ...element.props };
    delete props.children;
    if (isComponent(element.type)) {
      // 类组件
      const _component = getGlobalData("@ocean/component");
      const _rendering = _component.rendering;
      const inst = (classInst = new element.type(props));
      inst.$owner = _rendering;
      inst.$parent = _rendering;
      createReaction(() => {
        try {
          _component.rendering = inst;
          element = inst.render();
          cb();
          inst.rendered();
        } finally {
          _component.rendering = _rendering;
        }
        if (element.props.$ref) {
          const refs: IRef<any>[] = [element.props.$ref].flat();
          refs.forEach((ref) => ref.set(inst));
        }
      });
    } else {
      // 函数组件
      createReaction(() => {
        element = element.type(props);
        cb();
        // 函数组件ref绑定生成的元素
        if (element.props.$ref) {
          const refs: IRef<any>[] = [element.props.$ref].flat();
          refs.forEach((ref) => ref.set(dom));
        }
      });
    }
  } else {
    // 普通元素
    cb();
    if (element.props.$ref) {
      const refs: IRef<any>[] = [element.props.$ref].flat();
      refs.forEach((ref) => ref.set(dom));
    }
  }
}
