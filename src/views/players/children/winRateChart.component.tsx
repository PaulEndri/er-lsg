import React from "react";
import { PieChart } from "react-minimal-pie-chart";

export const WinRateChartComponent = ({
  totalGames,
  totalWins,
  width = "75%",
  style = {},
  title = "",
}) => {
  const gamesData = [
    {
      title: "Other Games",
      value: totalGames - totalWins,
      color: "rgba(200, 155, 144, 0.8)",
    },
    { title: "Games Won", value: totalWins, color: "#2ECC40" },
  ];

  return (
    <div style={{ width, margin: "auto", ...style }}>
      <PieChart
        data={gamesData}
        lineWidth={30}
        labelStyle={{ fill: "white" }}
        totalValue={totalGames}
        labelPosition={0}
        paddingAngle={0}
        label={({ dataEntry }) => title}
      >
        Test
      </PieChart>
    </div>
  );
};
