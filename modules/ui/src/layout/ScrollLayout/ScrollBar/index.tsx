import {
  Component,
  ComponentProps,
  option,
  component,
  ComponentEvents,
} from "@msom/component";
import { createReaction, observer } from "@msom/reaction";
import { Vec2 } from "../../AnchorLayout/types";
import "ScrollBar.less";
import { SingleRef, createSingleRef } from "@msom/dom";

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
  contentSize: number;
  currentPosition: number;
  barPosition?: BarPosition;
};
type ScrollBarEvents = ComponentEvents & {
  positionChange: number;
};

@component("scroll-bar")
export class ScrollBar extends Component<ScrollBarProps, ScrollBarEvents> {
  @option()
  @observer()
  declare aspect: Aspect;
  @option()
  @observer()
  declare contentSize: number;
  @option()
  @observer()
  currentPosition: number;
  @option()
  @observer()
  declare barPosition: BarPosition;

  private declare track: SingleRef<HTMLDivElement>;
  private declare thumb: SingleRef<HTMLDivElement>;

  init() {
    super.init();
    this.aspect = "Vertical";
    this.barPosition = "Normal";
    this.track = createSingleRef();
    this.thumb = createSingleRef();
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
          $ref={this.track}
        >
          <div
            $ref={this.thumb}
            class={["scroll-bar-thumb"]}
            style={{ [this.keys.length]: this.thumbSize }}
          ></div>
        </div>
      </div>
    );
  }
  private get keys() {
    if (this.aspect === "Vertical") {
      return { position: "top", length: "height" };
    } else {
      return {
        position: "left",
        length: "width",
      };
    }
  }
  @observer({ initValue: 0 })
  private declare containerSize: number;
  @observer({ initValue: 0 })
  private declare thumbSize: number;

  update() {
    const { track, thumb } = this;
    if (!track.data || !thumb.data) {
      return;
    }
    const containerRect = this.track.data.getBoundingClientRect();
    this.containerSize = containerRect[this.keys.length];
    this.thumbSize =
      (this.containerSize / this.contentSize) * this.containerSize;
  }
  mounted() {
    this.update();
  }
}
