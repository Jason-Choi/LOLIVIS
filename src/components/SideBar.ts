import {
    Selection,
    select,
    ScaleLinear,
    scaleLinear,
    interpolateBlues,
    interpolateReds,
    format,
    DSVRowArray,
} from "d3"
import { Attribute } from "../types"
import { Main } from "./Main"

const blueColorScheme = scaleLinear([-0.5, 1], ["black", interpolateBlues(1)])
const redColorScheme = scaleLinear([-0.5, 1], ["black", interpolateReds(1)])
const height = 750
const width = 220
const padding = 6
const fontSize = 12

// function that seperates camelCase to words
function camelCaseToWords(str: string) {
    const strs = str.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
        return str.toUpperCase()
    })
    return strs.replace("Blue", "").replace("Red", "")
}

export class SideBar {
    teamColor: string
    selection: Selection<any, any, any, any>
    data: Attribute[]
    colorScheme: ScaleLinear<string, string, never>
    boxHeight: number
    main: Main

    constructor(teamColor: string, correlationData: DSVRowArray<string>, main: Main) {
        this.teamColor = teamColor
        this.selection = select(`#${teamColor}Corr`).append("svg")
        this.selection.attr("width", width).attr("height", 900)
        this.main = main

        this.colorScheme = teamColor === "blue" ? blueColorScheme : redColorScheme
        const fullData = correlationData[teamColor == "blue" ? 2 : 26]
        this.data = []
        for (const index in fullData) {
            if (index.includes(teamColor))
                this.data.push({
                    name: index,
                    value: Number(fullData[index]),
                })
        }
        this.boxHeight = height / this.data.length
        this.data.sort((a, b) => b.value - a.value)
        this.render()
    }

    render() {
        this.selection
            .selectAll("rect")
            .data(this.data)
            .join("rect")
            .attr("id", (d) => `rect-${d.name}`)
            .attr("x", 10)
            .attr("y", (_, i) => i * (this.boxHeight + padding))
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("width", width - 20)
            .attr("height", this.boxHeight)
            .attr("fill", (d, _) => this.colorScheme(d.value))
            .on("click", (_, d) => {
                const result = this.main.selectAttribute(d.name)
                console.log(result)
                if (result === "added") {
                    select(`#rect-${d.name}`).attr("stroke", "white")
                } else if (result === "removed") {
                    select(`#rect-${d.name}`).attr("stroke", "none")
                }
            })

        this.selection
            .selectAll(".corr")
            .data(this.data)
            .join("text")
            .attr("class", "corr")
            .attr("x", 20)
            .attr("y", (_, i) => i * (this.boxHeight + padding) + this.boxHeight / 2)
            .attr("text-anchor", "start")
            .attr("dominant-baseline", "middle")
            .text((d) => `${camelCaseToWords(d.name)}`)
            .attr("font-size", fontSize)
            .attr("fill", "white")
            .attr("font-weight", 600)

        this.selection
            .selectAll(".attr")
            .data(this.data)
            .join("text")
            .attr("class", "attr")
            .attr("x", 220 - 20)
            .attr("y", (_, i) => i * (this.boxHeight + padding) + this.boxHeight / 2)
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .text((d) => `${format(".2f")(d.value)}`)
            .attr("font-size", fontSize)
            .attr("fill", "white")
            .attr("font-weight", 600)
    }
}
