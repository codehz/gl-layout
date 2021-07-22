precision mediump float;
uniform sampler2D prev;
uniform vec4 color;
uniform vec4 rect;
uniform float radius;
uniform float scale;
uniform vec2 viewport;
varying vec2 v_uv;
varying vec2 v_ouv;

const float tau = 6.28318530718;

const float blurDirections = 16.0;
const float blurQuality = 4.0;
const float blurSize = 8.0;

vec4 blur(in vec2 uv) {
  vec2 blurRadius = blurSize / viewport * scale;
  vec4 outColor = texture2D(prev, uv);

  for (float d = 0.0; d < tau; d += tau / blurDirections) {
    for (float i = 1.0 / blurQuality; i <= 1.0; i += 1.0 / blurQuality) {
      outColor += texture2D(prev, uv + vec2(cos(d), sin(d)) * blurRadius * i);
    }
  }

  outColor /= blurQuality * blurDirections - 15.0;
  return outColor;
}

float sdRoundRect(vec2 pos, vec2 ext, vec4 cr) {
  vec2 s = step(pos, vec2(0.0));
  float r = mix(mix(cr.y, cr.z, s.y), mix(cr.x, cr.w, s.y), s.x);
  return length(max(abs(pos) + vec2(r) - ext, 0.0)) - r;
}

float aastep(float threshold, float value) {
#ifdef GL_OES_standard_derivatives
  float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
  return smoothstep(threshold - afwidth, threshold + afwidth, value);
#else
  return step(threshold, value);
#endif
}

float inbound(vec2 p, vec2 xy, vec2 wh) {
  float value = -sdRoundRect((p - xy - wh / 2.0), wh / 2.0, vec4(radius));
  return clamp(value, 0.0, 1.0);
}
void main() {
  vec2 xy = rect.xy;
  vec2 wh = rect.zw;
  vec2 ouv = v_ouv * viewport / scale;
  float p = inbound(ouv, xy, wh);
  vec4 ocolor = vec4(color.rgb, 1.0);
  float pa = p * color.a;
  vec4 blur = blur(v_uv);
  gl_FragColor =
      p * (mix(blur, ocolor, color.a)) + (1.0 - p) * texture2D(prev, v_uv);
}