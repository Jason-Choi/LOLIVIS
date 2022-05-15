import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./components/Header";
import Footer from "./components/footer";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = /* html */
` 
  ${Header()}
  <div class="container" id="main">
    <div class="row">
      <div class="col-2">
      BLUE TEAM
      </div>
      <div class="col-8">
      MAIN COMPONENTS
      </div>
      <div class="col-2">
      RED TEAM
      </div>
    </div>
  </div>
  ${Footer()}
`;
