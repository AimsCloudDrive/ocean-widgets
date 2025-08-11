import { mountComponent } from "@msom/dom";
import { addSample } from "@msom/gallay";
import { createReaction, reactive } from "@msom/reaction";
import { AnchorLayout } from "@msom/ui";

addSample({}, (target, gui) => {
  const container = document.createElement("div");
  container.className = "container";

  const viewport = document.createElement("div");
  viewport.className = "viewport";
  const t = document.createElement("div");
  t.className = "target";
  const anchor = new AnchorLayout({
    target: t,
    targetAnchor: [1, 1],
    offset: [20, 20],
  });
  const offset = reactive([0, 0]);
  createReaction(() => {
    target.style.left = offset[0] + "px";
    target.style.top = offset[1] + "px";
  });
  const mousedownHandle = (emd: MouseEvent) => {
    const { x, y } = emd;
    const _offset = [...offset];
    const moveHandle = (emv: MouseEvent) => {
      const { x: mvx, y: mvy } = emv;
      offset[0] = _offset[0] + mvx - x;
      offset[1] = _offset[1] + mvy - y;
    };
    window.addEventListener("mousemove", moveHandle);
    const upHandle = () => {
      window.removeEventListener("mousemove", moveHandle);
      window.removeEventListener("mouseup", upHandle);
    };
    window.addEventListener("mouseup", upHandle);
  };
  t.addEventListener("mousedown", mousedownHandle);
  viewport.appendChild(t);
  container.appendChild(viewport);
  mountComponent(anchor, viewport);

  target.appendChild(target);
});

const style = document.createElement("style");
style.innerHTML = `
* {
    box-sizing: border-box;
}
.container {
    width: 100vw;
    height: 100vh;
    position: relative;
}
.viewport {
    position: absolute;
    inset: 10%
    border: 1px solid #000;
}
.target {
    width: 10rem;
    height: 10rem;
    cursor: pointer;
    border: 1px solid #000;
}
.follow {
    width: 15rem;
    height: 15rem
    border: 1px solid #000;
}
`;
document.head.appendChild(style);
