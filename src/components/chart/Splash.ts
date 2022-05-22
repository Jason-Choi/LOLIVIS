import { Selection } from "d3"

export class Splash {
    selection: Selection<any, any, any, any>
    width: number
    height: number
    margin: number

    constructor(
        selection: Selection<any, any, any, any>,
        width: number,
        height: number,
        margin: number
    ) {
        this.selection = selection
        this.width = width
        this.height = height
        this.margin = margin
        this.render()
    }
    render() {
        this.selection
            .append("image")
            .attr("href", "https://raw.githubusercontent.com/Jason-Choi/LOLIVIS/master/logo.svg")
            .attr("width", this.width / 2)
            .attr("x", this.width / 4)
            .attr("y", this.height / 2 - 200)

        this.selection
            .append("text")
            .attr("x", this.width / 2)
            .attr("y", this.height / 2 + 100)
            .attr("font-size", "30px")
            .attr("text-anchor", "middle")
            .attr("font-weight", 600)
            .attr("fill", "white")
            .text("← Select one or two attributes to visualize! →")
    }
}
