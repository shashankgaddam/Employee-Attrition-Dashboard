import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const TreeMap = (props) => {
  useEffect(() => {
    if (props.data) {
      draw(props.data);
    }
  }, [props.data]);

  const clearBoard = () => {
    d3.select("#treemap").selectAll("*").remove();
  };

  const draw = (data) => {
    clearBoard();
    const hierarchy = d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);

    const treemap = d3
      .treemap()
      .size([490, 388]) // width: 400px, height:450px
      .padding(0); // set padding to 1

    const root = treemap(hierarchy);

    const colors = [
      "#347EB4",
      "#08ACB6",
      "#91BB91",
      "#BCD32F",
      "#75EDB8",
      "#89EE4B",
      "#AD4FE8",
      "#D5AB61",
      "#BC3B3A",
      "#F6A1F9",
      "#87ABBB",
      "#412433",
      "#56B870",
      "#FDAB41",
      "#64624F",
    ];

    const categories = data.children.map((d) => d.name);
    const colorScale = d3
      .scaleOrdinal() // the scale function
      .domain(categories) // the data
      .range(colors);

    // And an opacity scale
    // var opacity = d3.scaleLinear()
    // .domain([0, d3.max(d=> d.data.value)])
    // .range([.5,1])

    const tooltip = d3.select(props.parentRef.current).attr("id", "tooltip");

    // set the dimensions and margins of the graph
    let margin = { top: 10, right: 10, bottom: 10, left: 10 },
      width = 490 - margin.left - margin.right,
      height = 395 - margin.top - margin.bottom;

    let svg = d3
      .select("#treemap")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + (10) + "," + (-1) + ")");

    svg
      .selectAll("rect")
      .data(root.leaves())
      .enter()
      .append("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .style("stroke", "black")
      .attr("fill", (d) => colorScale(d.parent.parent.data.name))
      //.style("opacity", (d)=>opacity (d.data.value))
      .on("click", function (event, d) {
        if (this.getAttribute("selected") === "yes") {
          d3.select(this)
            .style("fill", colorScale(d.parent.parent.data.name))
            .attr("selected", "no");
        } else {
          d3.select(this).style("fill", "pink").attr("selected", "yes");
        }
        let selected_obj = {
          "JobRole": d.parent.data.name,
          "Attrition": d.data.name
        }
      props.onTreeMapClick(selected_obj)
      })
      .on("mouseover", (event, d) => {
        // d3.select(this).transition().duration(50).style("opacity", 1);
        // d3.selectAll("rect").transition().duration(50).style("opacity", 0.4);
        tooltip.transition().duration(200).style("opacity", 0.75);
        tooltip.attr("data-value", `${d.parent.data.name}-${d.data.name}`);
        tooltip
          .html(
            `Name: ${d.parent.data.name} ${
              d.data.name === "Yes" ? "Positive" : "Negative"
            } attrition rate <br>` +
              `Category: ${d.parent.parent.data.name} <br>` +
              `Value: ${d.data.value}`
          )
          .style("top", `${event.pageY + 10}px`)
          .style("left", `${event.pageX + 8}px`);
      })
      .on("mouseout", (event, d) => {
        d3.selectAll("rect")
        .transition()
        .duration(50)
        .style("opacity", 1)
        // .style("stroke", "transparent");

      d3.select(this).transition().duration(100);

        tooltip.transition().duration(200).style("opacity", 0);
      });

      // and to add the text labels
  svg
  .selectAll("text")
  .data(root.leaves())
  .enter()
  .append('text')
      .selectAll('tspan')
      .data(d => {
          return (d.parent.data.name + 'Attrition' + d.data.name).split(/(?=[A-Z][^A-Z])/g) // split the name
          .map(v => {
              return {
                text: v,
                x0: d.x0,                        // keep x0 reference
                y0: d.y0                         // keep y0 reference
            }
          });
      })
      .enter()
      .append('tspan')
      .attr("x", (d) => d.x0 + 5)
      .attr("y", (d, i) => d.y0 + 10 + (i * 10))       // offset by index 
      .text((d) => d.text)
      .attr("font-weight", "bold")
      .attr("font-size", "0.5em")
    .attr("fill", "black")
    //.text(function(d){ return `${d.parent.data.name} - Attrition: ${d.data.name}` })

      svg
    .append("text")
      .attr("x", 170)
      .attr("y", 395)    // +20 to adjust position (lower)
      .text("Squarified Tree Map")
      .attr("fill", "black")
      .attr("font-family", "Gill Sans")
      .attr("font-size", "11px")

  };

  return <div id="treemap"></div>;
};

