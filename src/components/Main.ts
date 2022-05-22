import { DSVRowArray, schemeCategory10, select, Selection } from "d3"
import { Size } from "../types"
import Heatmap from "./chart/Heatmap"
import Histogram from "./chart/Histogram"
import HistogramBQ from "./chart/HistogramBQ"
import { Legends } from "./chart/Legend"
import PieChart from "./chart/PieChart"
import Scatterplot from "./chart/Scatterplot"
import { Splash } from "./chart/Splash"
import { camelCaseToWords } from "./SideBar"

const size: Size = { width: 800, height: 900, margin: 80 }

export class Main {
    id: string
    selection: Selection<any, any, any, any>
    datas: DSVRowArray<string>
    colors: readonly string[] = [schemeCategory10[1], schemeCategory10[2]]
    selectedAttributes: string[] = []

    constructor(id: string, datas: DSVRowArray<string>) {
        this.id = id
        this.selection = select("#" + id)
            .append("svg")
            .attr("width", size.width)
            .attr("height", size.height)
        this.datas = datas
        this.render()
    }

    render() {
        this.selection.selectAll("*").remove()
        const values = this.selectedAttributes.map(attr => this.getValues(attr))
        const attributeTypes = getAttributeTypes(this.selectedAttributes)
        const labels = this.selectedAttributes.map(attr => camelCaseToWords(attr))

        // Default Splash Screen
        if (this.selectedAttributes.length === 0) {
            new Splash(this.selection, size)
        }

        // Select One Attribute
        else if (this.selectedAttributes.length === 1) {
            if (attributeTypes == "B") {
                new PieChart(this.selection, values[0], size)
                new Legends(this.selection, this, [
                    `${camelCaseToWords(this.selectedAttributes[0])} False`,
                    `${camelCaseToWords(this.selectedAttributes[0])} True`,
                ])
            } else {
                new Histogram(this.selection, values[0], labels, size)
            }
        }

        // Select Two Attributes
        else if (this.selectedAttributes.length === 2) {
            if (attributeTypes == "BB") {
                new Heatmap(this.selection, values, labels, size)
            } else if (attributeTypes == "BQ" || attributeTypes == "QB") {
                const tmpValues = [
                    values[attributeTypes.indexOf("B")],
                    values[attributeTypes.indexOf("Q")],
                ]
                const tmpLabels = [
                    labels[attributeTypes.indexOf("B")],
                    labels[attributeTypes.indexOf("Q")],
                ]
                new HistogramBQ(this.selection, tmpValues, tmpLabels, size)
                new Legends(this.selection, this, [
                    `${camelCaseToWords(
                        this.selectedAttributes[attributeTypes.indexOf("B")]
                    )} False`,
                    `${camelCaseToWords(
                        this.selectedAttributes[attributeTypes.indexOf("B")]
                    )} True`,
                ])
            } else {
                new Scatterplot(this.selection, values, labels, size)
            }
        }
    }

    selectAttribute(attributeName: string): string {
        let result = ""
        if (this.selectedAttributes.includes(attributeName)) {
            this.selectedAttributes = this.selectedAttributes.filter(attr => attr !== attributeName)
            result = "removed"
        } else {
            if (this.selectedAttributes.length < 2) {
                this.selectedAttributes.push(attributeName)
                result = "added"
            } else result = "none"
        }
        this.render()
        return result
    }

    checkAttribute(attributeName: string) {
        return this.selectedAttributes.includes(attributeName)
    }

    getValues(attributeName: string) {
        return this.datas.map(data => data[attributeName]).map(d => Number(d))
    }
}

function getAttributeTypes(attributeNames: string[]) {
    return attributeNames
        .map(attr => (attr.includes("Wins") || attr.includes("First") ? "B" : "Q"))
        .join("")
}
