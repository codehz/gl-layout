import { gl } from "./canvas";
import { current, swap } from "./framebuffers";
import blit from "./node/blit";
import { viewport } from "./resize";

type PropsType<
  T extends string | typeof nodeList | Function,
> = T extends (obj: infer Props) => JSX.Element ? Omit<Props, "viewport">
  : T extends (obj: infer Props, prev: WebGLTexture) => JSX.Element
    ? Omit<Props, "viewport">
  : T extends () => JSX.Element ? {}
  : string extends T ? any
  : never;

export function createNode<T extends string | typeof nodeList | Function>(
  tag: T,
  props: PropsType<T>,
  ...children: any[]
): JSX.Element {
  if (typeof tag === "function") {
    return tag(props, ...children);
  } else if (tag === nodeList) {
    return () => {
      for (const item of children) {
        render(item);
      }
    };
  } else if (tag === "reset") {
    return () => {
      const color = props?.color ?? [0, 0, 0, 0];
      gl.clearColor(color[0], color[1], color[2], color[3]);
      for (let i = 0; i < 2; i++) {
        const [fb] = current();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.clear(gl.COLOR_BUFFER_BIT);
        swap();
      }
    };
  } else if (tag === "blit") {
    return Object.assign(blit(), { nofb: true });
  }
  throw new Error(`invalid tag ${tag}`);
}

export const nodeList: unique symbol = Symbol("node-list");

declare global {
  namespace JSX {
    interface IntrinsicElements {
      reset: { color?: [number, number, number, number] };
      blit: {};
    }

    interface Element {
      (
        { viewport }: { viewport: [number, number] },
        prev: WebGLTexture,
      ): void;

      nofb?: boolean;
    }
  }
}

export function render(node: JSX.Element) {
  const [fb, tx] = current();
  const vp = viewport();
  if (!node.nofb) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  } else {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  node({ viewport: vp }, tx);
  if (node.length == 2) {
    swap();
  }
}
