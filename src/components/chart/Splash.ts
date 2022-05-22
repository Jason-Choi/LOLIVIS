import { Selection } from "d3"
import { Size } from "../../types"

export class Splash {
    selection: Selection<any, any, any, any>
    size: Size

    constructor(selection: Selection<any, any, any, any>, size: Size) {
        this.selection = selection
        this.size = size
        this.render()
    }
    render() {
        // this.selection
        //     .append("image")
        //     .attr("href", "https://raw.githubusercontent.com/Jason-Choi/LOLIVIS/master/logo.svg")
        //     .attr("width", this.size.width / 2)
        //     .attr("x", this.size.width / 4)
        //     .attr("y", this.size.height / 2 - 200)

        this.selection
            .append("text")
            .attr("x", this.size.width / 2)
            .attr("y", this.size.height / 2)
            .attr("font-size", "30px")
            .attr("text-anchor", "middle")
            .attr("font-weight", 600)
            .attr("fill", "white")
            .text("Select one or two attributes to visualize!")
    }
}
