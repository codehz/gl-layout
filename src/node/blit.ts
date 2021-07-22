import vert from "./quad.vert?raw";
import frag from "./blit.frag?raw";
import { useProgram } from "../loader";
import { gl } from "../canvas";
import { quadBuffer } from "../common";

const program = useProgram(vert, frag);

const attrs = {
  uv: gl.getAttribLocation(program, "uv"),
} as const;

const uniforms = {
  source: gl.getUniformLocation(program, "source"),
} as const;

export default () => (_: {}, prev: WebGLTexture) => {
  gl.useProgram(program);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, prev);
  gl.uniform1i(uniforms.source, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.vertexAttribPointer(attrs.uv, 2, gl.FLOAT, false, 8, 0);
  gl.enableVertexAttribArray(attrs.uv);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
};
