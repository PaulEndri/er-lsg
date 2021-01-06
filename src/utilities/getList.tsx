import { Armors, ArmorType, Item, Weapons, WeaponsLookup, WeaponType } from "erbs-sdk";
import { Types } from "./types";
import { Items } from "erbs-data";

const armorListByType = Object.fromEntries<Item[]>(
  Object.values(Armors).map((key: Armors) => {
    const type = new ArmorType(key);

    return [key, type.loadArmors()];
  })
);

const weaponListByType = Object.fromEntries<Item[]>(
  Object.entries(WeaponsLookup).map(([name, val]) => {
    const type = new WeaponType(val);
    console.log("[sup]", name, val);
    return [name, type.loadWeapons()];
  })
);

const miscListByType = {};

Object.values(Items)
  .filter((item: any) => ["Misc", "Consume", "Special"].includes(item.apiMetaData.category))
  .forEach((item: any) => {
    if (!miscListByType[item.apiMetaData.type]) {
      miscListByType[item.apiMetaData.type] = [];
    }

    miscListByType[item.apiMetaData.type].push(new Item(item));
  });

export const getItemList = (type?: Types | Weapons) => {
  console.log("[item state]", type);
  if (armorListByType[type]) {
    return armorListByType[type];
  } else if (weaponListByType[type]) {
    return weaponListByType[type];
  } else if (type === Types.Weapon) {
    return Object.values(weaponListByType).flat();
  } else {
    return Object.values(armorListByType).flat();
  }
};

export const getMiscListKeys = () => {
  return Object.keys(miscListByType);
};

export const getMiscList = (type) => {
  return type ? miscListByType[type] : Object.values(miscListByType).flat();
};
