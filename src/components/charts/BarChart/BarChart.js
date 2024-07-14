import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label
} from "recharts";


const BarChartDiagran = (props)=> {
  const barClickHandler = (data, index)=> {
    props.onBarChartClick(data["Level of Education"]);
  }
    return (
        <BarChart
      width={350}
      height={308}
      data={props.data}
      barSize={45}
      margin={{
        top: 5,
        right: 0,
        left: -13,
        bottom: 5
      }}
    >
      <XAxis dataKey="Level of Education" tick={{fontSize: 10, fill:'black'}} interval="preserveStartEnd">
        <Label value={'Education'} position="insideBottom" style={{ fontSize: 13 }} dx={10} dy={5}/>
      </XAxis>
      <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft',style: {fontSize: 11}, dx:13}}
      tick={{fontSize: 10, fill:'black'}}/>
      <Tooltip />
      <Bar dataKey="Frequency" barSize={40} fill="#8884d8" onClick={barClickHandler} />
    </BarChart>
    )
};

export default BarChartDiagran;






























































































//  const BarChart=(props)=>{

//     const colors=["blue","green","gold","grey","orange","yellow","pink","cyan","magenta","brown","black","tomato"];

//     const chartRef = useRef(null);
//     let data= props.data;
//     const width = 800;
//     const height = 450;
//     const margin_left=100;
//     const margin_right=30;
//     const margin_top=20;
//     const margin_bottom=100;
//     const effective_width= width - margin_left - margin_right;
//     const effective_height= height - margin_top - margin_bottom;
//     let chartVariable= props.chartVariable;

//     const tip = d3tip()
//     .attr('class', 'd3-tip animate')
//     .offset([-20, 0])
//     .html(function(d) {
//         return '<strong><font color="red">'+ d+'</font></strong>';
//       });

//     useEffect(()=>{
//         clearBoard();
//         d3.csv("https://raw.githubusercontent.com/chanduch1999/Golang_practice/master/data-sampled.csv").then((data)=> {
//             draw(data);
//         })
//     },[]);

//     const clearBoard = ()=>{
//         const accessToRef = d3.select(chartRef.current)
//         accessToRef.selectAll("svg > *").remove();
//         d3.select(".d3-tip").remove();
//     }

//     const draw=(data)=>{
//         //process raw data using group by
//         let dataGrouped = d3.group(data, d => d[chartVariable]);

//         if(dataGrouped.length>20)
//         {
//             let newGroup=[];
//             dataGrouped.sort(function(a, b) {
//                 return b.values.length - a.values.length;
//             });
//             for(let i=0;i<20;i++)
//             {
//                 newGroup.push(dataGrouped[i]);
//             }
//             let others=0;
//             for(let i=20;i<dataGrouped.length;i++)
//             {
//                 others+=dataGrouped[i].values.length;
//             }
//             let obj ={key:"Other",values:{length:others}};
//             newGroup.push(obj);
//             dataGrouped=newGroup;
//         }
        
//         const accessToRef = d3.select(chartRef.current)
//         .attr("height",height)
//         .attr("width",width)
//         .style("background-color","#f5f5f5")
//         .append("g")
//             .attr("transform","translate("+margin_left+","+margin_top+")"); 

//         var xAxis = d3.scaleBand()
//                     .domain(Array.from(dataGrouped).map(function(d) { return d[0]; }))
//                     .range([0, effective_width])
//                     .paddingInner(0.1)
//                     .paddingOuter(0.1);

//         accessToRef.append("g")
//             .attr("transform", "translate(0," + effective_height + ")")
//             .call(d3.axisBottom(xAxis))
//             .call(g => g.append("text")
//                 .style("font-size", "18px")
//                 .attr("x", effective_width/2)
//                 .attr("y", -margin_top+60)
//                 .attr("fill", "currentColor")
//                 .attr("text-anchor", "start")
//                 .text(chartVariable));

//         var yAxis = d3.scaleLinear()
//             .range([effective_height, 0])
//             .domain([0, d3.max(dataGrouped,function(d) { return 1.2*d[1].length; })]); 
  
//         accessToRef.append("g")
//             //.attr("transform", "translate(0"+","+margin_bottom+")")
//             .call(d3.axisLeft(yAxis))
//             .call(g => g.append("text")
//                 .style("font-size", "18px")
//                 .attr("x", -effective_height/2)
//                 .attr("y", -margin_left+20)
//                 .attr("fill", "currentColor")
//                 .attr("text-anchor", "end")
//                 .attr("transform", "rotate(-90)")
//                 .text("Frequency"));

//         let barWidth= xAxis.bandwidth();
//         let tempRef = accessToRef.selectAll("rect")
//             .data(Array.from(dataGrouped))
//             .enter()
//             .append("rect")
//                 .attr("x",(d,i) => {return xAxis(d[0])})
//                 .attr("y",(d,i) => { return  yAxis(d[1].length)})
//                 .attr("width", barWidth)
//                 .attr("height",(d,i)=> {return effective_height - yAxis(d[1].length)})
//                 .style("fill",(d,i)=> colors[i%12]);

//                 tempRef.on('mouseover', function (d, i, e) {
//                     tip.show(d.currentTarget.__data__[1].length,this);
//                     d3.select(this)
//                          .transition()
//                          .duration('50')
//                          //.attr("transform",function(d){ return "translate("+xAxis(d[0])+","+(yAxis(d[1].length)-5)+")"})
//                          //.attr("height", function(d) { return (effective_height - yAxis(d[1].length)+5); })
//                          .style("fill","red");
//                 })
//                 .on('mouseout', function (d, i, e) {
//                     d3.select(this).transition()
//                          .duration('50')
//                          //.attr("transform",function(d){ return "translate("+xAxis(d[0])+","+yAxis(d[1].length)+")"})
//                          //.attr("height", function(d) { return effective_height - yAxis(d.length); })
//                          .style("fill",colors[i%12]);
//                     tip.hide();
//                 });
//                 tempRef.call(tip);
                
//     }

//     return(
//         <div>
//             <br/>
//             <svg ref={chartRef}></svg>
//         </div>
//     );
// };

// export default BarChart;