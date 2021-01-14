const prettifyStat = ([first, ...rest]) =>
  first.toUpperCase() +
  rest
    .join("")
    .replace(/([A-Z])/g, " $1")
    .trim();

const uniqueStatMaps = {
  increaseSkillDamage: "Increase Skill Amp.",
  increaseSkillDamageRatio: "Increase Skill Amp.",
  preventSkillDamagedRatio: "Healing Reduction (Normal Attacks)",
  decreateRecoveryToSkill: "Healing Reduction (Skills)",
  preventBasicAttackDamaged: "Normal Attack Damage Taken Reduction",
};

const uniqueValueMaps = {
  preventsSkillDamagedRatio: (v) => `-${Math.round(+v * 40)}%`,
  criticalStrikeChance: (v) => `${Math.round(+v * 100)}`,
  criticalChance: (v) => `${Math.round(+v * 100)}`,
  cooldownReduction: (v) => `${Math.round(+v * 100)}`,
  decreateRecoveryToSkill: (v) => `-${Math.round(+v * 40)}%`,
};

export const interpretStat = (name, value) => {
  let fullValue = value || "-";
  let fullName = prettifyStat(name);

  if (value) {
    if (uniqueValueMaps[name]) {
      fullValue = uniqueValueMaps[name](value);
    } else if (name.indexOf("Ratio") >= 0) {
      fullValue = `${Math.round(+value * 100)}%`;
    }
  }

  if (uniqueStatMaps[name]) {
    fullName = uniqueStatMaps[name];
  }

  return {
    name: fullName,
    value: fullValue,
  };
};

export const getInterpretedString = (rawName, rawValue) => {
  const { name, value } = interpretStat(rawName, rawValue);

  return `${name}: ${value}`;
};
