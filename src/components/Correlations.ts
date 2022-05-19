import { Selection, select, ScaleLinear, scaleLinear, interpolateBlues, interpolateReds, format, selectAll } from "d3";
import { correlations } from "../types";
import { Main } from "./Main";

const blueColorScheme = scaleLinear([-1, 1], [interpolateBlues(0), interpolateBlues(1)])
const redColorScheme = scaleLinear([-1, 1], [interpolateReds(0), interpolateReds(1)]) 
const height = 750;
const width = 220;


interface Attribute {
    name : string;
    value : number;
}

export class Correlations {
    teamColor: string;
    selection: Selection<any, any, any, any>;
    data : Attribute[];
    colorScheme : ScaleLinear<string, string, never>;
    boxHeight : number;

    constructor(teamColor: string, correlationData : correlations[], main: Main) {
        this.teamColor = teamColor;
        this.selection = select(`#${teamColor}Corr`).append("svg")
        this.selection.attr("width", "100%").attr("height", 800);
        
        this.colorScheme = teamColor === 'blue' ? blueColorScheme : redColorScheme;
        const fullData = correlationData[teamColor == 'blue' ? 2 : 26]
        this.data = []  
        for (const index in fullData) {
            if (index.includes(teamColor)) this.data.push({
                name: index,
                value: Number(fullData[index])
            })
        }
        this.boxHeight = height / this.data.length;
        this.data.sort((a, b) => b.value - a.value)
        this.render()
        
        
    }

    render() {
        this.selection
            .selectAll("rect")
            .data(this.data)
            .join("rect")
            .attr("x", 0)
            .attr("y", (_, i) => i * this.boxHeight)
            .attr("width", width)
            .attr("height", this.boxHeight)
            .attr("fill", (d, _) => this.colorScheme(d.value))

        this.selection
            .selectAll("text")
            .data(this.data)
            .join("text")
            .attr("x", width / 2-10)
            .attr("y", (_, i) => i * this.boxHeight + this.boxHeight / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text((d) => format(".2f")(d.value))
            .attr("font-size", "12px")
            .attr("fill", "white")
            .attr("font-weight", 600)

    }
}
