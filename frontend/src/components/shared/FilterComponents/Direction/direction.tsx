import React, { useState } from "react";
import { Button, Modal } from "antd";
import { Cell, Pie, PieChart } from "recharts";
import { directionValues } from "../../../../helpers/filterOptions";
import './direction.scss'
import { useDispatch } from "react-redux";
import { setDirection } from "../../../../redux/reduxSlices/filtersSlice";

interface DirectionProps {
  label?: string;
  width?: string;
  text?: string;
  textColor?: string;
}


const Direction: React.FC<DirectionProps> = ({ label, text, width = "100%", textColor='#000' }) => {

  const dispatch = useDispatch();
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCellClick = (entry: any) => {
    dispatch(setDirection(entry.name.toLowerCase()));
    setIsModalOpen(false)
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }: any) => {
    const directionName = directionValues[index]?.name || "";
    const RADIAN = Math.PI / 180;
  
    // Calculate the position for the label within the segment
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={16}
      >
        {directionName}
      </text>
    );
  };
  
  
  return (
    <div className="price-range">
      {label && <span style={{ marginBottom: ".5rem" }}>{label}</span>}
      <Button onClick={() => setIsModalOpen(true)} style={{ width: `${width}`, color: `${textColor}` }}>
        {text}
      </Button>
      <Modal
        title="Choose property direction"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
      >
        <hr />
        <div className="price-range__box">
          <PieChart width={800} height={400}>
            <Pie
              data={directionValues}
              cx={"28%"}
              cy={"50%"}
              innerRadius={65}
              outerRadius={150}
              fill="#8884d8"
              paddingAngle={1}
              dataKey="value"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {directionValues.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  onClick={() => handleCellClick(entry)}
                />
              ))}
            </Pie>
          </PieChart>
        </div>
      </Modal>
    </div>
  );
};

export default Direction;
