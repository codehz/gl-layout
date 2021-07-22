export const canvas = document.createElement("canvas");
export const gl = canvas.getContext("webgl")!;

document.body.appendChild(canvas);