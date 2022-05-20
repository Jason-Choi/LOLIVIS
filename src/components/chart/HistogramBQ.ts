import { axisBottom, axisLeft, bin, format, max, scaleLinear, schemeCategory10, Selection } from "d3"

export default class HistogramBQ {
    selection: Selection<any, any, any, any>
    valuesB: number[]
    valuesQ: number[]
    valueLength: number
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
        this.valuesB = values[0]
        this.valuesQ = values[1]
        this.valueLength = values.length
        this.width = width
        this.height = height
        this.margin = margin
        this.color = [schemeCategory10[1], schemeCategory10[5]]
        this.render()
    }

    render() {
        const valueTrue = this.valuesQ.filter((d, i) => this.valuesB[i] === 1)
        const valueFalse = this.valuesQ.filter((d, i) => this.valuesB[i] === 0)

        const x = scaleLinear()
            .domain([0, max([max(valueFalse) as number, max(valueTrue) as number]) as number])
            .range([0, this.width - this.margin * 2])

        const xTicks = x.ticks().filter(Number.isInteger)
        const isOrdinal = xTicks.length !== x.ticks().length

        const his = bin()
            .value((d) => d)
            .domain(x.domain() as [number, number])
            .thresholds(xTicks)

        const y = scaleLinear()
            .domain([0, max(his(this.valuesQ), (d) => d.length) as number])
            .range([this.height - this.margin * 2, 0])

        const hisDatas = his(this.valuesQ)
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
            .call((g) =>
                g
                    .selectAll(".tick")
                    .attr(
                        "transform",
                        (d) => `translate(${x(d as number) + (isOrdinal ? xWidth / 2 : 0)}, 0)`
                    )
            )

        // y axis
        this.selection
            .append("g")
            .attr("transform", `translate(${this.margin}, ${this.margin})`)
            .call(axisLeft(y))

        // True bars
        this.selection
            .selectAll(".barTrue")
            .data(his(valueTrue))
            .join("rect")
            .attr("class", "bar")
            .attr(
                "transform",
                (d) => `translate(${x(d.x0 as number) + this.margin}, ${y(d.length) + this.margin})`
            )
            .attr("width", (d) => x(d.x1 as number) - x(d.x0 as number))
            .attr("height", (d) => {
                return this.height - this.margin * 2 - y(d.length)
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
                (d) => `translate(${x(d.x0 as number) + this.margin}, ${y(d.length) + this.margin})`
            )
            .attr("width", (d) => x(d.x1 as number) - x(d.x0 as number))
            .attr("height", (d) => {
                return this.height - this.margin * 2 - y(d.length)
            })
            .attr("fill", this.color[1])
            .attr("opacity", 0.6)
    }
}