export default TreeMap;




























































// const GeoMap = (props) => {
//   const geoMapRef = useRef();
//   const inputRef = useRef();
//   const [tooltipData, setTooltipData] = useState({});
//   let employees_data = [];

//   useEffect(() => {
//     clearBoard();
//     d3.csv(
//       "https://raw.githubusercontent.com/shashankgaddam/Visualisation/main/employees_new.csv"
//     ).then((data) => {
//       data.map((d) => {
//         return employees_data.push(d);
//       });

//       let json_data = getJsonData();

//       draw(json_data);
//     });
//   }, [props]);

//   const getJsonData = () => {
//     let sales_exec_yes = employees_data.filter(
//       (row) =>
//         row["Department"] === "Sales" &&
//         row["JobRole"] === "Sales Executive" &&
//         row["Attrition"] === "Yes"
//     ).length;
//     let sales_exec_no = employees_data.filter(
//       (row) =>
//         row["Department"] === "Sales" &&
//         row["JobRole"] === "Sales Executive" &&
//         row["Attrition"] === "No"
//     ).length;
//     let Sales_Manager_Yes = employees_data.filter(
//       (row) =>
//         row["Department"] === "Sales" &&
//         row["JobRole"] === "Manager" &&
//         row["Attrition"] === "Yes"
//     ).length;
//     let Sales_Manager_No = employees_data.filter(
//       (row) =>
//         row["Department"] === "Sales" &&
//         row["JobRole"] === "Manager" &&
//         row["Attrition"] === "No"
//     ).length;
//     let sales_Rep_yes = employees_data.filter(
//       (row) =>
//         row["Department"] === "Sales" &&
//         row["JobRole"] === "Sales Representative" &&
//         row["Attrition"] === "Yes"
//     ).length;
//     let sales_Rep_no = employees_data.filter(
//       (row) =>
//         row["Department"] === "Sales" &&
//         row["JobRole"] === "Sales Representative" &&
//         row["Attrition"] === "No"
//     ).length;

