import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import "./ParallelCoordinatesPlot.css";

const ParallelCoordinatesPlot = (props) => {
  useEffect(() => {
    clearBoard();
    if (props.data) {
      draw(props.data);
    }
  }, [props.data]);

  const clearBoard = ()=>{
    d3.select("#pcpChart").selectAll("*").remove();
  }

  const draw = (data) => {
    var margin = { top: 60, right: 120, bottom: 60, left: 50 },
      width = 670 - margin.left - margin.right,
      height = 395 - margin.top - margin.bottom;

    var x = d3.scalePoint().range([0, width - 50]),
      y = {},
      dragging = {};

    var line = d3.line(),
      background,
      foreground;

    var svg = d3
      .select("#pcpChart")
      .append("svg")
      .attr("width", 670)
      .attr("height", 395)
      .append("g")
      .attr("transform", "translate(50,65)");
    var dimensions = [];

    var cat_dims = [
      "Attrition",
      "Department",
      "EducationField",
      "Gender",
      "JobRole",
      "MaritalStatus",
      "State",
      "OverTime",
      "LevelofEducation",
      "LevelofJob",
      "JobSatisfaction",
      "PerformanceRating",
    ];

    svg
      .append("text")
      .attr("transform", "translate(80,320)")
      // .attr("x", -270)
      // .attr("y", -120)
      .attr("fill", "black")
      .attr("font-family", "Gill Sans")
      .attr("font-size", "25px")
      .text("Parallel Coordinates Plot");

    var attrs = Object.keys(data[0]);

    var attrs_removed = [
      "EmployeeID",
      "State",
      "Gender",
      "MaritalStatus",
      "PerformanceRating",
      "LevelofEducation",
      "OverTime",
      "LevelofJob",
      "Department",
      "Attrition",
      "JobRole",
      "Age",
    ];
    attrs = attrs.filter((item) => !attrs_removed.includes(item));

    function calDomain(d) {
      if (d === "MonthlyIncome") {
        return [1000, 20500];
      } else if (d === "DistanceFromHome") {
        return [0, 30];
      } else if (d === "NumCompaniesWorked") {
        return [0, 9];
      } else if (d === "PercentSalaryHike") {
        return [11, 25];
      } else if (d === "TotalWorkingYears") {
        return [0, 40];
      } else if (d === "YearsAtCompany") {
        return [0, 40];
      } else if (d === "YearsInCurrentRole") {
        return [0, 18];
      } else if (d === "YearsSinceLastPromotion") {
        return [0, 15];
      } else {
        return d3.extent(data, function (p) {
          return +p[d];
        });
      }
    }

    x.domain(
      (dimensions = attrs.filter(function (d) {
        if (d !== "EmployeeID") {
          if (cat_dims.includes(d)) {
            var domarr = [];
            d3.extent(data, function (p) {
              domarr.push(p[d]);
              return String(p[d]);
            });
            return (
              cat_dims.includes(d) &&
              (y[d] = d3.scaleBand().domain(domarr).range([0, height]))
            );
          } else {
            return (
              !cat_dims.includes(d) &&
              (y[d] = d3.scaleLinear().domain(calDomain(d)).range([height, 0]))
            );
          }
        }
      }))
    );

    // Add grey background lines for context.
    background = svg
      .append("g")
      .attr("class", "background")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg
      .append("g")
      .attr("class", "foreground")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", function (d) {
        return "#1a76b9";
      });

    // Add a group element for each dimension.
    var g = svg
      .selectAll(".dimension")
      .data(dimensions)
      .enter()
      .append("g")
      .attr("class", "dimension")
      .attr("transform", function (d) {
        return "translate(" + x(d) + ")";
      })
      .call(
        d3
          .drag()
          .on("start", function (d) {
            dragging[d] = x(d);
            background.attr("visibility", "hidden");
          })
          .on("drag", function (event, d) {
            dragging[d] = Math.min(width, Math.max(0, event.x));
            foreground.attr("d", path);
            dimensions.sort(function (a, b) {
              return position(a) - position(b);
            });
            x.domain(dimensions);
            g.attr("transform", function (d) {
              return "translate(" + position(d) + ")";
            });
          })
          .on("end", function (d) {
            delete dragging[d];
            transition(d3.select(this)).attr(
              "transform",
              "translate(" + x(d) + ")"
            );
            transition(foreground).attr("d", path);
            background
              .attr("d", path)
              .transition()
              .delay(500)
              .duration(1000)
              .attr("visibility", null);
          })
      );

    // Add an axis and title.
    g.append("g")
      .attr("class", "axis")
      .each(function (d) {
        d3.select(this).call(d3.axisLeft().scale(y[d]));
      })
      .append("text")
      .style("text-anchor", "middle")
      .attr("class", "axis-label")
      .attr("y", -19)
      .style("fill", "#4f4f4f")
      .style("font-size", 10)
      .attr("transform", "rotate(-30)")
      .text(function (d) {
        return d;
      });

    // Add and store a brush for each axis.
    g.append("g")
      .attr("class", "brush")
      .each(function (d) {
        d3.select(this).call(
          (y[d].brush = d3
            .brushY()
            .extent([
              [-10, 0],
              [10, height],
            ])
            .on("start", brushstart)
            .on("brush", brush)
            .on("end", brush))
        );
      })
      .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);

    function position(d) {
      var v = dragging[d];
      return v == null ? x(d) : v;
    }

    function transition(g) {
      return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
      return line(
        dimensions.map(function (p) {
          if (cat_dims.includes(p)) {
            return [position(p), y[p](d[p]) + y[p].bandwidth() / 2];
          } else {
            return [position(p), y[p](d[p])];
          }
        })
      );
    }

    function brushstart(event, d) {
      event.sourceEvent.stopPropagation();
    }

    var sliced_vals = {};

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
      var actives = [];

      d3.selectAll(".brush")
        .filter(function (d) {
          return d3.brushSelection(this);
        })
        .each(function (key) {
          actives.push({
            dimension: key,
            extent: d3.brushSelection(this),
          });
        });

      if (actives.length === 0) {
        foreground.style("display", null);
      } else {
        foreground.style("display", function (d) {
          return actives.every(function (brushObj) {
            if (cat_dims.includes(brushObj.dimension)) {
              if (
                brushObj.extent[0] <=
                  y[brushObj.dimension](d[brushObj.dimension]) +
                    y[brushObj.dimension].bandwidth() / 2 &&
                y[brushObj.dimension](d[brushObj.dimension]) +
                  y[brushObj.dimension].bandwidth() / 2 <=
                  brushObj.extent[1]
              ) {
                if (sliced_vals[brushObj.dimension] === undefined) {
                  sliced_vals[brushObj.dimension] = new Set();
                }
                sliced_vals[brushObj.dimension].add(d[brushObj.dimension]);

                return true;
              } else {
                return false;
              }
            } else {
              if (
                brushObj.extent[0] <=
                  y[brushObj.dimension](d[brushObj.dimension]) &&
                y[brushObj.dimension](d[brushObj.dimension]) <=
                  brushObj.extent[1]
              ) {
                if (sliced_vals[brushObj.dimension] === undefined) {
                  sliced_vals[brushObj.dimension] = new Set();
                }
                sliced_vals[brushObj.dimension].add(d[brushObj.dimension]);
                return true;
              } else {
                return false;
              }
            }
          })
            ? null
            : "none";
        });
      }
      console.log('Look here', sliced_vals)
      props.onParallelCoordinatesPlotClick(sliced_vals);
    }
  };

  return <div id="pcpChart"></div>;
};

