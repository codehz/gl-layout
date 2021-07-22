import { gl } from "./canvas";

export const quadBuffer = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
// prettier-ignore
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  0, 0,
  1, 0,
  1, 1,
  0, 1
]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
