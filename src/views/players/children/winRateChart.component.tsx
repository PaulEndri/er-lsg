import React from "react";
import { PieChart } from "react-minimal-pie-chart";

export const WinRateChartComponent = ({ totalGames, totalWins, width = "75%" }) => {
  const gamesData = [
    {
      title: "Other Games",
      value: totalGames - totalWins,
      color: "rgba(138, 129, 127, 1)",
    },
    { title: "Games Won", value: totalWins, color: "rgba(20, 255, 95, 1)" },
  ];

  return (
    <div style={{ width, margin: "auto" }}>
      <PieChart
        data={gamesData}
        lineWidth={30}
        labelStyle={{ fill: "white" }}
        totalValue={totalGames}
        labelPosition={0}
        paddingAngle={0}
        label={({ dataEntry }) => ""}
      >
        Test
      </PieChart>
    </div>
  );
};
