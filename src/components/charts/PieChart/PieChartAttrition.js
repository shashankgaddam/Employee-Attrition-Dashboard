import React, { useEffect } from "react";
import * as d3 from "d3";
import './PieChartGender.css';


const PieChartAttrition = (props)=> {
    useEffect(()=> {
        if (props.data) {
            draw(props.data)
        }
        // eslint-disable-next-line
    }, [props.data])

    const clearBoard = ()=>{
        d3.select("#attrition").selectAll("*").remove();
      }

    const draw = (data)=> {
        clearBoard();
        var svg = d3.select("#attrition"),
        width = svg.attr("width") - 70,
        height = svg.attr("height") - 70,
        radius = Math.min(width, height) / 2,
        g = svg.append("g").attr("transform", "translate(" + ((width / 2)+5)+ "," + ((height / 2) + 20)+ ")");

        var color = d3.scaleOrdinal(['#4daf4a','#377eb8']);

        const tooltip = d3.select(props.parentRef.current)
                      .attr('id', 'tooltip');

        // Generate the pie
    var pie = d3.pie().value(d=> d['count']);

    let count = data[0].count + data[1].count;

    // Generate the arcs
    var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

    //Generate groups
    var arcs = g.selectAll("arc")
                .data(pie(data))
                .enter()
                .append("g")
                .attr("class", "arc")
                .on("mouseover", function (event, d) {
                    tooltip
                        .style("left", `${event.pageX + 8}px`)
                        .style("top", `${event.pageY + 10}px`)
                        .style("opacity", 1)
                        .html(Math.round((d.data.count / count) * 100) + "%")
                })
                    .on("mouseout", function () {
                    // Hide the tooltip
                    tooltip
                        .style("opacity", 0);
                })
                .on("click", (event, d)=> {
                    // if (this.getAttribute("selected") === "yes") {
                    //     d.data.key === "Yes" ? d3.select(this).style("fill", "#3181BD").attr("selected", "no") :
                    //         d3.select(this).style("fill", "#a444ff").attr("selected", "no")
                    // } else {
                    //     d.data.key === "Yes" ? d3.select(this).style("fill", "#FFFFFF").attr("selected", "yes") :
                    //         d3.select(this).style("fill", "#FFFFFF").attr("selected", "yes")
                    // }
                    if (d.data["Attriton"]) {
                        props.onPieChartAttritionClick(d.data["Attriton"]);
                    } else {
                        props.onPieChartAttritionClick(d.data["Attrition"]);
                    }
                });

    //Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        // .append('text')
        // .text(function (d) {
        //     return Math.round((d.data.count / count) * 100) + "%"
        // })
        .style("stroke", "black")
        .style("stroke-opacity", 0.8)
        .attr("d", arc)

        svg.append("g")
                       .attr("transform", "translate(" + ((width / 2) - 30) + "," + (height + 40) + ")")
                       .append("text")
                       .text("Attrition")
                       .attr("fill", "black")
                       .attr("class", "title")


                       svg.append('rect')
                       .attr('x', 100)
                       .attr('y', 35)
                       .attr('width', 15)
                       .attr('height', 15)
                       .attr('stroke', 'black')
                       .attr('fill', '#4daf4a')
               
                   svg.append("text")
                       .attr("fill", "black")
                       .attr("font-family", "Gill Sans")
                       .attr("font-size", "15px")
                       .attr("x", 120)
                       .attr("y", 47)
                       .text("Yes");
               
                   svg.append('rect')
                       .attr('x', 100)
                       .attr('y', 55)
                       .attr('width', 15)
                       .attr('height', 15)
                       .attr('stroke', 'black')
                       .attr('fill', '#377eb8')
               
                   svg.append("text")
                       .attr("fill", "black")
                       .attr("font-family", "Gill Sans")
                       .attr("font-size", "15px")
                       .attr("x", 120)
                       .attr("y", 69)
                       .text("No");
    }
    return (
        <svg id="attrition" width={150} height={154}></svg>
    )
}

export default PieChartAttrition;
































































































// const PieChartAttrition = (props)=> {
//     let pieChartRef = useRef()
//     let chartVariable = props.chartVariable

//     useEffect(()=>{
//         clearBoard();
//         d3.csv("https://raw.githubusercontent.com/chanduch1999/Golang_practice/master/data-sampled.csv").then((data)=> {
//             // let newData = data.map((obj) => {
//             //     const keys = Object.keys(obj);
//             //     return { [keys[keys.indexOf('Gender')]]: obj[keys[keys.indexOf('Gender')]] };
//             //   })      
//         draw(data);
//         })
//     },[props]);

//     const clearBoard = ()=>{
//         const accessToRef = d3.select(pieChartRef.current)
//         accessToRef.selectAll("svg > *").remove();
//         d3.select(".d3-tip").remove();
//     }

//     const draw = (data)=> {
//         let dataGrouped = d3.group(data, d => d[chartVariable]);
//         let newData = Array.from(dataGrouped);
//         let svg = d3.select("#attrition"),
//         width = svg.attr("width"),
//         height = svg.attr("height"),
//         radius = Math.min(width, height) / 2;
        
//         var g = svg.append("g")
//                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//         var color = d3.scaleOrdinal(["#984ea3", "#ff7f00"]);

//         let pie = d3.pie().value(d=> d[1].length);

//         let pieData = pie(newData);

//         var path = d3.arc()
//                      .outerRadius(radius - 10)
//                      .innerRadius(0);

//         var label = d3.arc()
//                       .outerRadius(radius)
//                       .innerRadius(radius - 80);


//             var arc = g.selectAll(".arc")
//                        .data(pieData)
//                        .enter().append("g")
//                        .attr("class", "arc");

//             arc.append("path")
//                .attr("d", path)
//                .attr("fill", function(d, i) { return color(i); });
        
//             console.log(arc)
        
//             arc.append("text")
//                .attr("transform", function(d) { 
//                         return "translate(" + label.centroid(d) + ")"; 
//                 })
//                .text(function(d) { return d.data['Attrition']; });

//             svg.append("g")
//                .attr("transform", "translate(" + (width / 2 - 80) + "," + 10 + ")")
//                .append("text")
//                .text("Attrition")
//                .attr("class", "title")
//     }
    
//     return (
//         <div>
//             <svg id="attrition" ref={pieChartRef} width={250} height={250}></svg>
//         </div>
//     )
// };

// export default PieChartAttrition;