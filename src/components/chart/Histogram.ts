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

export default class Histogram {
    selection: Selection<any, any, any, any>
    values: number[]
    valueLength: number
    width: number
    height: number
    margin: number
    color: readonly string[]

    constructor(
        selection: Selection<any, any, any, any>,
        values: number[],
        width: number,
        height: number,
        margin: number
    ) {
        this.selection = selection
        this.values = values
        this.valueLength = values.length
        this.width = width
        this.height = height
        this.margin = margin
        this.color = [schemeCategory10[1], schemeCategory10[2]]
        this.render()
    }

    render() {
        const x = scaleLinear()
            .domain([0, max(this.values, d => d) as number])
            .range([0, this.width - this.margin * 2])

        const xTicks = x.ticks().filter(Number.isInteger)
        const isOrdinal = xTicks.length !== x.ticks().length

        const his = bin()
            .value(d => d)
            .domain(x.domain() as [number, number])
            .thresholds(xTicks)

        const y = scaleLinear()
            .domain([0, max(his(this.values), d => d.length) as number])
            .range([this.height - this.margin * 2, 0])

        const hisDatas = his(this.values)
        const xWidth = x(hisDatas[0].x1 as number) - x(hisDatas[0].x0 as number)

        // x axis
        this.selection
            .append("g")
            .attr("transform", `translate(${this.margin}, ${this.height - this.margin})`)
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
            .attr("transform", `translate(${this.margin}, ${this.margin})`)
            .call(axisLeft(y))
            .call(g => g.selectAll("text").attr("fill", "white").attr("font-size", "14px"))

        // bars
        this.selection
            .selectAll(".bar")
            .data(his(this.values))
            .join("rect")
            .attr("class", "bar")
            .attr("opacity", 0.5)
            .attr(
                "transform",
                d => `translate(${x(d.x0 as number) + this.margin}, ${y(d.length) + this.margin})`
            )
            .attr("width", d => x(d.x1 as number) - x(d.x0 as number))
            .attr("height", d => {
                return this.height - this.margin * 2 - y(d.length)
            })
            .attr("fill", this.color[0])
    }
}
