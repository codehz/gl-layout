precision mediump float;

uniform sampler2D source;
varying vec2 v_uv;

void main() {
  gl_FragColor = texture2D(source, v_uv);
}