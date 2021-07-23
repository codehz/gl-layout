import "./resize";
import "./style.css";

import frame from "./frame";

function raf() {
  if (document.visibilityState == "visible") frame();
  requestAnimationFrame(raf);
}

raf();
