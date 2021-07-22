import "./resize";
import "./style.css";

import frame from "./frame";

function raf() {
  frame();
  requestAnimationFrame(raf);
}

raf();
