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

export default class HistogramBQ {
    selection: Selection<any, any, any, any>
    valuesB: number[]
    valuesQ: number[]
    valueLength: number
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
        this.valuesB = values[0]
        this.valuesQ = values[1]
        this.valueLength = values.length
        this.size = size
        this.color = [schemeCategory10[1], schemeCategory10[2]]
        this.labels = labels
        this.render()
    }

    render() {
        const valueTrue = this.valuesQ.filter((d, i) => this.valuesB[i] === 1)
        const valueFalse = this.valuesQ.filter((d, i) => this.valuesB[i] === 0)

        const x = scaleLinear()
            .domain([0, max([max(valueFalse) as number, max(valueTrue) as number]) as number])
            .range([0, this.size.width - this.size.margin * 2])

        const xTicks = x.ticks().filter(Number.isInteger)

        const his = bin()
            .value(d => d)
            .domain(x.domain() as [number, number])
            .thresholds(xTicks)

        const y = scaleLinear()
            .domain([0, max(his(this.valuesQ), d => d.length) as number])
            .range([this.size.height - this.size.margin * 2, 0])

        const hisDatas = his(this.valuesQ)
        const xWidth = x(hisDatas[0].x1 as number) - x(hisDatas[0].x0 as number)
        const isOrdinal =
            new Set(this.valuesQ).size === hisDatas.length ||
            this.labels[0].includes("Inhibitor Kills")

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

        //x axis label with label[1]
        this.selection
            .append("text")
            .attr(
                "transform",
                `translate(${this.size.width / 2}, ${this.size.height - this.size.margin * 0.4})`
            )
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("fill", "white")
            .text(this.labels[1])

        //y axis label with "# Games"
        this.selection
            .append("text")
            .attr("transform", `translate(${this.size.margin / 2}, ${this.size.margin * 0.8})`)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("fill", "white")
            .text("# Games")

        // True bars
        this.selection
            .selectAll(".barTrue")
            .data(his(valueTrue))
            .join("rect")
            .attr("class", "bar")
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
            .attr("opacity", 0.6)

        // False bars
        this.selection
            .selectAll(".barFalse")
            .data(his(valueFalse))
            .join("rect")
            .attr("class", "bar")
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
            .attr("fill", this.color[1])
            .attr("opacity", 0.6)
    }
}
