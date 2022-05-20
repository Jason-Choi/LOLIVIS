import { DSVRowArray, Selection, select } from "d3"
import PieChart from "./chart/PieChart"
import Histogram from "./chart/Histogram"
import Scatterplot from "./chart/Scatterplot"
import Heatmap from "./chart/Heatmap"
import HistogramBQ from "./chart/HistogramBQ"

const width = 880
const height = 700

const margin = 80

export class Main {
    id: string
    selection: Selection<any, any, any, any>
    datas: DSVRowArray<string>
    selectedAttributes: string[] = []

    constructor(id: string, datas: DSVRowArray<string>) {
        this.id = id
        this.selection = select("#" + id)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
        this.datas = datas
        this.render()
    }

    render() {
        if (this.selectedAttributes.length === 0) {
            this.selection.selectAll("*").remove()
            this.selection
                .append("image")
                .attr(
                    "href",
                    "https://raw.githubusercontent.com/Jason-Choi/LOLIVIS/master/logo.svg"
                )
                .attr("width", width / 2)
                .attr("x", width / 4)
                .attr("y", height / 2 - 200)

            this.selection
                .append("text")
                .attr("x", width / 2)
                .attr("y", height / 2 + 100)
                .attr("font-size", "30px")
                .attr("text-anchor", "middle")
                .attr("font-weight", 600)
                .attr("fill", "white")
                .text("← Select one or two attributes to visualize! →")
        } else {
            this.selection.selectAll("*").remove()
            const values = this.selectedAttributes.map((attr) => this.getValues(attr))
            const setValues = values.map((value) => new Set(value).size)
            if (values.length === 2) {
                if (setValues.filter((value) => value === 2).length === 2) {
                    new Heatmap(this.selection, values, width, height, margin)
                    console.log("BB")
                } else if (setValues.filter((value) => value === 2).length === 1) {
                    const tmpValues = [
                        values[setValues.indexOf(2)],
                        values[1 - setValues.indexOf(2)],
                    ]
                    new HistogramBQ(this.selection, tmpValues, width, height, margin)
                    console.log("BQ")
                } else {
                    new Scatterplot(this.selection, values, width, height, margin)
                    console.log("QQ")
                }
            } else {
                if (setValues[0] == 2) {
                    new PieChart(this.selection, values[0], width, height, margin)
                    console.log("B")
                } else {
                    new Histogram(this.selection, values[0], width, height, margin)
                    console.log("Q")
                }
            }
        }
    }

    selectAttribute(attributeName: string): string {
        let result = ""
        if (this.selectedAttributes.includes(attributeName)) {
            this.selectedAttributes = this.selectedAttributes.filter(
                (attr) => attr !== attributeName
            )
            result = "removed"
        } else {
            if (this.selectedAttributes.length < 3) {
                this.selectedAttributes.push(attributeName)
                result = "added"
            } else result = "none"
        }
        this.render()
        console.log(this.selectedAttributes)
        return result
    }

    checkAttribute(attributeName: string) {
        return this.selectedAttributes.includes(attributeName)
    }

    getValues(attributeName: string) {
        return this.datas.map((data) => data[attributeName]).map((d) => Number(d))
    }
}
