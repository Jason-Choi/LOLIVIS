import * as d3 from "d3";
import { Selection } from "d3";
import { data } from "../types";



export class Main {
    id: string;
    selection : Selection<any, any, any, any>;
    margins = { top: 30, bottom : 30, left : 30, right : 30 };
    datas : data[];

    constructor(id: string, datas) {
        this.id = id;
        this.selection = d3.select("#" + id);
        this.datas = datas;
    }
}