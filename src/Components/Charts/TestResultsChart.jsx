
import { Paper, Typography } from "@mui/material";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

const TestResultsChart = ({ data ,title}) => {
  return (
    <Paper elevation={3} sx={{ padding: 2, margin: 1, flex: "1 1 30%" }}>
     
     <h4>{title}</h4>
      <BarChart width={300} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="PASS" fill="#09ed92" name="Pass" barSize={30} />
        <Bar dataKey="FAIL" fill="#FF0000" name="Fail" barSize={30} />
        <Bar dataKey="SKIP" fill="#FFA500" name="Skip" barSize={30} />
      </BarChart>
    </Paper>
  );
};

export default TestResultsChart;