export default ParallelCoordinatesPlot;








































//  const ParallelCoordinatesPlot = (props) => {
//     let scatterRef = useRef(null);
//     const [state, setState] = useState();
//     const [dimensions, setDimensions] = useState();
//     const [mdsPcpButton, setMdsPcpButton] = useState(false);
//     var margin = {top: 25, right: 25, bottom: 25, left: 25};
//     var width = 800 - margin.left - margin.right;
//     var height = 450 - margin.top - margin.bottom;
//     var y = {};
//     var dragging = {};
//     var line = d3.line();
//     var background_lines,foreground_lines;
//     var tempDims;
//     const colormap = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']

//     //const colormap=["red","blue","black","green"];
//     const create_dimensions=(tempState)=>{
//         let dimensionz =[];
//         let tempObj={};
//         Object.keys(tempState[0]).map(function(key,index){
//             if(key!=='color'){
//                 if(typeof tempState[0][key] ==="number")
//                 {
//                     tempObj={
//                         name: key,
//                         scale: d3.scaleLinear().range([height, 0]),
//                         type: "number"
//                     };
//                 }
//                 else
//                 {
//                     tempObj={
//                         name: key,
//                         scale: d3.scaleBand().range([0, height]),
//                         type: "string"
//                     };
//                 }
//                 dimensionz.push(tempObj);
//             }
//             return tempObj;
//         });
//         setDimensions(dimensionz);
//         tempDims=dimensionz;
//     }

