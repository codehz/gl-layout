export const canvas = document.createElement("canvas");
export const gl = canvas.getContext("webgl", {
  premultipliedAlpha: false,
})!;

document.body.appendChild(canvas);