//     let RD_Scientist_yes = employees_data.filter(
//       (row) =>
//         row["Department"] === "Research & Development" &&
//         row["JobRole"] === "Research Scientist" &&
//         row["Attrition"] === "Yes"
//     ).length;
//     let RD_Scientist_no = employees_data.filter(
//       (row) =>
//         row["Department"] === "Research & Development" &&
//         row["JobRole"] === "Research Scientist" &&
//         row["Attrition"] === "No"
//     ).length;
//     let LT_yes = employees_data.filter(
//       (row) =>
//         row["Department"] === "Research & Development" &&
//         row["JobRole"] === "Laboratory Technician" &&
//         row["Attrition"] === "Yes"
//     ).length;
//     let LT_no = employees_data.filter(
//       (row) =>
//         row["Department"] === "Research & Development" &&
//         row["JobRole"] === "Laboratory Technician" &&
//         row["Attrition"] === "No"
//     ).length;
//     let MD_yes = employees_data.filter(
//       (row) =>
//         row["Department"] === "Research & Development" &&
//         row["JobRole"] === "Manufacturing Director" &&
//         row["Attrition"] === "Yes"
//     ).length;
//     let MD_no = employees_data.filter(
//       (row) =>
//         row["Department"] === "Research & Development" &&
//         row["JobRole"] === "Manufacturing Director" &&
//         row["Attrition"] === "No"
//     ).length;
//     let Health_Rep_yes = employees_data.filter(
//       (row) =>
//         row["Department"] === "Research & Development" &&
//         row["JobRole"] === "Healthcare Representative" &&
//         row["Attrition"] === "Yes"
//     ).length;
//     let Health_Rep_no = employees_data.filter(
//       (row) =>
//         row["Department"] === "Research & Development" &&
//         row["JobRole"] === "Healthcare Representative" &&
//         row["Attrition"] === "No"
//     ).length;
//     let RD_Manager_yes = employees_data.filter(
//       (row) =>
//         row["Department"] === "Research & Development" &&
//         row["JobRole"] === "Manager" &&
//         row["Attrition"] === "Yes"
//     ).length;
//     let RD_Manager_no = employees_data.filter(
//       (row) =>
//         row["Department"] === "Research & Development" &&
//         row["JobRole"] === "Manager" &&
//         row["Attrition"] === "No"
//     ).length;
//     let RD_Director_yes = employees_data.filter(
//       (row) =>
//         row["Department"] === "Research & Development" &&
//         row["JobRole"] === "Research Director" &&
//         row["Attrition"] === "Yes"
//     ).length;
//     let RD_Director_no = employees_data.filter(
//       (row) =>
//         row["Department"] === "Research & Development" &&
//         row["JobRole"] === "Research Director" &&
//         row["Attrition"] === "No"
//     ).length;

//     let HR_yes = employees_data.filter(
//       (row) =>
//         row["Department"] === "Human Resources" &&
//         row["JobRole"] === "Human Resources" &&
//         row["Attrition"] === "Yes"
//     ).length;
//     let HR_no = employees_data.filter(
//       (row) =>
//         row["Department"] === "Human Resources" &&
//         row["JobRole"] === "Human Resources" &&
//         row["Attrition"] === "No"
//     ).length;
//     let HR_Manager_yes = employees_data.filter(
//       (row) =>
//         row["Department"] === "Human Resources" &&
//         row["JobRole"] === "Manager" &&
//         row["Attrition"] === "Yes"
//     ).length;
//     let HR_Manager_no = employees_data.filter(
//       (row) =>
//         row["Department"] === "Human Resources" &&
//         row["JobRole"] === "Manager" &&
//         row["Attrition"] === "No"
//     ).length;

//     return {
//       children: [
//         {
//           name: "Sales",
//           children: [
//             {
//               name: "Sales Executive",
//               children: [
//                 { name: "Yes", value: sales_exec_yes },
//                 { name: "No", value: sales_exec_no },
//               ],
//             },
//             {
//               name: "Manager",
//               children: [
//                 { name: "Yes", value: Sales_Manager_Yes },
//                 { name: "No", value: Sales_Manager_No },
//               ],
//             },
//             {
//               name: "Sales Representative",
//               children: [
//                 { name: "Yes", value: sales_Rep_yes },
//                 { name: "No", value: sales_Rep_no },
//               ],
//             },
//           ],
//         },
//         {
//           name: "Research & Development",
//           children: [
//             {
//               name: "Research Scientist",
//               children: [
//                 { name: "Yes", value: RD_Scientist_yes },
//                 { name: "No", value: RD_Scientist_no },
//               ],
//             },
//             {
//               name: "Laboratory Technician",
//               children: [
//                 { name: "Yes", value: LT_yes },
//                 { name: "No", value: LT_no },
//               ],
//             },
//             {
//               name: "Manufacturing Director",
//               children: [
//                 { name: "Yes", value: MD_yes },
//                 { name: "No", value: MD_no },
//               ],
//             },
//             {
//               name: "Healthcare Representative",
//               children: [
//                 { name: "Yes", value: Health_Rep_yes },
//                 { name: "No", value: Health_Rep_no },
//               ],
//             },
//             {
//               name: "Manager",
//               children: [
//                 { name: "Yes", value: RD_Manager_yes },
//                 { name: "No", value: RD_Manager_no },
//               ],
//             },
//             {
//               name: "Research Director",
//               children: [
//                 { name: "Yes", value: RD_Director_yes },
//                 { name: "No", value: RD_Director_no },
//               ],
//             },
//           ],
//         },
//         {
//           name: "Human Resources",
//           children: [
//             {
//               name: "Human Resources",
//               children: [
//                 { name: "Yes", value: HR_yes },
//                 { name: "No", value: HR_no },
//               ],
//             },
//             {
//               name: "Manager",
//               children: [
//                 { name: "Yes", value: HR_Manager_yes },
//                 { name: "No", value: HR_Manager_no },
//               ],
//             },
//           ],
//         },
//       ],
//       name: "employees",
//     };
//   };

