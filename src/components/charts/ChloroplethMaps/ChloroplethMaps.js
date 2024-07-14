import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ChloroplethMaps = (props) => {
  //let data = props.data;
  useEffect(() => {
    if (props.data) {
      d3.json("https://gist.githubusercontent.com/wboykinm/dbbe50d1023f90d4e241712395c27fb3/raw/530c0c6e19067a55ab35bc65261a646b7b998aaa/us-states.json").then((json) => {
      for (var i = 0; i < props.data.length; i++) {
        // Grab State Name
        var dataState = props.data[i].state;
        // Grab data value
        var dataValue = props.data[i].value;
        //     console.log(json);
        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < json.features.length; j++) {
          var jsonState = json.features[j].properties.name;

          if (dataState === jsonState) {
            // Copy the data value into the JSON
            json.features[j].properties.value = dataValue;
            // Stop looking through the JSON
            break;
          }
        }
      }
      draw(json, props.data);
    });
    }
  }, [props.data]);

  const clearBoard = ()=>{
    d3.select("#usmapid").selectAll("*").remove();
  }

  const draw = (json, data) => {
    clearBoard();
    var tooltip = d3.select(props.parentRef.current)
    .attr('id', 'tooltip');

    var lowColor = "#27a7fd";
    var highColor = "#002338";

    var margin = { top: 10, right: 10, bottom: 20, left: 10 },
      width = 450 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    // D3 Projection
    var projection = d3
      .geoAlbersUsa()
      .translate([width / 2, height / 2]) // translate to center of screen
      .scale([500]); // scale things down so see entire US

    // Define path generator
    var path = d3
      .geoPath() // path generator that will convert GeoJSON to SVG paths
      .projection(projection); // tell path generator to use albersUsa projection

    //Create SVG element and append map to the SVG
    var svg = d3
      .select("#usmapid")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(-5,0)");

    svg
      .append("text")
      .attr("x", 100)
      .attr("y", 20)
      .attr("fill", "black")
      .attr("font-family", "Gill Sans")
      .attr("font-size", "15px")
      .text("Average Monthly Incomes by State");

    var dataArray = [];
    for (var d = 0; d < data.length; d++) {
      dataArray.push(parseFloat(data[d].value));
    }
    var minVal = d3.min(dataArray);
    var maxVal = d3.max(dataArray);

    //data = filteredData;
    var ramp = d3
      .scaleLinear()
      .domain([minVal, maxVal])
      .range([lowColor, highColor]);

    let mouseOver = function (event, d) {
      d3.selectAll(".map").transition().duration(50).style("opacity", 0.4);
      d3.select(this).transition().duration(50).style("opacity", 1);

      tooltip.transition().duration(50).style("opacity", 0.9);
      tooltip
        .html(d.properties.name + " : " + Math.round(d.properties.value))
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 30 + "px");
    };

    let mouseLeave = function (d) {
      d3.selectAll(".map")
        .transition()
        .duration(50)
        .style("opacity", 1)
        .style("stroke", "transparent");

      d3.select(this).transition().duration(100);

      tooltip.transition().duration(50).style("opacity", 0);
    };

    // Bind the data to the SVG and create one path per GeoJSON feature
    svg
      .selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("class", "map")
      .attr("d", path)
      .style("stroke", "rgba(72,72,72,0.3)")
      .style("stroke-width", "1")
      .style("fill", function (d) {
        if (isNaN(d.properties.value)) return "#8c8a8a";
        else return ramp(d.properties.value);
      })
      .style("opacity", function (d) {
        if (isNaN(d.properties.value)) return 0.5;
        else return 1;
      })
      .on("click", function (event, d) {
        if (this.getAttribute("selected") === "yes") {
          d3.select(this)
            .style("fill", ramp(d.properties.value))
            .attr("selected", "no");
        } else {
          d3.select(this).style("fill", "#A344FF").attr("selected", "yes");
        }
      props.onChoroplethMapClick(d.properties.name)
      })
      .on("mouseover", mouseOver)
      .on("mouseleave", mouseLeave);

    // add a legend
    var w = 140,
      h = 200;

    var key = d3
      .select("#usmapid")
      .append("svg")
      .attr("width", w)
      .attr("height", h + 30)
      .attr("class", "legend")
      .attr("transform", "translate(370,-185)");

    var legend = key
      .append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    legend
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", highColor)
      .attr("stop-opacity", 1);

    legend
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", lowColor)
      .attr("stop-opacity", 1);

    key
      .append("rect")
      .attr("width", w - 120)
      .attr("height", h - 20)
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(0,10)");

    var y = d3
      .scaleLinear()
      .domain([minVal, maxVal])
      .range([h - 20, 0]);

    var yAxis = d3
      .axisRight(y)
      .tickValues([minVal, (minVal + maxVal) / 2, maxVal]);

    key
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(20,10)")
      .attr("fill", "black")
      .call(yAxis);
  };

  return (
    <div id="usmapid" className="usmapid"></div>
  )
};

export default ChloroplethMaps;

// import React from "react";
// import { geoCentroid } from "d3-geo";
// import {
//   ComposableMap,
//   Geographies,
//   Geography,
//   Marker,
//   Annotation
// } from "react-simple-maps";

// import allStates from "../../../data/allstates.json";

// const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// const offsets = {
//   VT: [50, -8],
//   NH: [34, 2],
//   MA: [30, -1],
//   RI: [28, 2],
//   CT: [35, 10],
//   NJ: [34, 1],
//   DE: [33, 0],
//   MD: [47, 10],
//   DC: [49, 21]
// };

// const ChloroplethMaps = () => {
//   return (
//     <div style={{width: '450px', height:'550px'}}>
//     <ComposableMap projection="geoAlbersUsa">
//       <Geographies geography={geoUrl}>
//         {({ geographies }) => (
//           <>
//             {geographies.map(geo => (
//               <Geography
//                 key={geo.rsmKey}
//                 stroke="#FFF"
//                 geography={geo}
//                 fill="#DDD"
//               />
//             ))}
//             {geographies.map(geo => {
//               const centroid = geoCentroid(geo);
//               const cur = allStates.find(s => s.val === geo.id);
//               return (
//                 <g key={geo.rsmKey + "-name"}>
//                   {cur &&
//                     centroid[0] > -160 &&
//                     centroid[0] < -67 &&
//                     (Object.keys(offsets).indexOf(cur.id) === -1 ? (
//                       <Marker coordinates={centroid}>
//                         <text y="2" fontSize={14} textAnchor="middle">
//                           {cur.id}
//                         </text>
//                       </Marker>
//                     ) : (
//                       <Annotation
//                         subject={centroid}
//                         dx={offsets[cur.id][0]}
//                         dy={offsets[cur.id][1]}
//                       >
//                         <text x={4} fontSize={14} alignmentBaseline="middle">
//                           {cur.id}
//                         </text>
//                       </Annotation>
//                     ))}
//                 </g>
//               );
//             })}
//           </>
//         )}
//       </Geographies>
//     </ComposableMap>
//     </div>
//   );
// };

// export default ChloroplethMaps;
