import { axisBottom, axisLeft, format, interpolateYlOrRd, scaleBand, Selection } from "d3"

export default class Heatmap {
    selection: Selection<any, any, any, any>
    values: number[]
    valueLength: number
    width: number
    height: number
    margin: number

    constructor(
        selection: Selection<any, any, any, any>,
        values: number[][],
        width: number,
        height: number,
        margin: number
    ) {
        this.selection = selection
        this.values = [
            values[0].filter((x, index) => x === 0 && values[1][index] === 0).length,
            values[0].filter((x, index) => x === 1 && values[1][index] === 0).length,
            values[0].filter((x, index) => x === 0 && values[1][index] === 1).length,
            values[0].filter((x, index) => x === 1 && values[1][index] === 1).length,
        ]
        this.valueLength = values[0].length
        this.width = width
        this.height = height
        this.margin = margin
        this.render()
    }

    render() {
        const x = scaleBand()
            .domain(["False", "True"])
            .range([0, this.width - this.margin * 2])

        const y = scaleBand()
            .domain(["False", "True"])
            .range([this.height - this.margin * 2, 0])

        // x axis
        this.selection
            .append("g")
            .attr("id", "axis-x")
            .attr("transform", `translate(${this.margin}, ${this.height - this.margin})`)
            .call(axisBottom(x))

        // y axis
        this.selection
            .append("g")
            .attr("id", "axis-y")
            .attr("transform", `translate(${this.margin}, ${this.margin})`)
            .call(axisLeft(y))

        // bars
        const binded = this.selection.selectAll("rect").data(this.values)

        binded
            .join("rect")
            .attr("class", "bin")
            .attr("x", (_, i) => (x(i % 2 === 0 ? "False" : "True") as number) + this.margin)
            .attr("y", (_, i) => (y(i < 2 ? "False" : "True") as number) + this.margin)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .attr("fill", (d) => interpolateYlOrRd(d / this.valueLength))

        binded
            .join("text")
            .attr("x", (_, i) => (x(i % 2 === 0 ? "False" : "True") as number) + this.margin)
            .attr("y", (_, i) => (y(i < 2 ? "False" : "True") as number) + this.margin)
            .attr("dx", x.bandwidth() / 2)
            .attr("dy", y.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .text((d) => format(".1f")((d / this.valueLength) * 100) + "%")

        this.selection.selectAll("text").attr("font-size", 18).attr("font-weight", 600)

        this.selection.select("#axis-x").selectAll("text").attr("dy", "1.5em")

        this.selection.select("#axis-y").selectAll("text").attr("dx", "-1em")
    }
}
