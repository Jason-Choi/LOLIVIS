import { axisBottom, axisLeft, max, scaleLinear, Selection, schemeCategory10 } from "d3"

export default class Scatterplot {
    selection: Selection<any, any, any, any>
    valueX: number[]
    valueY: number[]
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
        this.valueX = values[0]
        this.valueY = values[1]
        this.width = width
        this.height = height
        this.margin = margin
        this.color = [schemeCategory10[1], schemeCategory10[2]]
        this.render()
    }

    render() {
        const x = scaleLinear()
            .domain([0, max(this.valueX) as number])
            .range([0, this.width - this.margin * 2])

        const y = scaleLinear()
            .domain([0, max(this.valueY) as number])
            .range([this.height - this.margin * 2, 0])

        // x axis
        this.selection
            .append("g")
            .attr("transform", `translate(${this.margin}, ${this.height - this.margin})`)
            .call(axisBottom(x))

        // y axis
        this.selection
            .append("g")
            .attr("transform", `translate(${this.margin}, ${this.margin})`)
            .call(axisLeft(y))

        // dots
        this.selection
            .selectAll(".dot")
            .data(this.valueX)
            .join("circle")
            .attr("class", "dot")
            .attr("cx", (d) => x(d) + this.margin)
            .attr("cy", (d) => y(this.valueY[this.valueX.indexOf(d)]) + this.margin)
            .attr("r", 3)
            .attr("fill", this.color[0])
            .attr("opacity", 0.5)

        
    }
}
