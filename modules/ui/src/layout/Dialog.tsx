import {
  Component,
  ComponentEvents,
  ComponentProps,
  component,
  option,
} from "@msom/component";
import { observer } from "@msom/reaction";
import { FuncAble, addStyle } from "@msom/common";
import { MsomElement, JSX, H, MsomNode } from "@msom/dom/jsx-runtime";

type JSXTYPE = FuncAble<Msom.MsomNode, [Dialog]>;

export interface DialogProps extends ComponentProps<JSXTYPE> {
  visibility?: true;
  content?: JSXTYPE;
}
export interface DialogEvents extends ComponentEvents {
  visibilityChange: boolean;
}

@component("dialog", {
  events: {
    visibilityChange: "boolean",
  },
})
export class Dialog extends Component<DialogProps, DialogEvents> {
  @option()
  @observer()
  declare visibility: boolean;
  @option()
  @observer()
  declare content: JSXTYPE;

  setJSX(jsx: JSXTYPE): void {
    this.content = jsx;
  }

  init(): void {
    super.init();
    this.visibility = true;
  }
  render():
    | string
    | number
    | bigint
    | boolean
    | void
    | Function
    | MsomElement<JSX.ElementType, H<JSX.ElementType>>
    | Iterable<MsomNode>
    | null
    | undefined {
    const content =
      typeof this.content === "function" ? this.content(this) : this.content;

    return (
      <div class={[this.getClassName(), "dialog-root"]} style={this.getStyle()}>
        <div class={["dialog-container"]}>{content}</div>
      </div>
    );
  }
}