//     const create_dimensions_msdpcp=(arr)=>{
//         let dimensionz =[];
//         let tempObj={};
//         for(let i=0;i<arr.length;i++)
//         {
//             tempObj={
//                     name: arr[i],
//                     scale: d3.scaleLinear().range([height, 0]),
//                     type: "number"
//                 };
//             dimensionz.push(tempObj);
//         }
//         setDimensions(dimensionz);
//         tempDims=dimensionz;
//     };

//     var x;

//     useEffect(()=>{
//         if(props.readFromMDSV===undefined || mdsPcpButton===false){
//             axios.get('http://localhost:8000/pcp').then((repos) => {
//                 const allRepos = repos.data;
//                 let parsedResponse = allRepos
//                 let tempState = parsedResponse;
//                 var no_of_dimensions = Object.keys(parsedResponse[0]).length - 1;
//                 create_dimensions(parsedResponse);
//                     tempDims.forEach(function(dimension) {
//                         dimension.scale.domain(dimension.type === "number"
//                             ? d3.extent(parsedResponse, function(d) { return +d[dimension.name]; })
//                             : parsedResponse.map(function(d) { return d[dimension.name]; }).sort());
//                     });
//                 setState(tempState);
//                 clearBoard();
//                 draw();
//             });
//         }
//         else if(mdsPcpButton===true){
//             axios.get('http://localhost:8000/mdspcp').then((repos) => {
//                 const allRepos = repos.data;
//                 let parsedResponse = JSON.parse(allRepos);
//                 let tempState = parsedResponse;
//                 create_dimensions_msdpcp(props.readFromMDSV);
//                     tempDims.forEach(function(dimension) {
//                         dimension.scale.domain(dimension.type === "number"
//                             ? d3.extent(parsedResponse, function(d) { return +d[dimension.name]; })
//                             : parsedResponse.map(function(d) { return d[dimension.name]; }).sort());
//                     });
//                 setState(tempState);
//                 clearBoard();
//                 draw();
//             });
//         }
//         clearBoard();
//         draw();
//     },[props,mdsPcpButton]);

//     useEffect(()=>{
//         clearBoard();
//         draw();
//     },[state,dimensions]);

//     const clearBoard=()=>{
//         const accessToRef = d3.select(scatterRef.current);
//         accessToRef.selectAll("svg > *").remove();
//     }

//     const coordinate=(d)=>{
//         var v = dragging[d.name];
//         return v == null ? x(d.name) : v;
//     }

//     const transition=(g)=>{
//         return g.transition().duration(500);
//     }

//     const path=(d)=>{
//         return line(dimensions.map(function(dimension) {
//             var draggingV = dragging[dimension.name];
//             var xpoint = draggingV === undefined ? x(dimension.name) : draggingV;
//             let ypoint = dimension.type==="string" ? dimension.scale(d[dimension.name]) + dimension.scale.bandwidth()/2 : dimension.scale(d[dimension.name]);
//             return [xpoint, ypoint];
//         }));
//     }

//     //  const brushstart=()=>{
//     //         d3.event.sourceEvent.stopPropagation();
//     // };

//     const brush=(svg)=>{
//         var actives = [];
//         svg.selectAll(".brush")
//             .filter(function (d) {
//                 return d3.brushSelection(this);
//             })
//             .each(function (key) {
//                 actives.push({
//                     dimension: key,
//                     extent: d3.brushSelection(this)
//                 });
//             });
//         if (actives.length === 0) {
//             foreground_lines.style("display", null);
//         } else {
//             foreground_lines.style("display", function (d) {
//                 return actives.every(function (brushObj) {
//                     return brushObj.extent[0] <= brushObj.dimension.scale(d[brushObj.dimension.name]) && brushObj.dimension.scale(d[brushObj.dimension.name]) <= brushObj.extent[1];
//                 }) ? null : "none";
//             });
//         }
//     }

