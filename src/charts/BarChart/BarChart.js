import React from "react";
import * as d3 from "d3";

const BarChart = () => {
  var variables = [
    "Age",
    "Attrition",
    "BusinessTravel",
    "Department",
    "DistanceFromHome",
    "Education",
    "EducationField",
    "EmployeeNumber",
    "EnvironmentSatisfaction",
    "Gender",
    "HourlyRate",
    "JobInvolvement",
    "JobLevel",
    "JobRole",
    "JobSatisfaction",
    "MaritalStatus",
    "MonthlyIncome",
    "MonthlyRate",
    "NumCompaniesWorked",
    "OverTime",
    "PercentSalaryHike",
    "PerformanceRating",
    "RelationshipSatisfaction",
    "StandardHours",
    "StockOptionLevel",
    "TotalWorkingYears",
    "TrainingTimesLastYear",
    "WorkLifeBalance",
    "YearsAtCompany",
    "YearsInCurrentRole",
    "YearsSinceLastPromotion",
    "YearsWithCurrManager",
  ];
  var variable_selected = "Age";
  var sidebar = document.getElementById("mySidebar");
  var toggles = document.querySelectorAll(
    'input[type=radio][name="toggle_options"]'
  );
  var orientation = "V";
  toggles.forEach((toggle) =>
    toggle.addEventListener("change", () => updateToggle(toggle.value))
  );

  var margin = { top: 30, right: 30, bottom: 120, left: 100 },
    width = 460 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

  function updateToggle(value) {
    orientation = value;
    plot();
  }
  for (let i = 0; i < variables.length; i++) {
    var variable = variables[i];
    sidebar.innerHTML += `<a id=${variable}>${variable}</a>`;
  }

  function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }

  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  }

  variables.forEach(function (variable, index) {
    document.getElementById(variable).addEventListener("click", function () {
      closeNav();
      variable_selected = variable;
      plot();
    });
  });

  function plot() {
    var variable_name = variable_selected;
    d3.csv(
      "https://raw.githubusercontent.com/chanduch1999/Golang_practice/master/data-sampled.csv",
      (data) => {
        var value = data[0][variable_name];
        var is_number = true;
        if (isNaN(value)) is_number = false;

        if (is_number) {
          if (orientation === "V") {
            updateHist(variable_name, 10);
          } else updateHistH(variable_name, 10);
        } else {
          if (orientation === "V") updateBar(variable_name);
          else updateBarH(variable_name);
        }
      }
    );
  }

  var svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  function updateHist(variable_name, nBin) {
    svg.selectAll("*").remove();

    d3.csv(
      "https://raw.githubusercontent.com/chanduch1999/Golang_practice/master/data-sampled.csv",
      function (data) {
        var x = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => +d[variable_name])])
          .range([0, width]);

        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        var y = d3.scaleLinear().range([height, 0]);
        var yAxis = svg.append("g");

        var histogram = d3
          .histogram()
          .value((d) => d[variable_name])
          .domain(x.domain())
          .thresholds(x.ticks(nBin));

        var bins = histogram(data);

        y.domain([0, d3.max(bins, (d) => d.length)]);

        yAxis.transition().duration(1000).call(d3.axisLeft(y));

        var u = svg.selectAll("rect").data(bins);

        u.enter()
          .append("rect")
          .attr("x", 1)
          .attr("transform", function (d) {
            return "translate(" + x(d.x0) + "," + y(d.length) + ")";
          })
          .attr("width", function (d) {
            return x(d.x1) - x(d.x0) - 1;
          })
          .attr("height", function (d) {
            return height - y(d.length);
          })
          .style("fill", "#000000");

        svg
          .append("text")
          .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top + 35) + ")"
          )
          .style("text-anchor", "middle")
          .text(variable_name);

        svg
          .append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("y", -50)
          .attr("x", -100)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .text("Frequency");

        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", 0 - margin.top / 2)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("text-decoration", "underline")
          .text(variable_name + "'s Histogram");
      }
    );
  }

  function updateBar(variable_name) {
    svg.selectAll("*").remove();

    var x = d3.scaleBand().range([0, width]).padding(0.2);
    var xAxis = svg
      .append("g")
      .attr("transform", "translate(0," + height + ")");

    var y = d3.scaleLinear().range([height, 0]);
    var yAxis = svg.append("g").attr("class", "myYaxis");

    d3.csv(
      "https://raw.githubusercontent.com/chanduch1999/Golang_practice/master/data-sampled.csv",
      (data) => {
        var processed_data = {};

        data.forEach((d) => {
          var variable_val = d[variable_name];
          if (processed_data[variable_val] === undefined) {
            processed_data[variable_val] = 0;
          } else {
            processed_data[variable_val] = processed_data[variable_val] + 1;
          }
        });

        var data_2 = [];

        for (var key in processed_data) {
          if (processed_data.hasOwnProperty(key)) {
            data_2.push({
              variable_name: key,
              value: processed_data[key],
            });
          }
        }

        x.domain(
          data_2.map((d) => {
            return d.variable_name;
          })
        );

        xAxis.call(d3.axisBottom(x));

        svg
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-44)");

        y.domain([
          0,
          d3.max(data_2, (d) => {
            return d.value;
          }),
        ]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));

        var u = svg.selectAll("rect").data(data_2);

        u.enter()
          .append("rect")
          .attr("x", (d) => {
            return x(d.variable_name);
          })
          .attr("y", (d) => {
            return y(d.value);
          })
          .attr("width", x.bandwidth())
          .attr("height", (d) => {
            return height - y(d.value);
          })
          .attr("fill", "#000000");

        svg
          .append("text")
          .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top + 85) + ")"
          )
          .style("text-anchor", "middle")
          .text(variable_name);

        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", 0 - margin.top / 2)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("text-decoration", "underline")
          .text(variable_name + "'s Barplot");

        svg
          .append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("y", -50)
          .attr("x", -100)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .text("Frequency");

        u.exit().remove();
      }
    );
  }

  function updateBarH(variable_name) {
    d3.csv(
      "https://raw.githubusercontent.com/chanduch1999/Golang_practice/master/data-sampled.csv",
      function (data) {
        svg.selectAll("*").remove();
        var processed_data = {};

        data.forEach((d) => {
          var variable_val = d[variable_name];
          if (processed_data[variable_val] === undefined) {
            processed_data[variable_val] = 0;
          } else {
            processed_data[variable_val] = processed_data[variable_val] + 1;
          }
        });

        var data_2 = [];

        for (var key in processed_data) {
          if (processed_data.hasOwnProperty(key)) {
            data_2.push({
              variable: key,
              value: processed_data[key],
            });
          }
        }

        var x = d3
          .scaleLinear()
          .domain([
            0,
            d3.max(data_2, (d) => {
              return d.value;
            }),
          ])
          .range([0, width]);
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");

        var y = d3
          .scaleBand()
          .range([0, height])
          .domain(
            data_2.map(function (d) {
              return d.variable;
            })
          )
          .padding(0.1);
        svg.append("g").call(d3.axisLeft(y));

        svg
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-55)");

        svg
          .append("text")
          .attr("class", "x label")
          .attr("text-anchor", "end")
          .attr(
            "transform",
            "translate(" +
              (margin.left + width / 2 - 20) +
              "," +
              (height + margin.top + 20) +
              ")"
          )
          .text("Frequency");

        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", 0 - margin.top / 2)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("text-decoration", "underline")
          .text(variable_name + "'s Barplot");

        svg
          .append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("y", -90)
          .attr("x", -100)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .text(variable_name);

        var u = svg.selectAll("rect").data(data_2);

        svg
          .selectAll("myRect")
          .data(data_2)
          .enter()
          .append("rect")
          .attr("x", x(0))
          .attr("y", function (d) {
            return y(d.variable);
          })
          .attr("width", function (d) {
            return x(d.value);
          })
          .attr("height", y.bandwidth())
          .attr("fill", "#000000");
      }
    );
  }

  function updateHistH(variable_name, nBin) {
    svg.selectAll("*").remove();

    d3.csv(
      "https://raw.githubusercontent.com/chanduch1999/Golang_practice/master/data-sampled.csv",
      function (data) {
        var x = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => +d[variable_name])])
          .range([height, 0]);

        svg.append("g").call(d3.axisLeft(x));

        var histogram = d3
          .histogram()
          .value(function (d) {
            return d[variable_name];
          })
          .domain(x.domain())
          .thresholds(x.ticks(10));

        var bins = histogram(data);

        var y = d3.scaleLinear().range([0, width]);
        y.domain([
          0,
          d3.max(bins, function (d) {
            return d.length;
          }),
        ]); // d3.hist has to be called before the Y axis obviously

        svg
          .append("g")
          .call(d3.axisBottom(y))
          .attr("transform", "translate(0," + height + ")");

        svg
          .selectAll("rect")
          .data(bins)
          .enter()
          .append("rect")
          .attr("x", 1)
          .attr("transform", function (d) {
            return "translate(" + "0," + x(d.x1) + ")";
          })
          .attr("width", function (d) {
            return y(d.length);
          })
          .attr("height", function (d) {
            return x(d.x0) - x(d.x1) - 1;
          })
          .style("fill", "#000000");

        svg
          .append("text")
          .attr("class", "x label")
          .attr("text-anchor", "end")
          .attr(
            "transform",
            "translate(" +
              (margin.left + width / 2 - 20) +
              "," +
              (height + margin.top + 20) +
              ")"
          )
          .text("Frequency");

        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", 0 - margin.top / 2)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("text-decoration", "underline")
          .text(variable_name + "'s Histogram");

        svg
          .append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("y", -70)
          .attr("x", -100)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .text(variable_name);
      }
    );
  }

  return (
    <React.Fragment>
      <div id="main">
        <button class="openbtn" onclick="openNav()">
          Select a Variable
        </button>
        <div class="toggle" data-toggle="buttons" style={{ marginTop: "10px" }}>
          <label class="toggle">
            <input
              type="radio"
              name="toggle_options"
              id="option1"
              checked
              value="V"
            />{" "}
            Vertical
          </label>
          <label class="toggle">
            <input type="radio" name="toggle_options" id="option2" value="H" />{" "}
            Horizontal
          </label>
        </div>
      </div>

      <div id="my_dataviz"></div>
    </React.Fragment>
  );
};

export default BarChart;
