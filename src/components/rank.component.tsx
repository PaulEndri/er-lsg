import React from "react";
import { Image } from "semantic-ui-react";
import { getImageSrc } from "../utilities/getImageSrc";

const RankMap = {
  1: "Iron",
  2: "Bronze",
  3: "Silver",
  4: "Gold",
  5: "Platinum",
  6: "Diamond",
  7: "Demigod",
  8: "Eternity",
};

type Props = {
  mmr: number;
  label?: boolean;
};

export const getRankLabel = (mmr: number) => {
  const rank = Math.floor(mmr / 400);
  const tier = Math.ceil((mmr - rank * 400) / 100);

  return `${RankMap[rank + 1]} ${tier}`;
};
export const RankComponent: React.FC<Props> = ({ mmr, label = false }) => {
  const rank = Math.floor(mmr / 400);
  const tier = Math.ceil((mmr - rank * 400) / 100);

  return (
    <div>
      <Image size="small" src={getImageSrc(`ranks/${rank + 1}`)} centered />
      {label && (
        <span>
          {RankMap[rank + 1]} {tier}
        </span>
      )}
    </div>
  );
};
