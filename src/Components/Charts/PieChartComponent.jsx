import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

const PieChartComponent = ({ data }) => {
  // Generate a dynamic color palette based on the number of features
  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      colors.push(`hsl(${(i * 360) / numColors}, 70%, 50%)`); // Hue-based color generation
    }
    return colors;
  };

  const colors = generateColors(data.length);

  return (
    <div>
      
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{
            maxHeight: "100px",
            overflowY: "auto",
            padding: "5px",
          }}
          formatter={(value) => (
            <span>
              {value} ({data.find((item) => item.name === value)?.value || 0})
            </span>
          )}
        />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
