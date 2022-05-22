import { axisBottom, axisLeft, format, interpolateYlOrRd, scaleBand, schemeCategory10, Selection } from "d3"
import { Size } from "../../types"

export default class Heatmap {
    selection: Selection<any, any, any, any>
    values: number[]
    labels: string[]
    valueLength: number
    size: Size

    constructor(
        selection: Selection<any, any, any, any>,
        values: number[][],
        labels: string[],
        size: Size
    ) {
        this.selection = selection
        this.values = [
            values[0].filter((x, index) => x === 0 && values[1][index] === 0).length,
            values[0].filter((x, index) => x === 1 && values[1][index] === 0).length,
            values[0].filter((x, index) => x === 0 && values[1][index] === 1).length,
            values[0].filter((x, index) => x === 1 && values[1][index] === 1).length,
        ]
        this.valueLength = values[0].length
        this.size = size
        this.labels = labels
        this.render()
    }

    render() {
        const x = scaleBand()
            .domain([`${this.labels[0]} False`, `${this.labels[0]} True`])
            .range([0, this.size.width - this.size.margin * 2])

        const y = scaleBand()
            .domain([`${this.labels[1]} False`, `${this.labels[1]} True`])
            .range([this.size.height - this.size.margin * 2, 0])

        // x axis
        this.selection
            .append("g")
            .attr("id", "axis-x")
            .attr(
                "transform",
                `translate(${this.size.margin}, ${this.size.height - this.size.margin})`
            )
            .call(axisBottom(x))

        // y axis
        this.selection
            .append("g")
            .attr("id", "axis-y")
            .attr("transform", `translate(${this.size.margin}, ${this.size.margin})`)
            .call(axisLeft(y))
            //roatate 90
            .call(g =>
                g
                    .selectAll("text")
                    .attr("text-anchor", "middle")
                    .attr("transform", `translate(${-this.size.margin / 2} ${-20}) rotate(-90)`)
            )

        // bars
        const binded = this.selection.selectAll("rect").data(this.values)

        binded
            .join("rect")
            .attr("class", "bin")
            .attr(
                "x",
                (_, i) =>
                    (x(
                        i % 2 === 0 ? `${this.labels[0]} False` : `${this.labels[0]} True`
                    ) as number) + this.size.margin
            )
            .attr(
                "y",
                (_, i) =>
                    (y(i < 2 ? `${this.labels[1]} False` : `${this.labels[1]} True`) as number) +
                    this.size.margin
            )
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .attr("fill", schemeCategory10[1])
            .attr("opacity", d => d / this.valueLength)

        binded
            .join("text")
            .attr(
                "x",
                (_, i) =>
                    (x(
                        i % 2 === 0 ? `${this.labels[0]} False` : `${this.labels[0]} True`
                    ) as number) + this.size.margin
            )
            .attr(
                "y",
                (_, i) =>
                    (y(i < 2 ? `${this.labels[1]} False` : `${this.labels[1]} True`) as number) +
                    this.size.margin
            )
            .attr("dx", x.bandwidth() / 2)
            .attr("dy", y.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .text(d => format(".1f")((d / this.valueLength) * 100) + "%")

        this.selection.selectAll("text").attr("font-size", 18).attr("font-weight", 600)

        this.selection.select("#axis-x").selectAll("text").attr("dy", "1.5em")

        this.selection.select("#axis-y").selectAll("text").attr("dx", "-1em")
    }
}
