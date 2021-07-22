import vert from "./quad.vert?raw";
import frag from "./rect.frag?raw";
import { useProgram } from "../loader";
import { gl } from "../canvas";

const program = useProgram(vert, frag);

const attrs = {
  uv: gl.getAttribLocation(program, "uv"),
} as const;

const uniforms = {
  color: gl.getUniformLocation(program, "color"),
} as const;

const dynamic = new Float32Array(8);

const buffer = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  dynamic.length * dynamic.BYTES_PER_ELEMENT,
  gl.DYNAMIC_DRAW
);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

function setRect(
  [x0, y0, w0, h0]: [number, number, number, number],
  scale: number,
  [vw, vh]: [number, number]
) {
  const [x, y, w, h] = [
    (x0 * scale) / vw,
    (y0 * scale) / vh,
    (w0 * scale) / vw,
    (h0 * scale) / vh,
  ];
  dynamic[0] = x;
  dynamic[1] = y;
  dynamic[2] = x + w;
  dynamic[3] = y;
  dynamic[4] = x + w;
  dynamic[5] = y + h;
  dynamic[6] = x;
  dynamic[7] = y + h;
}

export default (opts: {
    color: [number, number, number, number];
    rect: [number, number, number, number];
  }) =>
  ({ viewport, scale }: { viewport: [number, number]; scale: number }) => {
    setRect(opts.rect, scale, viewport);
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform4fv(uniforms.color, opts.color);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, dynamic, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(attrs.uv, 2, gl.FLOAT, false, 8, 0);
    gl.enableVertexAttribArray(attrs.uv);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  };
