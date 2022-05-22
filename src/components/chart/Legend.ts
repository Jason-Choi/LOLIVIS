import { ScaleBand, scaleOrdinal, Selection } from "d3"
import { LegendColor, legendColor } from "d3-svg-legend"
import { Main } from "../Main"

export class Legends {
    selection: Selection<any, any, any, any>
    main: Main
    legend: any
    constructor(selection: Selection<any, any, any, any>, main: Main, label: string[]) {
        this.selection = selection
            .append("g")
            .attr("class", "legend")
            .attr("transform", "translate(600,80)")

        this.main = main
        const scale = scaleOrdinal().domain(label).range(main.colors)

        this.legend = legendColor().orient("vertical").shape("rect").scale(scale)

        console.log(this.legend)
        this.render()
    }

    render() {
        this.selection
            .call(this.legend)
            .call(g => g.selectAll("text").attr("fill", "white").attr("font-size", "18px"))
            .call(g => g.selectAll("rect").attr("opacity", 0.5))
    }
}
