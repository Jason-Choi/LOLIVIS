import { data } from "../types";
import * as d3 from "d3";

export class Main {
    matchData: data;
    correlationData : data;

    constructor() {
        d3.csv(
            "https://raw.githubusercontent.com/Jason-Choi/lol/master/data.csv"
        ).then((d: any) => {
            this.matchData = d;
            
        });

        
    }
}

const template = /* html */ `
    <div class="container" id="main">
        <div class="row">
            <div class="col-2">
                BLUE TEAM
            </div>
            <div class="col-8">
                Main
            </div>
            <div class="col-2">
                RED TEAM
            </div>
        </div>
    </div>
`;
