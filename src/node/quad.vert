precision mediump float;
attribute vec2 uv;
varying vec2 v_uv;
varying vec2 v_ouv;

void main() {
  v_ouv = uv;
  v_uv = uv * vec2(1, -1) + vec2(0, 1);
  gl_Position = vec4(uv * vec2(2, -2) + vec2(-1, 1), 0, 1);
}