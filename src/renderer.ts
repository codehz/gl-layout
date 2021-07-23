import { gl } from "./canvas";
import { current, swap } from "./framebuffers";
import blit from "./node/blit";
import { viewport } from "./resize";

type PropsType<T extends string | typeof nodeList | Function> = T extends (
  obj: infer Props
) => JSX.Element
  ? Omit<Props, "children">
  : T extends (obj: infer Props, prev: WebGLTexture) => JSX.Element
  ? Omit<Props, "children">
  : T extends () => JSX.Element
  ? {}
  : string extends T
  ? any
  : never;

export function createNode<T extends string | typeof nodeList | Function>(
  tag: T,
  props: PropsType<T>,
  ...children: any[]
): JSX.Element {
  if (typeof tag === "function") {
    let additional: { children?: any[] } = {};
    if (children.length <= 1) {
      additional.children = children[0];
    } else {
      additional.children = children;
    }
    const temp = tag({ ...props, ...additional });
    return temp;
  } else if (tag === nodeList) {
    return ({ render }) => {
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
  } else if (tag === "swap") {
    return Object.assign(() => swap(), { nofb: true });
  }
  throw new Error(`invalid tag ${tag}`);
}

export const nodeList: unique symbol = Symbol("node-list");

export type GenElement =
  | undefined
  | false
  | JSX.Element
  | (undefined | false | JSX.Element)[];

export type RenderFn = (node: GenElement) => void;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      reset: { color?: [number, number, number, number] };
      blit: {};
      swap: {};
    }

    interface Element {
      (
        opts: {
          viewport: [number, number];
          scale: number;
          render: RenderFn;
        },
        prev: WebGLTexture
      ): void;

      nofb?: boolean;
    }

    interface ElementChildrenAttribute {
      children: {};
    }
  }
}

export function render(node: GenElement) {
  if (!node) return;
  if (Array.isArray(node)) {
    for (const item of node) {
      render(item);
    }
    return;
  }
  const [fb, tx] = current();
  const vp = viewport();
  if (!node.nofb) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  } else {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  node({ viewport: vp, scale: devicePixelRatio, render }, tx);
  if (node.length == 2) {
    swap();
  }
}
