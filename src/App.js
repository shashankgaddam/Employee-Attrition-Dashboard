import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import * as d3 from "d3";
import BarChart from "./components/charts/BarChart/BarChart";
import ParallelCoordinatesPlot from "./components/charts/ParallelCoordinatesPlot/ParallelCoordinatesPlot";
import PieChartGender from "./components/charts/PieChart/PieChartGender";
import PieChartAttrition from "./components/charts/PieChart/PieChartAttrition";
import ChloroplethMaps from "./components/charts/ChloroplethMaps/ChloroplethMaps";
import TreeMap from "./components/charts/TreeMap/TreeMap";
import StackedAreaChart from "./components/charts/StackedAreaChart/StackedAreaChart";
import ScatterPlot from "./components/charts/ScatterPlot/ScatterPlot";

function App() {
  const tooltipRef = useRef();
  const [stateStore, setStateStore] = useState({
    State: [],
  });
  // const [dataState, setDataState] = useState();
  const [globalData, setGlobalData] = useState();
  const [resetFlag, setResetFalg] = useState(false);
  const [geoMapData, setGeoMapData] = useState();
  const [treeMapData, setTreeMapData] = useState();
  const [barData, setBarData] = useState();
  const [pcpData, setPcpData] = useState();
  const [genderPieChartData, setGenderPieChartData] = useState();
  const [attritionPieChartData, setAttritionPieChartData] = useState();
  const [areaChartData, setAreaChartData] = useState();
  const [scatterPlotData, setScatterPlotData] = useState();
  let employee_data = [];
  
  useEffect(() => {
    d3.csv(
      "https://raw.githubusercontent.com/shashankgaddam/Visualisation/main/employees_new.csv"
    ).then((data) => {
      data.map((d) => employee_data.push(d));

      setStateStore({
        State: [],
      })

      // Using a global data variable which can be used to track changes in data.
      setGlobalData(employee_data);

      // Set the JSON values for Tree Map.
      let json_data = getJsonData(employee_data);
      setTreeMapData(json_data);

      // Set the data for Parallel Coordinates plot.
      setPcpData(employee_data);

      // Set the Attrition Pie Chart Data
      let attritionDataArr = employee_data.map((d) => d["Attrition"]);
      let yes_count = attritionDataArr.filter((d) => d === "Yes").length;
      let no_count = attritionDataArr.filter((d) => d === "No").length;
      let tempArr = [];
      tempArr.push(
        { Attrition: "Yes", count: yes_count },
        { Attriton: "No", count: no_count }
      );
      setAttritionPieChartData(tempArr);

      // Set the Gender Pie Chart Data
      let genderDataArr = employee_data.map((d) => d["Gender"]);
      let female_count = genderDataArr.filter((d) => d === "Female").length;
      let male_count = genderDataArr.filter((d) => d === "Male").length;
      let arr = [];
      arr.push(
        { Gender: "Female", count: female_count },
        { Gender: "Male", count: male_count }
      );
      setGenderPieChartData(arr);

      // Set the Bar Chart Data
      let barChartData = [
        {
          "Level of Education": "College",
          Frequency: employee_data.filter(
            (d) => d["LevelofEducation"] === "College"
          ).length,
        },
        {
          "Level of Education": "Masters",
          Frequency: employee_data.filter(
            (d) => d["LevelofEducation"] === "Masters"
          ).length,
        },
        {
          "Level of Education": "Bachelors",
          Frequency: employee_data.filter(
            (d) => d["LevelofEducation"] === "Bachelors"
          ).length,
        },
        {
          "Level of Education": "Doctorate",
          Frequency: employee_data.filter(
            (d) => d["LevelofEducation"] === "Doctorate"
          ).length,
        },
      ];
      setBarData(barChartData);

      // Set the Scatter Plot Data
      let monthly_incomes = [];
      let ages = [];
      for (const val of employee_data) {
        monthly_incomes.push(val["MonthlyIncome"]);
        ages.push(val["Age"]);
      }
      let scatter_plot_data = getScatterPlotData(monthly_incomes, ages);
      setScatterPlotData(scatter_plot_data);

      // Set the Stacked Area Chart Data
      let stackedAreaChartData = [
        {
          "Level of Job": "Senior",
          Male: employee_data.filter(
            (d) => d["LevelofJob"] === "Senior Management" && d["Gender"] === "Male"
          ).length,
          Female: employee_data.filter(
            (d) =>
              d["LevelofJob"] === "Senior Management" && d["Gender"] === "Female"
          ).length,
        },
        {
          "Level of Job": "Middle",
          Male: employee_data.filter(
            (d) => d["LevelofJob"] === "Middle Management" && d["Gender"] === "Male"
          ).length,
          Female: employee_data.filter(
            (d) =>
              d["LevelofJob"] === "Middle Management" && d["Gender"] === "Female"
          ).length,
        },
        {
          "Level of Job": "First Level",
          Male: employee_data.filter(
            (d) =>
              d["LevelofJob"] === "First Level Management" && d["Gender"] === "Male"
          ).length,
          Female: employee_data.filter(
            (d) =>
              d["LevelofJob"] === "First Level Management" && d["Gender"] === "Female"
          ).length,
        },
        {
          "Level of Job": "Intermediate",
          Male: employee_data.filter(
            (d) =>
              d["LevelofJob"] === "Intermediate" && d["Gender"] === "Male"
          ).length,
          Female: employee_data.filter(
            (d) =>
              d["LevelofJob"] === "Intermediate" && d["Gender"] === "Female"
          ).length,
        },
         {
          "Level of Job": "Entry",
          Male: employee_data.filter(
            (d) =>
              d["LevelofJob"] === "Entry Level" && d["Gender"] === "Male"
          ).length,
          Female: employee_data.filter(
            (d) =>
              d["LevelofJob"] === "Entry Level" && d["Gender"] === "Female"
          ).length,
         }
      ];
      setAreaChartData(stackedAreaChartData);

      // Set the Chloropleth Map Data
      let geoData = getGeoMapData(employee_data);
      setGeoMapData(geoData);
    });
  }, [resetFlag]);

  const getJsonData = (employees_data) => {
    let sales_exec_yes = employees_data.filter(
      (row) =>
        row["Department"] === "Sales" &&
        row["JobRole"] === "Sales Executive" &&
        row["Attrition"] === "Yes"
    ).length;
    let sales_exec_no = employees_data.filter(
      (row) =>
        row["Department"] === "Sales" &&
        row["JobRole"] === "Sales Executive" &&
        row["Attrition"] === "No"
    ).length;
    let Sales_Manager_Yes = employees_data.filter(
      (row) =>
        row["Department"] === "Sales" &&
        row["JobRole"] === "Manager" &&
        row["Attrition"] === "Yes"
    ).length;
    let Sales_Manager_No = employees_data.filter(
      (row) =>
        row["Department"] === "Sales" &&
        row["JobRole"] === "Manager" &&
        row["Attrition"] === "No"
    ).length;
    let sales_Rep_yes = employees_data.filter(
      (row) =>
        row["Department"] === "Sales" &&
        row["JobRole"] === "Sales Representative" &&
        row["Attrition"] === "Yes"
    ).length;
    let sales_Rep_no = employees_data.filter(
      (row) =>
        row["Department"] === "Sales" &&
        row["JobRole"] === "Sales Representative" &&
        row["Attrition"] === "No"
    ).length;

    let RD_Scientist_yes = employees_data.filter(
      (row) =>
        row["Department"] === "Research & Development" &&
        row["JobRole"] === "Research Scientist" &&
        row["Attrition"] === "Yes"
    ).length;
    let RD_Scientist_no = employees_data.filter(
      (row) =>
        row["Department"] === "Research & Development" &&
        row["JobRole"] === "Research Scientist" &&
        row["Attrition"] === "No"
    ).length;
    let LT_yes = employees_data.filter(
      (row) =>
        row["Department"] === "Research & Development" &&
        row["JobRole"] === "Laboratory Technician" &&
        row["Attrition"] === "Yes"
    ).length;
    let LT_no = employees_data.filter(
      (row) =>
        row["Department"] === "Research & Development" &&
        row["JobRole"] === "Laboratory Technician" &&
        row["Attrition"] === "No"
    ).length;
    let MD_yes = employees_data.filter(
      (row) =>
        row["Department"] === "Research & Development" &&
        row["JobRole"] === "Manufacturing Director" &&
        row["Attrition"] === "Yes"
    ).length;
    let MD_no = employees_data.filter(
      (row) =>
        row["Department"] === "Research & Development" &&
        row["JobRole"] === "Manufacturing Director" &&
        row["Attrition"] === "No"
    ).length;
    let Health_Rep_yes = employees_data.filter(
      (row) =>
        row["Department"] === "Research & Development" &&
        row["JobRole"] === "Healthcare Representative" &&
        row["Attrition"] === "Yes"
    ).length;
    let Health_Rep_no = employees_data.filter(
      (row) =>
        row["Department"] === "Research & Development" &&
        row["JobRole"] === "Healthcare Representative" &&
        row["Attrition"] === "No"
    ).length;
    let RD_Manager_yes = employees_data.filter(
      (row) =>
        row["Department"] === "Research & Development" &&
        row["JobRole"] === "Manager" &&
        row["Attrition"] === "Yes"
    ).length;
    let RD_Manager_no = employees_data.filter(
      (row) =>
        row["Department"] === "Research & Development" &&
        row["JobRole"] === "Manager" &&
        row["Attrition"] === "No"
    ).length;
    let RD_Director_yes = employees_data.filter(
      (row) =>
        row["Department"] === "Research & Development" &&
        row["JobRole"] === "Research Director" &&
        row["Attrition"] === "Yes"
    ).length;
    let RD_Director_no = employees_data.filter(
      (row) =>
        row["Department"] === "Research & Development" &&
        row["JobRole"] === "Research Director" &&
        row["Attrition"] === "No"
    ).length;

    let HR_yes = employees_data.filter(
      (row) =>
        row["Department"] === "Human Resources" &&
        row["JobRole"] === "Human Resources" &&
        row["Attrition"] === "Yes"
    ).length;
    let HR_no = employees_data.filter(
      (row) =>
        row["Department"] === "Human Resources" &&
        row["JobRole"] === "Human Resources" &&
        row["Attrition"] === "No"
    ).length;
    let HR_Manager_yes = employees_data.filter(
      (row) =>
        row["Department"] === "Human Resources" &&
        row["JobRole"] === "Manager" &&
        row["Attrition"] === "Yes"
    ).length;
    let HR_Manager_no = employees_data.filter(
      (row) =>
        row["Department"] === "Human Resources" &&
        row["JobRole"] === "Manager" &&
        row["Attrition"] === "No"
    ).length;

    return {
      children: [
        {
          name: "Sales",
          children: [
            {
              name: "Sales Executive",
              children: [
                { name: "Yes", value: sales_exec_yes },
                { name: "No", value: sales_exec_no },
              ],
            },
            {
              name: "Manager",
              children: [
                { name: "Yes", value: Sales_Manager_Yes },
                { name: "No", value: Sales_Manager_No },
              ],
            },
            {
              name: "Sales Representative",
              children: [
                { name: "Yes", value: sales_Rep_yes },
                { name: "No", value: sales_Rep_no },
              ],
            },
          ],
        },
        {
          name: "Research & Development",
          children: [
            {
              name: "Research Scientist",
              children: [
                { name: "Yes", value: RD_Scientist_yes },
                { name: "No", value: RD_Scientist_no },
              ],
            },
            {
              name: "Laboratory Technician",
              children: [
                { name: "Yes", value: LT_yes },
                { name: "No", value: LT_no },
              ],
            },
            {
              name: "Manufacturing Director",
              children: [
                { name: "Yes", value: MD_yes },
                { name: "No", value: MD_no },
              ],
            },
            {
              name: "Healthcare Representative",
              children: [
                { name: "Yes", value: Health_Rep_yes },
                { name: "No", value: Health_Rep_no },
              ],
            },
            {
              name: "Manager",
              children: [
                { name: "Yes", value: RD_Manager_yes },
                { name: "No", value: RD_Manager_no },
              ],
            },
            {
              name: "Research Director",
              children: [
                { name: "Yes", value: RD_Director_yes },
                { name: "No", value: RD_Director_no },
              ],
            },
          ],
        },
        {
          name: "Human Resources",
          children: [
            {
              name: "Human Resources",
              children: [
                { name: "Yes", value: HR_yes },
                { name: "No", value: HR_no },
              ],
            },
            {
              name: "Manager",
              children: [
                { name: "Yes", value: HR_Manager_yes },
                { name: "No", value: HR_Manager_no },
              ],
            },
          ],
        },
      ],
      name: "employees",
    };
  };

  const getScatterPlotData = (monthly_incomes, ages) => {
    let data = [];
    for (let i = 0; i < monthly_incomes[i]; i++) {
      data[i] = { x: parseInt(monthly_incomes[i]), y: parseInt(ages[i]) };
    }
    return data;
  };

  const getGeoMapData = (data) => {
    let avgIncomes = {},
      nums = {};
    for (const row of data) {
      if (avgIncomes[row["State"]] === undefined) {
        avgIncomes[row["State"]] = parseInt(row["MonthlyIncome"]);
        nums[row["State"]] = 1;
      } else {
        avgIncomes[row["State"]] += parseInt(row["MonthlyIncome"]);
        nums[row["State"]] += 1;
      }
    }
    let res = [];
    for (let x in avgIncomes) {
      res.push({ state: x, value: avgIncomes[x] / nums[x] });
      avgIncomes[x] = avgIncomes[x] / nums[x];
    }

    return res;
  };

  const pieChartGenderHandler = (filterParameter) => {
    // Update the globalData variable
    let temp_data = globalData.filter((d) => d["Gender"] === filterParameter);
    //setGlobalData(temp_data);

    // Update the data for Parallel Coordinates plot.
    setPcpData(temp_data);

    // Update the JSON values for Tree Map.
    let json_data = getJsonData(temp_data);
    setTreeMapData(json_data);

    // Update data for Bar Chart Chart
    let tempData = [
      {
        "Level of Education": "College",
        Frequency: temp_data.filter((d) => d["LevelofEducation"] === "College")
          .length,
      },
      {
        "Level of Education": "Masters",
        Frequency: temp_data.filter((d) => d["LevelofEducation"] === "Masters")
          .length,
      },
      {
        "Level of Education": "Bachelors",
        Frequency: temp_data.filter(
          (d) => d["LevelofEducation"] === "Bachelors"
        ).length,
      },
      {
        "Level of Education": "Doctorate",
        Frequency: temp_data.filter(
          (d) => d["LevelofEducation"] === "Doctorate"
        ).length,
      },
    ];
    setBarData(tempData);

    // Update data for Attrition Pie Chart
    let temp_attrition_data = temp_data.map((d) => d["Attrition"]);
    let yes_count = temp_attrition_data.filter((d) => d === "Yes").length;
    let no_count = temp_attrition_data.filter((d) => d === "No").length;
    let tempArr = [];
    tempArr.push(
      { Attrition: "Yes", count: yes_count },
      { Attriton: "No", count: no_count }
    );
    setAttritionPieChartData(tempArr);

    // Update the data for the Choropleth map
    let geoData = getGeoMapData(temp_data);
    setGeoMapData(geoData);

    // Set the Stacked Area Chart Data
    let stackedAreaChartData = [
      {
        "Level of Job": "Senior",
        Male: temp_data.filter(
          (d) => d["LevelofJob"] === "Senior Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Senior Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "Middle",
        Male: temp_data.filter(
          (d) => d["LevelofJob"] === "Middle Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Middle Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "First Level",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "First Level Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "First Level Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "Intermediate",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Intermediate" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Intermediate" && d["Gender"] === "Female"
        ).length,
      },
       {
        "Level of Job": "Entry",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Entry Level" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Entry Level" && d["Gender"] === "Female"
        ).length,
       }
    ];
    setAreaChartData(stackedAreaChartData);

    // Update the data for Scatter Plot
    let monthly_incomes = [];
    let ages = [];
    for (const val of temp_data) {
      monthly_incomes.push(val["MonthlyIncome"]);
      ages.push(val["Age"]);
    }
    let scatter_plot_data = getScatterPlotData(monthly_incomes, ages);
    setScatterPlotData(scatter_plot_data);
  };

  const pieChartAttritionHandler = (filterParameter) => {

    // Update the globalData variable
    let temp_data = globalData.filter(
      (d) => d["Attrition"] === filterParameter
    );

    // Update the data for Parallel Coordinates plot.
    setPcpData(temp_data);

    // Update the JSON values for Tree Map.
    let json_data = getJsonData(temp_data);
    setTreeMapData(json_data);

    // Update data for Bar Chart Chart
    let tempData = [
      {
        "Level of Education": "College",
        Frequency: temp_data.filter((d) => d["LevelofEducation"] === "College")
          .length,
      },
      {
        "Level of Education": "Masters",
        Frequency: temp_data.filter((d) => d["LevelofEducation"] === "Masters")
          .length,
      },
      {
        "Level of Education": "Bachelors",
        Frequency: temp_data.filter(
          (d) => d["LevelofEducation"] === "Bachelors"
        ).length,
      },
      {
        "Level of Education": "Doctorate",
        Frequency: temp_data.filter(
          (d) => d["LevelofEducation"] === "Doctorate"
        ).length,
      },
    ];
    setBarData(tempData);

    // Update data for Gender Pie Chart
    let genderDataArr = temp_data.map((d) => d["Gender"]);
    let female_count = genderDataArr.filter((d) => d === "Female").length;
    let male_count = genderDataArr.filter((d) => d === "Male").length;
    let arr = [];
    arr.push(
      { Gender: "Female", count: female_count },
      { Gender: "Male", count: male_count }
    );
    setGenderPieChartData(arr);

    // Update the data for the Choropleth map
    let geoData = getGeoMapData(temp_data);
    setGeoMapData(geoData);

    // Set the Stacked Area Chart Data
    let stackedAreaChartData = [
      {
        "Level of Job": "Senior",
        Male: temp_data.filter(
          (d) => d["LevelofJob"] === "Senior Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Senior Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "Middle",
        Male: temp_data.filter(
          (d) => d["LevelofJob"] === "Middle Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Middle Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "First Level",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "First Level Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "First Level Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "Intermediate",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Intermediate" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Intermediate" && d["Gender"] === "Female"
        ).length,
      },
       {
        "Level of Job": "Entry",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Entry Level" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Entry Level" && d["Gender"] === "Female"
        ).length,
       }
    ];
    setAreaChartData(stackedAreaChartData);

    // Update the data for Scatter Plot
    let monthly_incomes = [];
    let ages = [];
    for (const val of temp_data) {
      monthly_incomes.push(val["MonthlyIncome"]);
      ages.push(val["Age"]);
    }
    let scatter_plot_data = getScatterPlotData(monthly_incomes, ages);
    setScatterPlotData(scatter_plot_data);
  };

  const barChartHandler = (filterParameter) => {

    // Update the globalData variable
    let temp_data = globalData.filter(
      (d) => d["LevelofEducation"] === filterParameter
    );

    // Update the data for Parallel Coordinates plot.
    setPcpData(temp_data);

    // Update the JSON values for Tree Map.
    let json_data = getJsonData(temp_data);
    setTreeMapData(json_data);

    // Update data for Gender Pie Chart
    let genderDataArr = temp_data.map((d) => d["Gender"]);
    let female_count = genderDataArr.filter((d) => d === "Female").length;
    let male_count = genderDataArr.filter((d) => d === "Male").length;
    let arr = [];
    arr.push(
      { Gender: "Female", count: female_count },
      { Gender: "Male", count: male_count }
    );
    setGenderPieChartData(arr);

    // Update data for Attrition Pie Chart
    let temp_attrition_data = temp_data.map((d) => d["Attrition"]);
    let yes_count = temp_attrition_data.filter((d) => d === "Yes").length;
    let no_count = temp_attrition_data.filter((d) => d === "No").length;
    let tempArr = [];
    tempArr.push(
      { Attrition: "Yes", count: yes_count },
      { Attriton: "No", count: no_count }
    );
    setAttritionPieChartData(tempArr);

    // Update the data for the Choropleth map
    let geoData = getGeoMapData(temp_data);
    setGeoMapData(geoData);

    // Set the Stacked Area Chart Data
    let stackedAreaChartData = [
      {
        "Level of Job": "Senior",
        Male: temp_data.filter(
          (d) => d["LevelofJob"] === "Senior Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Senior Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "Middle",
        Male: temp_data.filter(
          (d) => d["LevelofJob"] === "Middle Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Middle Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "First Level",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "First Level Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "First Level Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "Intermediate",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Intermediate" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Intermediate" && d["Gender"] === "Female"
        ).length,
      },
       {
        "Level of Job": "Entry",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Entry Level" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Entry Level" && d["Gender"] === "Female"
        ).length,
       }
    ];
    setAreaChartData(stackedAreaChartData);

    // Update the data for Scatter Plot
    let monthly_incomes = [];
    let ages = [];
    for (const val of temp_data) {
      monthly_incomes.push(val["MonthlyIncome"]);
      ages.push(val["Age"]);
    }
    let scatter_plot_data = getScatterPlotData(monthly_incomes, ages);
    setScatterPlotData(scatter_plot_data);
  };

  const stackedAreaChartHandler = (filterParameter) => {

    // Update the globalData variable
    let temp_data = globalData.filter(
      (d) => d["LevelofJob"] === filterParameter
    );

    // Update the data for Parallel Coordinates plot.
    setPcpData(temp_data);

    // Update the JSON values for Tree Map.
    let json_data = getJsonData(temp_data);
    setTreeMapData(json_data);

    // Update data for Bar Chart Chart
    let tempData = [
      {
        "Level of Education": "College",
        Frequency: temp_data.filter((d) => d["LevelofEducation"] === "College")
          .length,
      },
      {
        "Level of Education": "Masters",
        Frequency: temp_data.filter((d) => d["LevelofEducation"] === "Masters")
          .length,
      },
      {
        "Level of Education": "Bachelors",
        Frequency: temp_data.filter(
          (d) => d["LevelofEducation"] === "Bachelors"
        ).length,
      },
      {
        "Level of Education": "Doctorate",
        Frequency: temp_data.filter(
          (d) => d["LevelofEducation"] === "Doctorate"
        ).length,
      },
    ];
    setBarData(tempData);

    // Update data for Gender Pie Chart
    let genderDataArr = temp_data.map((d) => d["Gender"]);
    let female_count = genderDataArr.filter((d) => d === "Female").length;
    let male_count = genderDataArr.filter((d) => d === "Male").length;
    let arr = [];
    arr.push(
      { Gender: "Female", count: female_count },
      { Gender: "Male", count: male_count }
    );
    setGenderPieChartData(arr);

    // Update data for Attrition Pie Chart
    let temp_attrition_data = temp_data.map((d) => d["Attrition"]);
    let yes_count = temp_attrition_data.filter((d) => d === "Yes").length;
    let no_count = temp_attrition_data.filter((d) => d === "No").length;
    let tempArr = [];
    tempArr.push(
      { Attrition: "Yes", count: yes_count },
      { Attriton: "No", count: no_count }
    );
    setAttritionPieChartData(tempArr);

    // Update the data for the Choropleth map
    let geoData = getGeoMapData(temp_data);
    setGeoMapData(geoData);

    // Update the data for Scatter Plot
    let monthly_incomes = [];
    let ages = [];
    for (const val of temp_data) {
      monthly_incomes.push(val["MonthlyIncome"]);
      ages.push(val["Age"]);
    }
    let scatter_plot_data = getScatterPlotData(monthly_incomes, ages);
    setScatterPlotData(scatter_plot_data);
  };

  const scatterPlotHandler = (filtered_array) => {
    let selected_data = {
      MonthlyIncome: [],
      Age: [],
    };
    for (const income_detail of filtered_array) {
      selected_data["MonthlyIncome"].push(income_detail.x);
      selected_data["Age"].push(income_detail.y.toString());
    }

    let temp_data = globalData;
    for (const val in selected_data) {
      if (selected_data[val].length !== 0) {
        temp_data = temp_data.filter((eachRow) => {
          if (val === "MonthlyIncome") {
            return selected_data[val].includes(+eachRow[val]);
          }
          return selected_data[val].includes(eachRow[val]);
        });
      }
    }

    // Update the data for Parallel Coordinates plot.
    setPcpData(temp_data);

    // Update the JSON values for Tree Map.
    let json_data = getJsonData(temp_data);
    setTreeMapData(json_data);

    // Update data for Bar Chart Chart
    let tempData = [
      {
        "Level of Education": "College",
        Frequency: temp_data.filter((d) => d["LevelofEducation"] === "College")
          .length,
      },
      {
        "Level of Education": "Masters",
        Frequency: temp_data.filter((d) => d["LevelofEducation"] === "Masters")
          .length,
      },
      {
        "Level of Education": "Bachelors",
        Frequency: temp_data.filter(
          (d) => d["LevelofEducation"] === "Bachelors"
        ).length,
      },
      {
        "Level of Education": "Doctorate",
        Frequency: temp_data.filter(
          (d) => d["LevelofEducation"] === "Doctorate"
        ).length,
      },
    ];
    setBarData(tempData);

    // Update data for Attrition Pie Chart
    let temp_attrition_data = temp_data.map((d) => d["Attrition"]);
    let yes_count = temp_attrition_data.filter((d) => d === "Yes").length;
    let no_count = temp_attrition_data.filter((d) => d === "No").length;
    let tempArr = [];
    tempArr.push(
      { Attrition: "Yes", count: yes_count },
      { Attriton: "No", count: no_count }
    );
    setAttritionPieChartData(tempArr);

    // Update the data for the Choropleth map
    let geoData = getGeoMapData(temp_data);
    setGeoMapData(geoData);

    // Update data for Gender Pie Chart
    let genderDataArr = temp_data.map((d) => d["Gender"]);
    let female_count = genderDataArr.filter((d) => d === "Female").length;
    let male_count = genderDataArr.filter((d) => d === "Male").length;
    let arr = [];
    arr.push(
      { Gender: "Female", count: female_count },
      { Gender: "Male", count: male_count }
    );
    setGenderPieChartData(arr);

    // Set the Stacked Area Chart Data
    let stackedAreaChartData = [
      {
        "Level of Job": "Senior",
        Male: temp_data.filter(
          (d) => d["LevelofJob"] === "Senior Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Senior Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "Middle",
        Male: temp_data.filter(
          (d) => d["LevelofJob"] === "Middle Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Middle Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "First Level",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "First Level Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "First Level Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "Intermediate",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Intermediate" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Intermediate" && d["Gender"] === "Female"
        ).length,
      },
       {
        "Level of Job": "Entry",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Entry Level" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Entry Level" && d["Gender"] === "Female"
        ).length,
       }
    ];
    setAreaChartData(stackedAreaChartData);
  };

  const parallelCoordinatesPlotHandler = (selected_array) => {
    console.log("The selected Array: ", selected_array);
    if (Object.keys(selected_array).length === 0) {
      return;
    }
    let data_length = globalData.length;
    let temp_store = {
      LevelofJob: [],
      MonthlyIncome: [],
      Attrition: [],
      Gender: [],
      Department: [],
      JobRole: [],
      Age: [],
      DistanceFromHome: [],
      EducationField: [],
      NumCompaniesWorked: [],
      PercentSalaryHike: [],
      TotalWorkingYears: [],
      YearsAtCompany: [],
      YearsInCurrentRole: [],
      YearsSinceLastPromotion: [],
      JobSatisfaction: [],
      State: [],
    };

    for (const key in selected_array) {
      for (const value of selected_array[key]) {
        if (key === "MonthlyIncome") {
          if (!temp_store[key].includes(+value)) {
            temp_store[key].push(+value);
          }
        } else {
          if (!temp_store[key].includes(value)) {
            temp_store[key].push(value);
          }
        }
      }
    }

    let temp_data = globalData;
    for (const val in temp_store) {
      if (temp_store[val].length !== 0) {
        temp_data = temp_data.filter((eachRow) => {
          if (val === "MonthlyIncome") {
            return temp_store[val].includes(+eachRow[val]);
          }
          return temp_store[val].includes(eachRow[val]);
        });
      }
    }

    if (data_length === temp_data.length) {
      return;
    }

    // Update data for Bar Chart Chart
    let tempData = [
      {
        "Level of Education": "College",
        Frequency: temp_data.filter((d) => d["LevelofEducation"] === "College")
          .length,
      },
      {
        "Level of Education": "Masters",
        Frequency: temp_data.filter((d) => d["LevelofEducation"] === "Masters")
          .length,
      },
      {
        "Level of Education": "Bachelors",
        Frequency: temp_data.filter(
          (d) => d["LevelofEducation"] === "Bachelors"
        ).length,
      },
      {
        "Level of Education": "Doctorate",
        Frequency: temp_data.filter(
          (d) => d["LevelofEducation"] === "Doctorate"
        ).length,
      },
    ];
    setBarData(tempData);

    // Update the JSON values for Tree Map.
    let json_data = getJsonData(temp_data);
    setTreeMapData(json_data);

    // Update data for Attrition Pie Chart
    let temp_attrition_data = temp_data.map((d) => d["Attrition"]);
    let yes_count = temp_attrition_data.filter((d) => d === "Yes").length;
    let no_count = temp_attrition_data.filter((d) => d === "No").length;
    let tempArr = [];
    tempArr.push(
      { Attrition: "Yes", count: yes_count },
      { Attriton: "No", count: no_count }
    );
    setAttritionPieChartData(tempArr);

    // Update the data for the Choropleth map
    let geoData = getGeoMapData(temp_data);
    setGeoMapData(geoData);

    // Update data for Gender Pie Chart
    let genderDataArr = temp_data.map((d) => d["Gender"]);
    let female_count = genderDataArr.filter((d) => d === "Female").length;
    let male_count = genderDataArr.filter((d) => d === "Male").length;
    let arr = [];
    arr.push(
      { Gender: "Female", count: female_count },
      { Gender: "Male", count: male_count }
    );
    setGenderPieChartData(arr);

    // Set the Stacked Area Chart Data
    let stackedAreaChartData = [
      {
        "Level of Job": "Senior",
        Male: temp_data.filter(
          (d) => d["LevelofJob"] === "Senior Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Senior Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "Middle",
        Male: temp_data.filter(
          (d) => d["LevelofJob"] === "Middle Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Middle Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "First Level",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "First Level Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "First Level Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "Intermediate",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Intermediate" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Intermediate" && d["Gender"] === "Female"
        ).length,
      },
       {
        "Level of Job": "Entry",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Entry Level" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Entry Level" && d["Gender"] === "Female"
        ).length,
       }
    ];
    setAreaChartData(stackedAreaChartData);

    // Update the data for Scatter Plot
    let monthly_incomes = [];
    let ages = [];
    for (const val of temp_data) {
      monthly_incomes.push(val["MonthlyIncome"]);
      ages.push(val["Age"]);
    }
    let scatter_plot_data = getScatterPlotData(monthly_incomes, ages);
    setScatterPlotData(scatter_plot_data);
  };

  const choroplethMapHandler = (filterParameter) => {
    if (stateStore["State"].includes(filterParameter)) {
      let index = stateStore["State"].indexOf(filterParameter);
      let temp = stateStore["State"].splice(index, 1);
      setStateStore(temp);
    } else {
      let temp = stateStore["State"].push(filterParameter);
      setStateStore(temp);
    }

    let temp_data = globalData;
    for (const val in stateStore) {
      if (stateStore[val].length !== 0) {
        temp_data = temp_data.filter((eachRow) => {
          if (val === "MonthlyIncome") {
            return stateStore[val].includes(+eachRow[val]);
          }
          return stateStore[val].includes(eachRow[val]);
        });
      }
    }

    // Update the data for Parallel Coordinates plot.
    setPcpData(temp_data);

    // Update the JSON values for Tree Map.
    let json_data = getJsonData(temp_data);
    setTreeMapData(json_data);

    // Update data for Bar Chart Chart
    let tempData = [
      {
        "Level of Education": "College",
        Frequency: temp_data.filter((d) => d["LevelofEducation"] === "College")
          .length,
      },
      {
        "Level of Education": "Masters",
        Frequency: temp_data.filter((d) => d["LevelofEducation"] === "Masters")
          .length,
      },
      {
        "Level of Education": "Bachelors",
        Frequency: temp_data.filter(
          (d) => d["LevelofEducation"] === "Bachelors"
        ).length,
      },
      {
        "Level of Education": "Doctorate",
        Frequency: temp_data.filter(
          (d) => d["LevelofEducation"] === "Doctorate"
        ).length,
      },
    ];
    setBarData(tempData);

    // Update data for Attrition Pie Chart
    let temp_attrition_data = temp_data.map((d) => d["Attrition"]);
    let yes_count = temp_attrition_data.filter((d) => d === "Yes").length;
    let no_count = temp_attrition_data.filter((d) => d === "No").length;
    let tempArr = [];
    tempArr.push(
      { Attrition: "Yes", count: yes_count },
      { Attriton: "No", count: no_count }
    );
    setAttritionPieChartData(tempArr);

    // Update data for Gender Pie Chart
    let genderDataArr = temp_data.map((d) => d["Gender"]);
    let female_count = genderDataArr.filter((d) => d === "Female").length;
    let male_count = genderDataArr.filter((d) => d === "Male").length;
    let arr = [];
    arr.push(
      { Gender: "Female", count: female_count },
      { Gender: "Male", count: male_count }
    );
    setGenderPieChartData(arr);

    // Set the Stacked Area Chart Data
    let stackedAreaChartData = [
      {
        "Level of Job": "Senior",
        Male: temp_data.filter(
          (d) => d["LevelofJob"] === "Senior Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Senior Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "Middle",
        Male: temp_data.filter(
          (d) => d["LevelofJob"] === "Middle Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Middle Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "First Level",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "First Level Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "First Level Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "Intermediate",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Intermediate" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Intermediate" && d["Gender"] === "Female"
        ).length,
      },
       {
        "Level of Job": "Entry",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Entry Level" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Entry Level" && d["Gender"] === "Female"
        ).length,
       }
    ];
    setAreaChartData(stackedAreaChartData);

    // Update the data for Scatter Plot
    let monthly_incomes = [];
    let ages = [];
    for (const val of temp_data) {
      monthly_incomes.push(val["MonthlyIncome"]);
      ages.push(val["Age"]);
    }
    let scatter_plot_data = getScatterPlotData(monthly_incomes, ages);
    setScatterPlotData(scatter_plot_data);
  };

  const treeMapHandler = (filterParameter) => {
    let temp_data = globalData.filter(
      (d) =>
        d["JobRole"] === filterParameter["JobRole"] &&
        d["Attrition"] === filterParameter["Attrition"]
    );

    // Update the data for Parallel Coordinates plot.
    setPcpData(temp_data);

    // Update the data for the Choropleth map
    let geoData = getGeoMapData(temp_data);
    setGeoMapData(geoData);

    // Update data for Bar Chart Chart
    let tempData = [
      {
        "Level of Education": "College",
        Frequency: temp_data.filter((d) => d["LevelofEducation"] === "College")
          .length,
      },
      {
        "Level of Education": "Masters",
        Frequency: temp_data.filter((d) => d["LevelofEducation"] === "Masters")
          .length,
      },
      {
        "Level of Education": "Bachelors",
        Frequency: temp_data.filter(
          (d) => d["LevelofEducation"] === "Bachelors"
        ).length,
      },
      {
        "Level of Education": "Doctorate",
        Frequency: temp_data.filter(
          (d) => d["LevelofEducation"] === "Doctorate"
        ).length,
      },
    ];
    setBarData(tempData);

    // Update data for Attrition Pie Chart
    let temp_attrition_data = temp_data.map((d) => d["Attrition"]);
    let yes_count = temp_attrition_data.filter((d) => d === "Yes").length;
    let no_count = temp_attrition_data.filter((d) => d === "No").length;
    let tempArr = [];
    tempArr.push(
      { Attrition: "Yes", count: yes_count },
      { Attriton: "No", count: no_count }
    );
    setAttritionPieChartData(tempArr);

    // Update data for Gender Pie Chart
    let genderDataArr = temp_data.map((d) => d["Gender"]);
    let female_count = genderDataArr.filter((d) => d === "Female").length;
    let male_count = genderDataArr.filter((d) => d === "Male").length;
    let arr = [];
    arr.push(
      { Gender: "Female", count: female_count },
      { Gender: "Male", count: male_count }
    );
    setGenderPieChartData(arr);

    // Set the Stacked Area Chart Data
    let stackedAreaChartData = [
      {
        "Level of Job": "Senior",
        Male: temp_data.filter(
          (d) => d["LevelofJob"] === "Senior Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Senior Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "Middle",
        Male: temp_data.filter(
          (d) => d["LevelofJob"] === "Middle Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Middle Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "First Level",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "First Level Management" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "First Level Management" && d["Gender"] === "Female"
        ).length,
      },
      {
        "Level of Job": "Intermediate",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Intermediate" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Intermediate" && d["Gender"] === "Female"
        ).length,
      },
       {
        "Level of Job": "Entry",
        Male: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Entry Level" && d["Gender"] === "Male"
        ).length,
        Female: temp_data.filter(
          (d) =>
            d["LevelofJob"] === "Entry Level" && d["Gender"] === "Female"
        ).length,
       }
    ];
    setAreaChartData(stackedAreaChartData);

    // Update the data for Scatter Plot
    let monthly_incomes = [];
    let ages = [];
    for (const val of temp_data) {
      monthly_incomes.push(val["MonthlyIncome"]);
      ages.push(val["Age"]);
    }
    let scatter_plot_data = getScatterPlotData(monthly_incomes, ages);
    setScatterPlotData(scatter_plot_data);
  };

  const resetHandler = ()=> {
    setResetFalg((prev)=> {
      return !prev;
    })
  }

  return (
    <React.Fragment>
      <header>
      <div id="heading" className="heading">
        <h1>Visual Analytics on Employee’s Attrition Rate
            <button id="reset" onClick={resetHandler} style={{float: 'right'}}>Reset</button>
        </h1>
    </div>
      </header>
      <div id="section1">
      <div id="box1">
      <ChloroplethMaps
              data={geoMapData}
              parentRef={tooltipRef}
              onChoroplethMapClick={choroplethMapHandler}
            />
      </div>
    <div id="box2">
    <BarChart data={barData} onBarChartClick={barChartHandler}/>
    </div>
    <div id="box3">
    <ScatterPlot
              data={scatterPlotData}
              onScatterPlotClick={scatterPlotHandler}
            />
    </div>
    <div id="pie-charts">
    <PieChartAttrition
              data={attritionPieChartData}
              parentRef={tooltipRef}
              onPieChartAttritionClick={pieChartAttritionHandler}
            />
      <PieChartGender
              data={genderPieChartData}
              parentRef={tooltipRef}
              onPieChartGenderClick={pieChartGenderHandler}
            />
    </div>
      </div>
      <div id="section2">
        <div id="box4">
        <TreeMap
              parentRef={tooltipRef}
              data={treeMapData}
              onTreeMapClick={treeMapHandler}
            />
        </div>
        <div id="box5">
      <StackedAreaChart data={areaChartData} onStackedAreaChartClick = {stackedAreaChartHandler}/>
        </div>
        <div id="box6">
        <ParallelCoordinatesPlot
              data={pcpData}
              onParallelCoordinatesPlotClick={parallelCoordinatesPlotHandler}
            />
        </div>
      </div>
      <div ref={tooltipRef}></div>
      {/* <Layout style={{ height: 1000 }}>
        <Sider width={300} style={{ backgroundColor: "#eee" }}>
          <Content style={{ height: 300 }}>
            <PieChartGender
              data={genderPieChartData}
              parentRef={tooltipRef}
              onPieChartGenderClick={pieChartGenderHandler}
            />
          </Content>
          <Content style={{ height: 300 }}>
            <PieChartAttrition
              data={attritionPieChartData}
              parentRef={tooltipRef}
              onPieChartAttritionClick={pieChartAttritionHandler}
            />
          </Content>
          <Content style={{ height: 300 }}>
            <h1>The third Component</h1>
          </Content>
        </Sider>
        <Layout>
          <Content style={{ height: 450, width: 800, flex: "none" }}>
            <ScatterPlot
              data={scatterPlotData}
              onScatterPlotClick={scatterPlotHandler}
            />
            <StackedAreaChart data={areaChartData} onStackedAreaChartClick = {stackedAreaChartHandler}/>
            <BarChart data={dataState} chartVariable={'Education'}/>
            <BarChart data={barData} onBarChartClick={barChartHandler}/>
          </Content>
          <Content style={{ height: 510, width: 800, flex: "none" }}>
            <TreeMap
              parentRef={tooltipRef}
              data={treeMapData}
              onTreeMapClick={treeMapHandler}
            />
          </Content>
        </Layout>
        <Layout>
          <Content style={{ height: 450, width: 800, flex: "none" }}>
            <ChloroplethMaps
              data={geoMapData}
              parentRef={tooltipRef}
              onChoroplethMapClick={choroplethMapHandler}
            />
          </Content>
          <Content>
            <ParallelCoordinatesPlot
              data={pcpData}
              onParallelCoordinatesPlotClick={parallelCoordinatesPlotHandler}
            />
          </Content>
        </Layout>
      </Layout>
      <div ref={tooltipRef}></div> */}
    </React.Fragment>
  );
}

export default App;
