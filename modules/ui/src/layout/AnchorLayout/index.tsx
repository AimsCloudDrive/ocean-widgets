import { parseStyle } from "@msom/common";
import { Component, ComponentProps, component, option } from "@msom/component";
import { SingleRef, createSingleRef } from "@msom/dom";
import { computed, observer } from "@msom/reaction";
import {
  AnchorLocation,
  AnchorRectLike,
  Margin,
  Vec,
  parseAnchorLike,
  parseMargin,
  parseRectLike,
} from "./types";

// import "AnchorLayout.less";

export type AnchorLayoutProps = ComponentProps<
  Msom.MsomNode | ((anchor: AnchorLayout) => Msom.MsomNode)
> & {
  target: AnchorRectLike;
  targetAnchor?: AnchorLocation;
  viewport?: AnchorRectLike;
  offset?: Margin;
  contentAnchor?: AnchorLocation;
  contentMargin?: Margin;
  follow?: boolean;
  /**
   * default true = "promote"
   */
  inViewport?: boolean | "symmetric" | "promote";
};

@component("anchor-layout", {})
export class AnchorLayout extends Component<AnchorLayoutProps> {
  @option()
  @observer()
  declare target: AnchorRectLike;
  @option()
  @observer()
  declare targetAnchor?: AnchorLocation;
  @option()
  @observer()
  declare viewport: AnchorRectLike;
  @option()
  @observer()
  declare contentAnchor?: AnchorLocation;
  @option()
  @observer()
  declare contentMargin?: Margin;
  @option()
  @observer()
  declare offset?: Margin;
  @option()
  @observer()
  declare follow: boolean;
  @option()
  @observer()
  declare inViewport: boolean | "symmetric" | "promote";

  @observer()
  declare content: Msom.MsomNode | ((anchor: this) => Msom.MsomNode);

  declare contentRef: SingleRef<HTMLDivElement>;

  init(): void {
    super.init();
    this.contentRef = createSingleRef();
    this.viewport = [0, 0, window.innerWidth, window.innerHeight];
    this.targetAnchor = [0, 0];
    this.contentAnchor = [0, 0];
    this.follow = true;
    this.inViewport = true;
  }
  setJSX(jsx: Msom.MsomNode | (() => Msom.MsomNode)): void {
    this.content = jsx;
  }
  render() {
    const _content =
      typeof this.content === "function" ? this.content(this) : this.content;
    const position = this.position || [0, 0];
    const show = !!this.position;
    return (
      <div
        $ref={this.contentRef}
        class={[this.getClassName(), "anchor-layout"]}
        style={
          this.getStyle() +
          parseStyle({
            position: "absolute",
            opacity: +show,
            left: position[0],
            top: position[0],
          })
        }
      >
        {_content}
      </div>
    );
  }
  private declare _position: Vec<2> | undefined;
  @computed()
  get position(): Vec<2> | undefined {
    const { content, target, targetAnchor, inViewport, follow } = this;
    const { viewport, contentAnchor, contentMargin, contentRef, offset } = this;
    const { _position: prevPosition } = this;

    if (!content || !contentRef.data) {
      return;
    }
    try {
      // rect Vec<4>
      const t = parseRectLike(target);
      const c = parseRectLike(contentRef.data);
      const v = parseRectLike(viewport);
      // anchor Vec<2>
      const tA = (
        targetAnchor
          ? targetAnchor.map((anchorLike, i) =>
              parseAnchorLike(anchorLike, t[i + 2])
            )
          : [0, 0]
      ) as Vec<2>;
      const cA = (
        contentAnchor
          ? contentAnchor.map((anchorLike, i) =>
              parseAnchorLike(anchorLike, c[i + 2])
            )
          : [0, 0]
      ) as Vec<2>;
      // margin Vec<2>
      const cM = parseMargin(contentMargin);
      // offset
      const o = parseMargin(offset);

      let _position = (prevPosition ? [...prevPosition] : [0, 0]) as Vec<2>;

      /**
       * 计算
       * 1. 保证content在viewport之内
       * 2. 当content超出viewport, 根据用户选择对称或者挤压
       * 2.1 用户选择对称则以target锚点位置的相应坐标为对称轴对称到另一边，如仍然超出，则不对称到另一边并进入2.3
       * 2.3 选择挤压，则是超出viewport后，强制content回到viewport之中如content横向上是x为1800，width为300，viewport的x为0，
       *        width为1920，则挤压之后content的横向坐标x就为1920-300 = 1620，width不变
       *        如果挤压后content的定位坐标为负数，则回到0
       * 3.3 如果用户配置follow为false，则第一次prevPostion没值正常计算，后续则直接使用原定位
       *        follow不影响content超出viewport后的计算部分，即follow只影响计算content根据配置应该在什么位置，
       *        但实际在什么位置，后续结合viewport部分仍需计算
       */
      if (follow || !prevPosition) {
        // target + targetAnchor + offset - (contentAnchor + contentMargin)
        // 则为content应该在的位置
        _position[0] = t[0] + tA[0] + o[0] - (cA[0] + cM[0]);
        _position[1] = t[1] + tA[1] + o[1] - (cA[1] + cM[1]);
      }
      if (inViewport !== false) {
        if (inViewport === "symmetric") {
          // 对称模式
          const handle = createInviewSymmetricHandle(
            _position,
            t,
            tA,
            c,
            cM,
            v
          );

          _position[0] = handle(0);
          _position[1] = handle(1);
        } else {
          // inViewport === true | "promote"
          // 挤压模式
          const handle = createInviewPromoteHandle(_position, c, cM, v);
          _position[0] = handle(0);
          _position[1] = handle(1);
        }
      }

      this._position = _position;
      return _position;
    } catch {
      return;
    }
  }
}

function createInviewPromoteHandle(
  position: Vec<2>,
  content: Vec<4>,
  contentMargin: Vec<2>,
  viewport: Vec<4>
): (index: 0 | 1) => number {
  return (index: 0 | 1) => {
    let start = position[index];
    const m = contentMargin[index];
    const dist = content[index + 2] + m * 2;
    const end = start + dist;
    const min = viewport[index];
    const max = min + viewport[index + 2];
    if (end > max) {
      start = max - dist;
    }
    if (start < min) {
      start = min;
    }
    return start;
  };
}
function createInviewSymmetricHandle(
  position: Vec<2>,
  target: Vec<4>,
  targetAnchor: Vec<2>,
  content: Vec<4>,
  contentMargin: Vec<2>,
  viewport: Vec<4>
): (index: 0 | 1) => number {
  return (index) => {
    const tc = target[index] + targetAnchor[index] * target[index + 2];
    let start = position[index];
    const m = contentMargin[index];
    const dist = content[index + 2] + m * 2;
    const end = start + dist;
    const min = viewport[index];
    const max = min + viewport[index + 2];
    if (end > max) {
      start = 2 * tc - end;
    }
    if (start < min) {
      start = position[index];
    }
    return start;
  };
}
