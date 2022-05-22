import { axisBottom, axisLeft, max, scaleLinear, Selection, schemeCategory10, format } from "d3"
import { Size } from "../../types"

export default class Scatterplot {
    selection: Selection<any, any, any, any>
    values: { x: number; y: number }[]
    size: Size
    color: readonly string[]
    labels: string[]

    constructor(
        selection: Selection<any, any, any, any>,
        values: number[][],
        labels: string[],
        size: Size
    ) {
        this.selection = selection
        this.values = values[0].map((x, i) => {
            return { x: x, y: values[1][i] }
        })
        this.size = size
        this.color = [schemeCategory10[1], schemeCategory10[2]]
        this.labels = labels
        this.render()
    }

    render() {
        const x = scaleLinear()
            .domain([0, max(this.values, d => d.x) as number])
            .range([0, this.size.width - this.size.margin * 2])

        const xTicks = x.ticks().filter(Number.isInteger)

        const y = scaleLinear()
            .domain([0, max(this.values, d => d.y) as number])
            .range([this.size.height - this.size.margin * 2, 0])

        const yTicks = y.ticks().filter(Number.isInteger)

        // x axis
        this.selection
            .append("g")
            .attr(
                "transform",
                `translate(${this.size.margin}, ${this.size.height - this.size.margin})`
            )
            .call(
                axisBottom(x)
                    .tickValues(xTicks)
                    .tickFormat(d => format("d")(d))
            )
            .call(g => g.selectAll("text").attr("fill", "white").attr("font-size", "14px"))

        // y axis
        this.selection
            .append("g")
            .attr("transform", `translate(${this.size.margin}, ${this.size.margin})`)
            .call(
                axisLeft(y)
                    .tickValues(yTicks)
                    .tickFormat(d => format("d")(d))
            )
            .call(g => g.selectAll("text").attr("fill", "white").attr("font-size", "14px"))

        //x axis label with label[0]
        this.selection
            .append("text")
            .attr(
                "transform",
                `translate(${this.size.width / 2}, ${this.size.height - this.size.margin * 0.4})`
            )
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("fill", "white")
            .text(this.labels[0])

        //y axis label with label[1]
        this.selection
            .append("text")
            .attr("transform", `translate(${this.size.margin * 0.1}, ${this.size.margin * 0.8})`)
            .attr("text-anchor", "start")
            .attr("font-size", "14px")
            .attr("fill", "white")
            .text(this.labels[1])

        // dots
        this.selection
            .selectAll(".dot")
            .data(this.values)
            .join("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.x) + this.size.margin)
            .attr("cy", d => y(d.y) + this.size.margin)
            .attr("r", 3)
            .attr("fill", this.color[0])
            .attr("opacity", 0.5)
    }
}
