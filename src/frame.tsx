import Card from "./node/Card";
import { gl } from "./canvas";
import { createNode, nodeList, render } from "./renderer";
import Rect from "./node/Rect";
import AutoLayout from "./node/AutoLayout";

let tick = 0;

const constraints = [
  "H:|-[v1,v2]-|",
  "H:|-[v3(v2)]-[v2]-|",
  "V:|-[v1]-[v2..3(v1)]-|",
];

function Demo() {
  return <Card
    color={[0, 1, 1, 0.3]}
    rect={[
      80 * Math.cos(tick * 2) + 120,
      80 * Math.sin(tick * 2) + 120,
      120,
      120,
    ]}
    radius={10}
  >
    <AutoLayout
      rect={[
        80 * Math.cos(tick * 2) + 120,
        80 * Math.sin(tick * 2) + 120,
        120,
        120,
      ]}
      constraints={constraints}
      spacing={10}
    >
      {(layout) =>
        <>
          <Rect
            color={[1, 1, 1, 0.1]}
            rect={layout("v1")}
          />
          <Rect
            color={[1, 1, 1, 0.1]}
            rect={layout("v2")}
          />
          <Rect
            color={[1, 1, 1, 0.1]}
            rect={layout("v3")}
          />
        </>}
    </AutoLayout>
  </Card>;
}

export default () => {
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  render(
    <>
      <reset color={[0, 0, 0, 1]} />
      <Card
        color={[1, 0, 0, 1]}
        rect={[
          100 * Math.sin(tick) + 120,
          100 * Math.cos(tick) + 120,
          120,
          120,
        ]}
        radius={10}
      >
        <Rect
          color={[1, 0, 0, 0.5]}
          rect={[100, 120, 500, 20]}
        />
      </Card>
      <Card
        color={[1, 1, 1, 0.5]}
        rect={[30, 30, 200, 200]}
        radius={10}
      >
        <Rect
          color={[0, 1, 0, 0.2]}
          rect={[40, 40, 50, 50]}
        />
        <Rect
          color={[0, 0, 1, 0.5]}
          rect={[140, 40, 50, 50]}
        />
      </Card>
      <Demo />
      <blit />
    </>,
  );
  tick += 0.01;
};
