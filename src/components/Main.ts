import { data } from "../types";
import * as d3 from "d3";

class Main {
    matchData: data;

    constructor() {
        d3.csv("data/matchData.csv").then( (d : any) => {
            this.matchData = d;
            console.log(this.matchData);
        });
    }
}
