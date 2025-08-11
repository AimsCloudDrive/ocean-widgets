import {
  Component,
  ComponentProps,
  option,
  component,
  ComponentEvents,
} from "@msom/component";
import { observer } from "@msom/reaction";
import { Vec2 } from "../../AnchorLayout/types";
import "ScrollBar.less";

type Vertical = "Vertical";
type Horizontal = "Horizontal";
type Aspect = Vertical | Horizontal;
type Normal = "Normal";
type Absolute = "Absolute";
type BarPosition = Normal | Absolute;
const Vertical: Vertical = "Vertical";
const Horizontal: Horizontal = "Horizontal";
const Normal: Normal = "Normal";
const Absolute: Absolute = "Absolute";

type ScrollBarProps = ComponentProps & {
  aspect?: Aspect;
  contentSize: number | Vec2;
  currentPosition: number | Vec2;
  barPosition?: BarPosition;
};
type ScrollBarEvents = ComponentEvents & {
  positionChange: Vec2;
};

@component("scroll-bar")
export class ScrollBar extends Component<ScrollBarProps, ScrollBarEvents> {
  @option()
  @observer()
  declare aspect: Aspect;
  @option()
  @observer()
  declare contentSize: Vec2;
  @option()
  @observer()
  currentPosition: Vec2;
  @option()
  @observer()
  declare barPosition: BarPosition;
  init() {
    super.init();
    this.aspect = "Vertical";
    this.barPosition = "Normal";
  }

  render() {
    return (
      <div class={[this.getClassName(), "scroll-bar"]} style={this.getStyle()}>
        <div
          class={[
            "scroll-bar-track",
            this.aspect.toLocaleLowerCase(),
            this.barPosition.toLocaleLowerCase(),
          ]}
        >
          <div class={["scroll-bar-thumb"]}></div>
        </div>
      </div>
    );
  }
}
