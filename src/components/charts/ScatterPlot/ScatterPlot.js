import React, { useEffect } from "react";
import * as d3 from 'd3';
import './ScatterPlot.css';

const ScatterPlot = (props)=> {
    //let data = props.data;
    useEffect(()=> {
        clearBoard();
        if (props.data) {
            draw(props.data)
        }
    }, [props.data])

    const clearBoard = ()=>{
        d3.select("#scatterid").selectAll("*").remove();
      }

    const draw = (data)=> {
        // set the dimensions and margins of the graph
    var margin = {top: 120, right: 40, bottom: 50, left: 55},
    width = 450 - margin.right - margin.left,
    height = 300 - margin.top - margin.bottom;

var svg = d3.select("#scatterid")
    .append("svg")
    .attr("width", 450)
    .attr("height", 300)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


svg.append("text")
    .attr("x", 90)
    .attr("y", -95)
    .attr("fill", "black")
    .attr("font-family", "Gill Sans")
    .attr("font-size", "20px")
    .text("Age vs Salary")

var n = data.length;

var x = d3.scaleLinear()
    .domain([800, 20000])
    .range([0, width])

svg.append("g")
    .attr("class", "x-scatter")
    .call(d3.axisBottom(x).ticks(6))
    .attr("transform", "translate(0," + height + ")")

svg.append("text")
    .attr("x", width / 2 - 20)
    .attr("y", 170)
    .attr("fill", "black")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .text("Salary")

let ages = data.map(d=> d.y)
// Add Y axis
var y = d3.scaleLinear()
    .domain([d3.min(ages), d3.max(ages)])
    .range([height, -60])


svg.append("g")
    .call(d3.axisLeft(y).ticks(5))
    .attr("class", "y-scatter")

svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -70)
    .attr("y", -30)
    .attr("fill", "black")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .text("Age")


var circles = svg.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("cx", (d) => x(+d.x))
    .attr("cy", (d) => y(+d.y))
    .attr("class", "non_brushed");


function highlightBrushedCircles(event) {

    if (event.selection != null) {

        // revert circles to initial style
        circles.attr("class", "non_brushed");

        var brush_coords = d3.brushSelection(this);

        // style brushed circles
        circles.filter(function () {

            var cx = d3.select(this).attr("cx"),
                cy = d3.select(this).attr("cy");

            return isBrushed(brush_coords, cx, cy);
        })
            .attr("class", "brushed");
    }
}

function displayTable(event, d) {

    // disregard brushes w/o selections
    // ref: http://bl.ocks.org/mbostock/6232537
    if (!event.selection) return;

    // programmed clearing of brush after mouse-up
    // ref: https://github.com/d3/d3-brush/issues/10
    d3.select(this).call(brush.move, null);

    var d_brushed = d3.selectAll(".brushed").data();
    console.log("brushed", d_brushed)
    props.onScatterPlotClick(d_brushed)


}

var brush = d3.brush()
    .on("brush", highlightBrushedCircles)
    .on("end", displayTable);

svg.append("g")
    .call(brush);


function isBrushed(brush_coords, cx, cy) {

    var x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];

    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
}
    }
    return (
        <div id="scatterid"></div>
    )
};

export default ScatterPlot;