//     const handleChange=(e)=>{
//         if(e.target.checked==true)
//         {
//             setMdsPcpButton(true);
//         }
//         else{
//             setMdsPcpButton(false);
//         }
//     }

//     const draw =() =>{

//         if(state!==undefined){
//             x = d3.scalePoint()
//                     .domain(dimensions.map(function(d) { return d.name; }))
//                     .range([0, width]);

//             var svg = d3.select(scatterRef.current)
//                         .attr("width", width + margin.left + margin.right)
//                         .attr("height", height + margin.top + margin.bottom)
//                         .append("g")
//                         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//             if(state!==undefined){
//                 background_lines = svg.append("g")
//                                 .attr("class", "background")
//                                 .selectAll("path")
//                                 .data(state)
//                                 .enter()
//                                 .append("path")
//                                 .attr("d", path);

//                 foreground_lines = svg.append("g")
//                                 .attr("class", "foreground")
//                                 .selectAll("path")
//                                 .data(state)
//                                 .enter().append("path")
//                                 .attr("d", path)
//                                 .style("stroke",function(d){return colormap[d['color']]});

//                 var g = svg.selectAll(".dimension")
//                             .data(dimensions)
//                             .enter().append("g")
//                             .attr("class", "dimension")
//                             .attr("transform", function(d) { return "translate(" + x(d.name) + ")"; })
//                             .call(d3.drag()
//                             .on("start", function(event, d) {
//                                     dragging[d.name] = x(d.name);
//                                     background_lines.attr("visibility","hidden");
//                                     })
//                             .on("drag", function(event, d) {
//                                 const [x,y] = d3.pointer(event);
//                                 dragging[d.name] = Math.min(width, Math.max(0, x));
//                                 foreground_lines.attr("d", path);
//                                 dimensions.sort(function(a, b) { return coordinate(a) - coordinate(b); });
//                                 x.domain(dimensions.map(function(d) { return d.name; }));
//                                 g.attr("transform", function(d) { return "translate(" + coordinate(d) + ")"; })
//                             })
//                             .on("end", function(d) {
//                                 delete dragging[d.name];
//                                 transition(d3.select(this)).attr("transform", "translate(" + x(d.name) + ")");
//                                 transition(foreground_lines).attr("d", path);
//                                 background_lines
//                                     .attr("d", path)
//                                     .transition()
//                                     .delay(500)
//                                     .duration(0)
//                                     .attr("visibility", null);
//                             })
//                         );

//                 g.append("g")
//                 .attr("class", "axis")
//                 .each(function(d) {
//                     d3.select(this)
//                     .call(d3.axisLeft()
//                     .scale(d.scale));
//                  })
//                 .append("text")
//                 .style("text-anchor", "middle")
//                 .attr("class", "axis-label")
//                 .attr("y", -19)
//                 .style("fill","black")
//                 .style("font-size",7)
//                 .text(function(d) { return d.name; });

//                 g.append("g")
//                     .attr("class", "brush")
//                     .each(function(d)
//                     {
//                         d3.select(this)
//                         .call(d.scale.brush = d3.brushY().extent([[-10,0],[10,height]])
//                         .on("start", function(event, d) {
//                             console.log('circle clicked');
//                             event.stopPropagation();
//                           })
//                         .on("brush", function(d){brush(svg)})
//                         .on("end", function(d){brush(svg)}));
//                     })
//                     .selectAll("rect")
//                     .attr("x", -8)
//                     .attr("width", 16);
//             }
//         }
//     }
//     return(
//         <div>
//             {/* <h3><u>Parallel Coordinates Plot</u></h3>
//             <input type="checkbox" id="mds" name="mds" value="mds" onChange={handleChange}></input>
//             <label for="mds"> Select to Activate MDS-PCP Mode </label> */}
//             {
//               state ? <div>
//                   <svg ref={scatterRef}></svg>
//                   {/* <div className="legend"><b>Color Legend</b><br/>
//                         Red   -  Cluster 1<br/>
//                         Blue  -  Cluster 2<br/>
//                         Black-  Cluster 3<br/>
//                         Green  -  Cluster 4<br/>
//                   </div>
//                   <br/> */}
//                   </div> : <div />
//             }
//         </div>
//     );

// };
// export default ParallelCoordinatesPlot