//   const clearBoard = () => {
//     const accessToRef = d3.select(geoMapRef.current);
//     accessToRef.selectAll("svg > *").remove();
//     d3.select(".d3-tip").remove();
//   };

//   const draw = (data) => {
//     // Pass the data to d3.hierarchy to work with d3.treemap()

//     var margin = { top: 10, right: 10, bottom: 10, left: 10 },
//       width = 750 - margin.left - margin.right,
//       height = 510 - margin.top - margin.bottom;

//     const hierarchy = d3
//       .hierarchy(data)
//       .sum((d) => d.value)
//       .sort((a, b) => b.value - a.value);

//     const treemap = d3.treemap().size([750, 510]).padding(1);

//     const root = treemap.tile(d3.treemapSquarify)(hierarchy);

//     const colors = [
//       "#347EB4",
//       "#08ACB6",
//       "#91BB91",
//       "#BCD32F",
//       "#75EDB8",
//       "#89EE4B",
//       "#AD4FE8",
//       "#D5AB61",
//       "#BC3B3A",
//       "#F6A1F9",
//       "#87ABBB",
//       "#412433",
//       "#56B870",
//       "#FDAB41",
//       "#64624F",
//     ];

//     const categories = data.children.map((d) => d.name);
//     const colorScale = d3
//       .scaleOrdinal() // the scale function
//       .domain(categories) // the data
//       .range(colors);

//       const tooltip = d3.select(props.parentRef.current)
//                       .attr('id', 'tooltip');

//     const svg = d3
//       .select("#treeMap")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom);

//       console.log(root.leaves());

//     svg
//       .selectAll("rect")
//       .data(root.leaves())
//       .enter()
//       .append("rect")
//       .attr("x", (d) => d.x0)
//       .attr("y", (d) => d.y0)
//       .attr("width", (d) => d.x1 - d.x0)
//       .attr("height", (d) => d.y1 - d.y0)
//       .attr("fill", (d) => colorScale(d.parent.parent.data.name))
//       .on('mousemove', (event,d) => {
//         tooltip.transition()
//                 .duration(200)
//                 .style('opacity', 0.75);
//         tooltip.attr('data-value', `${d.parent.data.name}-${d.data.name}`);
//         tooltip.html(
//           `Name: ${d.parent.data.name} ${d.data.name === 'Yes' ? 'Positive' : 'Negative'} attrition rate <br>` +
//           `Category: ${d.parent.parent.data.name} <br>` +
//           `Value: ${d.data.value}`
//         )
//           .style('top', `${event.pageY + 10}px`)
//           .style('left', `${event.pageX + 8}px`);
//       })
//       .on('mouseout', d => {
//         tooltip.transition()
//                 .duration(200)
//                 .style('opacity', 0);
//       });

//   };

//   return (
//     <div ref={inputRef} style={{ width: "750px", height: "510px" }}>
//       <svg id="treeMap" ref={geoMapRef}></svg>
//     </div>
//   );
// };

// export default GeoMap;
