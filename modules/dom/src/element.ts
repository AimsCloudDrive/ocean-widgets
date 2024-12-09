import {
  defineProperty,
  ClassType,
  isArray,
  parseClass,
  CSSStyle,
  parseStyle,
  getGlobalData,
  setGlobalData,
  JSTypes,
  Event,
} from "@ocean/common";
import { IRef, isComponent, Component } from "@ocean/component";
import { createReaction } from "@ocean/reaction";
import { mountComponent } from "./mount";

declare global {
  export namespace Component {
    export interface Context {}
  }
}
HTMLDivElement;

const TEXT_NODE = "TEXT_NODE";

type DOMElement<T> = {
  type: T;
  props: Omit<React.HTMLAttributes<T>, "style" | "children"> & {
    $ref?: IRef<any>;
    $key?: string | number;
    style?: CSSStyle;
    class?: ClassType;
    context?: Partial<Component.Context>;
    $_id: string | number;
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
  const {
    children,
    class: _class,
    style,
    $key,
    $ref,
    context,
    ...props
  } = element.props;
  // 创建元素
  const dom =
    element.type === TEXT_NODE
      ? document.createTextNode("")
      : document.createElement(element.type as string);
  // 给元素赋属性值
  // 处理class
  if (_class) {
    props.className = `${parseClass(_class)} ${props.className || ""}`.trim();
  }
  // 处理style
  if (style) {
    Object.assign(props, { style: parseStyle(style) });
  }
  Object.assign(dom, props);
  return dom;
}

export function render(element: any, container: HTMLElement) {
  let dom: any = void 0;
  let classInst: Component<any> | undefined = void 0;
  const cb = () => {
    // 通过配置生成元素
    dom = createDom(element);
    if (classInst) {
      // 类组件实例附着在元素上
      defineProperty(dom, "$owner", 7, classInst);
      defineProperty(dom, "$parent", 7, ((classInst || {}) as any)["$parent"]);
      // 根元素附着在类组件实例上
      classInst.el = dom;
      mountComponent(classInst, container);
    } else {
      container.appendChild(dom);
    }
    // 渲染子元素
    if (element.props.children && element.props.children.length > 0) {
      for (const c of element.props.children) {
        render(c, dom);
      }
    }
  };
  if (typeof element.type === "function") {
    const { children, ...props } = element.props;
    if (isComponent(element.type)) {
      // 类组件
      const _component = getGlobalData("@ocean/component");
      const _rendering = _component.rendering;
      const inst: Component<any, any> = (classInst = new element.type(props));
      // 处理传递的子元素
      if (children && children.length > 0) {
        const c = children[0];
        if (c.type === TEXT_NODE && typeof c.props.nodeValue === "function") {
          inst.setJSX(c.props.nodeValue);
        } else {
          inst.setJSX(children.length > 1 ? children : children[0]);
        }
      }
      // 监听自定义的事件
      const _events: Record<
        string,
        {
          type: JSTypes;
          _on?: (event: any, type: string, slef: Event<any>) => void;
        }
      > = inst[_component.componentEventsKey];
      if (_events) {
        Object.entries(_events).forEach(([k, event]) => {
          // 原来已经绑定 则解绑
          if (event._on) {
            inst.un(k, event._on);
            event._on = undefined;
          }
          // 绑定新事件
          const on = props[k];
          if (on) {
            inst.on(k, on);
            event._on = on;
          }
        });
      }

      inst.$owner = _rendering;
      inst.$parent = _rendering;
      createReaction(() => {
        try {
          _component.rendering = inst;
          element = inst.render();
          cb();
          // cb执行完，真实生成的dom已经存在，将类组件实例附着在dom上
          if (props.$ref) {
            const refs: IRef<any>[] = [props.$ref].flat();
            refs.forEach((ref) => ref.set(inst));
          }
          inst.rendered();
        } finally {
          _component.rendering = _rendering;
        }
      });
    } else {
      // 函数组件
      createReaction(() => {
        element = element.type(props);
        cb();
        // 函数组件ref绑定生成的元素
        if (props.$ref) {
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
  return dom;
}
