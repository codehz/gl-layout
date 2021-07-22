import { gl } from "./canvas";

export function useProgram(vert_src: string, frag_src: string) {
  const program = gl.createProgram()!;
  const vert = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(vert, vert_src);
  gl.compileShader(vert);
  if (!gl.getShaderParameter(vert, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(vert)!);
  }
  const frag = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(frag, frag_src);
  gl.compileShader(frag);
  if (!gl.getShaderParameter(frag, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(frag)!);
  }
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program)!);
  }
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  return program;
}