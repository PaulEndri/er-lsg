import { Weapons, WeaponsLookup, Items, ItemDictionary, Item, setStaticCache } from "erbs-sdk";
import { Types } from "./types";

setStaticCache();

const LoadedWeapons = [];
const LoadedItems = Object.fromEntries(
  Object.entries(ItemDictionary).map(([name, values]) => {
    const vals = Object.entries(values)
      .filter(([key, val]) => typeof key === "string" && typeof val === "number")
      .map(([, val]) => {
        return Item.Generate(val);
      });

    if (Weapons[name] || WeaponsLookup[name]) {
      LoadedWeapons.push(...vals);
    }

    return [name, vals as Item[]];
  })
);

export const MiscListKeys = ["Beverage", "Material", "Summon", "Food"];

const getArmoredList = () => {
  return LoadedItems["Chest"], LoadedItems["Arm"];
};
export const getList = (val: keyof typeof Items | Types) => {
  if (LoadedItems[val]) {
    return LoadedItems[val];
  }

  if (val === Types.Weapon) {
    return LoadedWeapons;
  }

  if (val === Types.Accessory) {
    return LoadedItems.Trinket;
  }

  return Object.values(LoadedItems).flat();
};

export const getMiscList = (type) => {
  return type ? LoadedItems[type] : MiscListKeys.map((val) => LoadedItems[val]).flat();
};
