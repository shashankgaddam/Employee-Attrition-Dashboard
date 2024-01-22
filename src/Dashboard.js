import React, { useState } from "react";
import data from "./data";
import { Layout } from "antd";
import View1 from "./views/View1";
import View2 from "./views/View2";
import View3 from "./views/View3";
import View4 from "./views/View4";
//import View5 from "./views/View5";
import View6 from "./views/View6";
import "./dashboard.css";
import BarChart from "./charts/BarChart";

const { Sider, Content, Footer } = Layout;

export default function Dashboard() {
  const [selectedUser, setSelectedUser] = useState(data[0]);
  const [greaterThenAge, setGreaterThenAge] = useState(0);
  const [includedGender, setIncludedGender] = useState([
    "Male",
    "Female",
    "Unknown",
  ]);

  const changeSelectUser = (value) => {
    setSelectedUser(value);
  };

  const changeGreaterThenAge = (value) => {
    setGreaterThenAge(value);
  };

  const changeIncludedGender = (value) => {
    setIncludedGender(value);
  };

  const filteredData = data
    .filter((user) => includedGender.indexOf(user.gender) !== -1)
    .filter((user) => user.age > greaterThenAge);

  return (
    <div>
      <Layout style={{ height: 920 }}>
        <Sider width={300} style={{ backgroundColor: "#eee" }}>
          <Content style={{ height: 200 }}>
            <View1 user={selectedUser} />
          </Content>
          <Content style={{ height: 300 }}>
            <View2 data={filteredData} />
          </Content>
          <Content style={{ height: 400 }}>
            <View3
              changeGreaterThenAge={changeGreaterThenAge}
              changeIncludedGender={changeIncludedGender}
            />
          </Content>
        </Sider>
        <Layout>
          <Content style={{ height: 450, width: 800, flex: 'none'}}>
            <View4 user={selectedUser} />
          </Content>
          <Content>
            <h1>
                This is Q3
            </h1>
          </Content>
        </Layout>
        <Layout style={{ height: 600 }}>
          <Content>
            <BarChart/>
          </Content>
          <Content>
            <h1>
                This is Q4
            </h1>
          </Content>
        </Layout>
      </Layout>
      <Layout>
        <Footer style={{ height: 20 }}>
          <div style={{ marginTop: -10 }}>
            Source Code{" "}
            <a href="https://github.com/sdq/react-d3-dashboard">
              https://github.com/sdq/react-d3-dashboard
            </a>
            ; Author <a href="https://sdq.ai">sdq</a>;
          </div>
        </Footer>
      </Layout>
    </div>
  );
}
