/* @refresh reload */
import { render } from "solid-js/web";

import Router from "./Router";
import "./index.css"
render(() => <Router />, document.getElementById("root") as HTMLElement);
