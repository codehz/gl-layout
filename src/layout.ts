import lib from "@lume/autolayout";

export function createLayout(vfl: string[]) {
  const view = new lib.View({
    constraints: lib.VisualFormat.parse(vfl, { extended: true }),
  });
  let offsets = [0, 0] as [number, number];
  return Object.assign(
    (id: string): [number, number, number, number] => {
      const { left, top, width, height } = (view.subViews as any)[id] as {
        left: number;
        top: number;
        width: number;
        height: number;
      };
      return [left + offsets[0], top + offsets[1], width, height];
    },
    {
      view,
      setRect([x, y, w, h]: [number, number, number, number]) {
        offsets = [x, y];
        view.setSize(w, h);
      },
      setSpacing(spacing: number | number[]) {
        view.setSpacing(spacing);
      },
    }
  );
}
