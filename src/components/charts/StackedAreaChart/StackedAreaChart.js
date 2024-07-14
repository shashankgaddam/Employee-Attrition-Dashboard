import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const StackedAreaChart = (props)=> {
  const stackedAreaChartHandler = (data, index)=> {
    let selected_value;
    if (data.activeLabel === 'Middle') {
      selected_value = "Middle Management"
    } else if (data.activeLabel === "Senior") {
      selected_value = "Senior Management"
    } else if (data.activeLabel === "First Level") {
      selected_value = "First Level Management"
    } else if (data.activeLabel === "Intermediate") {
      selected_value = "Intermediate"
    } else {
      selected_value = "Entry Level"
    }
    props.onStackedAreaChartClick(selected_value)
  }
    return (
        <AreaChart
      width={350}
      height={395}
      data={props.data}
      onClick={stackedAreaChartHandler}
      margin={{
        top: 10,
        right: 5,
        left: -30,
        bottom: 0
      }}
    >
      {/* <CartesianGrid strokeDasharray="3 3" /> */}
      <XAxis 
      dataKey="Level of Job" tick={{fontSize: 8, fill:'black'}} label={{ value: 'Job Level', position: 'insideBottom',style: {fontSize: 11}, dx:10, dy: 5}} interval="preserveStartEnd"/>
      <YAxis tick={{fontSize: 10, fill:'black'}} label={{ value: 'Frequency', angle: -90, position: 'topLeft',style: {fontSize: 10}, dx:10, dy: -50}}/>
      <Tooltip />
      <Area
        type="monotone"
        dataKey="Male"
        stackId="1"
        stroke="#8884d8"
        fill="#8884d8"
      />
      <Area
        type="monotone"
        dataKey="Female"
        stackId="1"
        stroke="#1a76b9"
        fill="#1a76b9"
      />
    </AreaChart>
  );
};

export default StackedAreaChart;