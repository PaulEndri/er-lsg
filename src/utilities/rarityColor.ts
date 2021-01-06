const rarityColorMap = {
  Common: "grey",
  Rare: "blue",
  Uncommon: "green",
  Epic: "purple",
  Legendary: "yellow",
  Legend: "yellow",
};

const rarityGbMap = {
  Common: "rgba(118, 118, 118, 1)",
  Rare: "rgba(33, 133, 208, 1)",
  Uncommon: "rgba(33, 186, 69, 1)",
  Epic: "rgba(163, 51, 200, 1)",
  Legendary: "rgba(251, 189, 8, 1)",
  Legend: "rgba(251, 189, 8, 1)",
};
export const rarityColor = (rarity: string) => {
  try {
    return rarityColorMap[rarity];
  } catch (e) {
    console.error(e);
    return rarityColorMap.Common;
  }
};

export const itemRarityBackground = (rarity: string) => {
  try {
    return `linear-gradient(0deg,${rarityGbMap[rarity]},#2b2b2b) `;
  } catch (e) {
    console.error(e);
    return "red";
  }
};
