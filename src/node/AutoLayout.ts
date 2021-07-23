import { createLayout } from "../layout";
import { GenElement, RenderFn } from "../renderer";

export interface LayoutContext {
  (id: string): [number, number, number, number];
}

const cache = new WeakMap<Array<string>, ReturnType<typeof createLayout>>();

function useCachedLayout(constraints: string[]) {
  if (cache.has(constraints)) {
    return cache.get(constraints)!;
  }
  const layout = createLayout(constraints);
  cache.set(constraints, layout);
  return layout;
}

export default (opts: {
  constraints: string[];
  rect?: [number, number, number, number];
  spacing?: number | number[];
  children: (ifce: LayoutContext) => GenElement;
}) => {
  const layout = useCachedLayout(opts.constraints);
  if (opts.rect) {
    layout.setRect(opts.rect);
  }
  if (opts.spacing != null) {
    layout.setSpacing(opts.spacing);
  }
  return ({
    viewport,
    render,
  }: {
    viewport: [number, number];
    render: RenderFn;
  }) => {
    if (!opts.rect) {
      const [w, h] = viewport;
      layout.setRect([0, 0, w / devicePixelRatio, h / devicePixelRatio]);
    }
    render(opts.children(layout));
  };
};
