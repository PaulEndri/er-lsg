/* tslint:disable */

import { ICharacterAttribute } from "erbs-sdk";
import React from "react";
import RadarChart from "react-svg-radar-chart";
import "react-svg-radar-chart/build/css/index.css";

interface AttrProps {
  attributeBlock: ICharacterAttribute;
}

export const AttributeChartComponent: React.FC<AttrProps> = ({ attributeBlock }) => {
  const { mastery, controlDifficulty, ...data } = attributeBlock;
  const captions = {
    move: "Mobility",
    disruptor: "CC",
    attack: "Attack",
    assistance: "Support",
    defense: "Def",
  };

  Object.keys(data).forEach((key) => (data[key] = data[key] / 3));

  return <RadarChart data={[{ data, meta: { color: "brown" } }]} captions={captions} size={100} />;
};
