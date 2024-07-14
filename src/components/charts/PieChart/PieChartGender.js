import React, { useEffect } from "react";
import * as d3 from "d3";
import './PieChartGender.css';


const PieChartGender = (props)=> {
    useEffect(()=> {
        if (props.data) {
            draw(props.data)
        }
        // eslint-disable-next-line
    }, [props.data])

    const clearBoard = ()=>{
        d3.select("#genderChart").selectAll("*").remove();
      }

    const draw = (data)=> {
        clearBoard();
        var svg = d3.select("#genderChart"),
        width = svg.attr("width") - 70,
        height = svg.attr("height") - 70,
        radius = Math.min(width, height) / 2,
        g = svg.append("g").attr("transform", "translate(" + ((width / 2)+5) + "," + (height / 2) + ")");

        var color = d3.scaleOrdinal(['#4daf4a','#377eb8']);

        const tooltip = d3.select(props.parentRef.current)
                      .attr('id', 'tooltip');

        // Generate the pie
    var pie = d3.pie().value(d=> d['count']);

    // Generate the arcs
    var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

    let count = data[0].count + data[1].count;

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
                    props.onPieChartGenderClick(d.data["Gender"]);
                });

    //Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .style("stroke", "black")
        .style("stroke-opacity", 0.8)
        .attr("d", arc);

        svg.append("g")
                       .attr("transform", "translate(" + ((width / 2) - 30) + "," + (height +20) + ")")
                       .append("text")
                       .text("Gender")
                       .attr("fill", "black")
                       .attr("class", "title")

                       svg.append('rect')
                       .attr('x', 90)
                       .attr('y', 35)
                       .attr('width', 15)
                       .attr('height', 15)
                       .attr('stroke', 'black')
                       .attr('fill', '#4daf4a')
               
                   svg.append("text")
                       .attr("fill", "black")
                       .attr("font-family", "Gill Sans")
                       .attr("font-size", "15px")
                       .attr("x", 106)
                       .attr("y", 47)
                       .text("Female");
               
                   svg.append('rect')
                       .attr('x', 90)
                       .attr('y', 55)
                       .attr('width', 15)
                       .attr('height', 15)
                       .attr('stroke', 'black')
                       .attr('fill', '#377eb8')
               
                   svg.append("text")
                       .attr("fill", "black")
                       .attr("font-family", "Gill Sans")
                       .attr("font-size", "15px")
                       .attr("x", 107)
                       .attr("y", 67)
                       .text("Male");
    }
    return (
        <svg id="genderChart" width={150} height={154}></svg>
    )
};

export default PieChartGender;

































































































// const PieChartGender = (props)=> {
//     let chartRef = useRef()
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
//         const accessToRef = d3.select(chartRef.current)
//         accessToRef.selectAll("svg > *").remove();
//         d3.select(".d3-tip").remove();
//     }

//     const draw = (data)=> {
//         let dataGrouped = d3.group(data, d => d[chartVariable]);
//         let newData = Array.from(dataGrouped);
//         let svg = d3.select("svg"),
//         width = svg.attr("width"),
//         height = svg.attr("height"),
//         radius = Math.min(width, height) / 2;
        
//         var g = svg.append("g")
//                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//         var color = d3.scaleOrdinal(['#4daf4a','#377eb8']);

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
//                .text(function(d) { return d.data['Gender']; });

//             svg.append("g")
//                .attr("transform", "translate(" + (width / 2 - 80) + "," + 10 + ")")
//                .append("text")
//                .text("Gender")
//                .attr("class", "title")
//     }
    
//     return (
//         <div>
//             <svg ref={chartRef} width={250} height={250}></svg>
//         </div>
//     )
// };

// export default PieChartGender;