import "./style.css"
import "bootstrap/dist/css/bootstrap.min.css"

import Header from "./components/Header"
import Footer from "./components/Footer"
import { Main } from "./components/Main"
import { SideBar } from "./components/SideBar"
import { csv } from "d3"

async function initialize() {
    const matchData = await csv("https://raw.githubusercontent.com/Jason-Choi/lol/master/data.csv")
    const correlationData = await csv(
        "https://raw.githubusercontent.com/Jason-Choi/LOLIVIS/master/corr.csv"
    )

    const app = document.querySelector<HTMLDivElement>("#app")!
    app.innerHTML =
        /* html */
        `  ${Header()}
        <div class="container" id="main">
            <div class="row">
                <div class="col-2 section" id="blueCorr">

                </div>
                <div class="col-8 section" id="mainVis">
                    
                </div>
                <div class="col-2 section" id="redCorr">
                    
                </div>
            </div>
        </div> 
        ${Footer()}
    `

    const main = new Main("mainVis", matchData)
    const redCorr = new SideBar("red", correlationData, main)
    const blueCorr = new SideBar("blue", correlationData, main)
}

initialize()
