import vert from "./quad.vert?raw";
import frag from "./card.frag?raw";
import { useProgram } from "../loader";
import { gl } from "../canvas";
import { quadBuffer } from "../common";
import { RenderFn } from "../renderer";

const program = useProgram(vert, frag);

const attrs = {
  uv: gl.getAttribLocation(program, "uv"),
} as const;

const uniforms = {
  prev: gl.getUniformLocation(program, "prev"),
  color: gl.getUniformLocation(program, "color"),
  rect: gl.getUniformLocation(program, "rect"),
  radius: gl.getUniformLocation(program, "radius"),
  scale: gl.getUniformLocation(program, "scale"),
  viewport: gl.getUniformLocation(program, "viewport"),
} as const;

export default (opts: {
    color: [number, number, number, number];
    rect: [number, number, number, number];
    radius: number;
    children?: JSX.Element | JSX.Element[];
  }) =>
  (
    {
      viewport,
      scale,
      render,
    }: { viewport: [number, number]; scale: number; render: RenderFn },
    prev: WebGLTexture
  ) => {
    gl.useProgram(program);
    gl.disable(gl.BLEND);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, prev);
    gl.uniform1i(uniforms.prev, 0);
    gl.uniform4fv(uniforms.color, opts.color);
    gl.uniform4fv(uniforms.rect, opts.rect);
    gl.uniform1f(uniforms.radius, opts.radius);
    gl.uniform1f(uniforms.scale, scale);
    gl.uniform2fv(uniforms.viewport, viewport);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.vertexAttribPointer(attrs.uv, 2, gl.FLOAT, false, 8, 0);
    gl.enableVertexAttribArray(attrs.uv);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    render(opts.children);
  };
