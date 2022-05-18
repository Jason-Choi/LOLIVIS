import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./components/Header";
import Footer from "./components/footer";
import { Main } from "./components/Main";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = /* html */
` 
  ${Header()}
  ${new Main()}
  ${Footer()}
`;
