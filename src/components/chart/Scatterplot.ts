import { axisBottom, axisLeft, max, scaleLinear, Selection, schemeCategory10 } from "d3"

export default class Scatterplot {
    selection: Selection<any, any, any, any>
    values: { x: number; y: number }[]
    width: number
    height: number
    margin: number
    color: readonly string[]

    constructor(
        selection: Selection<any, any, any, any>,
        values: number[][],
        width: number,
        height: number,
        margin: number
    ) {
        this.selection = selection
        this.values = values[0].map((x, i) => {
            return { x: x, y: values[1][i] }
        })
        this.width = width
        this.height = height
        this.margin = margin
        this.color = [schemeCategory10[1], schemeCategory10[2]]
        this.render()
    }

    render() {
        const x = scaleLinear()
            .domain([0, max(this.values, (d) => d.x) as number])
            .range([0, this.width - this.margin * 2])

        const y = scaleLinear()
            .domain([0, max(this.values, (d) => d.y) as number])
            .range([this.height - this.margin * 2, 0])

        // x axis
        this.selection
            .append("g")
            .attr("transform", `translate(${this.margin}, ${this.height - this.margin})`)
            .call(axisBottom(x))
            .call((g) => g.selectAll("text").attr("fill", "white").attr("font-size", "14px"))

        // y axis
        this.selection
            .append("g")
            .attr("transform", `translate(${this.margin}, ${this.margin})`)
            .call(axisLeft(y))
            .call((g) => g.selectAll("text").attr("fill", "white").attr("font-size", "14px"))

        // dots
        this.selection
            .selectAll(".dot")
            .data(this.values)
            .join("circle")
            .attr("class", "dot")
            .attr("cx", (d) => x(d.x) + this.margin)
            .attr("cy", (d) => y(d.y) + this.margin)
            .attr("r", 3)
            .attr("fill", this.color[0])
            .attr("opacity", 0.5)
    }
}
