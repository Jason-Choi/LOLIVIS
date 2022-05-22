import {
    axisBottom,
    axisLeft,
    bin,
    format,
    max,
    scaleLinear,
    schemeCategory10,
    Selection,
} from "d3"
import { Size } from "../../types"

export default class Histogram {
    selection: Selection<any, any, any, any>
    values: number[]
    valueLength: number
    size: Size
    color: readonly string[]
    labels: string[]

    constructor(
        selection: Selection<any, any, any, any>,
        values: number[],
        labels: string[],
        size: Size
    ) {
        this.selection = selection
        this.values = values
        this.valueLength = values.length
        this.size = size
        this.color = [schemeCategory10[1], schemeCategory10[2]]
        this.labels = labels
        this.render()
    }

    render() {
        const x = scaleLinear()
            .domain([0, max(this.values, d => d) as number])
            .range([0, this.size.width - this.size.margin * 2])

        const xTicks = x.ticks().filter(Number.isInteger)
        const isOrdinal = xTicks.length !== x.ticks().length

        const his = bin()
            .value(d => d)
            .domain(x.domain() as [number, number])
            .thresholds(xTicks)

        const y = scaleLinear()
            .domain([0, max(his(this.values), d => d.length) as number])
            .range([this.size.height - this.size.margin * 2, 0])

        const hisDatas = his(this.values)
        const xWidth = x(hisDatas[0].x1 as number) - x(hisDatas[0].x0 as number)

        // x axis
        this.selection
            .append("g")
            .attr(
                "transform",
                `translate(${this.size.margin}, ${this.size.height - this.size.margin})`
            )
            .call(
                axisBottom(x)
                    .tickValues(xTicks.slice(0, xTicks.length - (isOrdinal ? 1 : 0)))
                    .tickFormat(format("d"))
            )
            .call(g =>
                g
                    .selectAll(".tick")
                    .attr(
                        "transform",
                        d => `translate(${x(d as number) + (isOrdinal ? xWidth / 2 : 0)}, 0)`
                    )
            )
            .call(g => g.selectAll("text").attr("fill", "white").attr("font-size", "14px"))

        // y axis
        this.selection
            .append("g")
            .attr("transform", `translate(${this.size.margin}, ${this.size.margin})`)
            .call(axisLeft(y))
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

        //y axis label with "# Games"
        this.selection
            .append("text")
            .attr("transform", `translate(${this.size.margin / 2}, ${this.size.margin * 0.8})`)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("fill", "white")
            .text("# Games")

        // bars
        this.selection
            .selectAll(".bar")
            .data(his(this.values))
            .join("rect")
            .attr("class", "bar")
            .attr("opacity", 0.5)
            .attr(
                "transform",
                d =>
                    `translate(${x(d.x0 as number) + this.size.margin}, ${
                        y(d.length) + this.size.margin
                    })`
            )
            .attr("width", d => x(d.x1 as number) - x(d.x0 as number))
            .attr("height", d => {
                return this.size.height - this.size.margin * 2 - y(d.length)
            })
            .attr("fill", this.color[0])
    }
}
