import * as d3 from "d3";
import { DSVRowArray, Selection } from "d3";
import { data } from "../types";

const width = 880;
const height = 700;

export class Main {
    id: string;
    selection : Selection<any, any, any, any>;
    margins = { top: 30, bottom : 30, left : 30, right : 30 };
    datas : DSVRowArray<string>;
    selectedAttributes : string[] = [];

    constructor(id: string, datas: DSVRowArray<string>) {
        this.id = id;
        this.selection = d3.select("#" + id).append("svg").attr("width", width).attr("height", height);
        this.datas = datas;
        this.render();
    }

    render(){
        if (this.selectedAttributes.length === 0){
            this.selection
                .append("image")
                .attr("href", "https://raw.githubusercontent.com/Jason-Choi/LOLIVIS/master/logo.svg")
                .attr("width", width / 2)
                .attr("x", width / 4)
                .attr("y" , height / 2 - 200)
        
            this.selection
                .append("text")
                .attr("x", width / 2)
                .attr("y", height / 2 + 100)
                .attr("font-size", "30px")
                .attr("text-anchor", "middle")
                .attr("font-weight", 600)
                .attr("fill", "white")
                .text("← Select one or two attributes to visualize! →")
        }
        else{
            this.selection.selectAll("*").remove();
            const values = this.selectedAttributes.map(attr => this.getValues(attr));
            const setValues = values.map(value => (new Set(value)).size);
            
            if (values.length === 2){
                if (setValues.filter(value => value === 2).length === 2){
                    console.log("BB")
                }
                else if (setValues.filter(value => value === 2).length === 1){
                    console.log("QB")
                }
                else {
                    console.log("QQ")
                }
            }
            else{
                if (setValues[0] == 2){
                    console.log("B")
                }
                else {
                    console.log("Q")
                }
            }

        }
    }

    selectAttribute(attributeName : string) : string{
        let result = "";
        if (this.selectedAttributes.includes(attributeName)){
            this.selectedAttributes = this.selectedAttributes.filter(attr => attr !== attributeName);
            result = 'removed'
        }
        else {
            if (this.selectedAttributes.length < 3){
                this.selectedAttributes.push(attributeName);
                result = 'added'
            }
            else result = 'none'
        }
        this.render();
        console.log(this.selectedAttributes)
        return result;
    }

    checkAttribute(attributeName : string){
        return this.selectedAttributes.includes(attributeName)
    }

    getValues(attributeName : string){
        return this.datas.map(data => data[attributeName])
    }

}