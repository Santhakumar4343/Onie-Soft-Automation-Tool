import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
} from "recharts";

const BarChartComponent = ({ data, colors, dataKey,  totalCases }) => {
  // Constructing the payload for the legend
  const legendPayload = [
    {
      value: `Total Test Cases (${totalCases})`,
      type: "square",
      id: "total",
      color: "#0000FF", // Blue color for the total legend item
    },
    ...data.map((item) => ({
      value: `${item.name} (${item.value})`,
      type: "square",
      id: item.name,
      color: item.color,
    })),
  ];

  return (
    <div>
    
      <BarChart width={300} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} test cases`]} />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          payload={legendPayload}
        />
        <Bar dataKey={dataKey} >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
};

export default BarChartComponent;
