import ReactDOM from "react-dom/client";
import "tailwindcss/tailwind.css";
// import "react-toastify/dist/ReactToastify.css";
import { mount as mountDevTools } from "@latticexyz/dev-tools";
import { App } from "./App";
import { setup } from "./mud/setup";
import { MUDProvider } from "./MUDContext";

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

setup().then((result) => {
  root.render(
    <MUDProvider value={result}>
      <App />
    </MUDProvider>
  );
  mountDevTools();
});
