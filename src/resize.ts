import { canvas, gl } from "./canvas";
import { fit as fitFramebuffers } from "./framebuffers";

let currentViewport: [number, number];

let first: ((value: [number, number]) => void) | null = null;

export function viewport() {
  return currentViewport;
}

function fit(entries: ResizeObserverEntry[]) {
  const { width, height } = entries[0].contentRect;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  gl.viewport(0, 0, width * devicePixelRatio, height * devicePixelRatio);
  fitFramebuffers(width * devicePixelRatio, height * devicePixelRatio);
  currentViewport = [Math.floor(width * devicePixelRatio), Math.floor(height * devicePixelRatio)];
  if (first) first([width, height]);
  first = null;
}

new ResizeObserver(fit).observe(document.body);

await new Promise((resolve) => first = resolve);
