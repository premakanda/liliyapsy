import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
const root = document.getElementById("root");
if (root) {
  const app = <App path={window.location.pathname} />;
  if (root.querySelector("main")) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
