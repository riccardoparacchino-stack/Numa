function formatRem(integerValue, baseFontSize, precision) {
  const remValue = integerValue / baseFontSize;
  return remValue === 0 ? "0rem" : `${remValue.toFixed(precision)}rem`;
}

function resolveInteger(value, rounding) {
  if (rounding.strategy === "floor") return Math.floor(value);
  if (rounding.strategy === "ceil") return Math.ceil(value);

  const lower = Math.floor(value);
  const fraction = value - lower;
  if (fraction < 0.5) return lower;
  if (fraction > 0.5) return lower + 1;
  return rounding.tieBreak === "up" ? lower + 1 : lower;
}

function validateScaleConfig(config) {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new Error("Invalid dimensional scale configuration: expected an object");
  }
  const errors = [];
  if (!Number.isFinite(config.baseValue) || config.baseValue <= 0) {
    errors.push("baseValue must be a positive finite number");
  }
  if (!Array.isArray(config.multipliers) || config.multipliers.length === 0 ||
      config.multipliers.some((value) => !Number.isFinite(value) || value <= 0)) {
    errors.push("multipliers must be a non-empty array of positive finite numbers");
  }
  if (!config.rounding || !["nearest", "floor", "ceil"].includes(config.rounding.strategy)) {
    errors.push("rounding.strategy must be nearest, floor, or ceil");
  }
  if (config.rounding?.strategy === "nearest" &&
      !["down", "up"].includes(config.rounding.tieBreak)) {
    errors.push("rounding.tieBreak must be down or up for nearest rounding");
  }
  if (typeof config.unit !== "string" || !/^[a-zA-Z]+$/.test(config.unit)) {
    errors.push("unit must be a unit name containing letters only");
  }
  if (!Number.isFinite(config.baseFontSize) || config.baseFontSize <= 0) {
    errors.push("baseFontSize must be a positive finite number for REM conversion");
  }
  if (!Number.isInteger(config.precision) || config.precision < 0 || config.precision > 12) {
    errors.push("precision must be an integer from 0 through 12");
  }
  if (typeof config.namePrefix !== "string" || !/^[-a-z0-9]+-$/.test(config.namePrefix)) {
    errors.push("namePrefix must be a lowercase token namespace ending in a hyphen");
  }
  if (errors.length > 0) {
    throw new Error(`Invalid dimensional scale configuration:\n- ${errors.join("\n- ")}`);
  }
}

function generateDimensionalScale(config) {
  validateScaleConfig(config);
  const integerTokens = {};
  const remTokens = {};
  const steps = [];
  const seenValues = new Set();

  for (const [index, multiplier] of config.multipliers.entries()) {
    const rawValue = config.baseValue * multiplier;
    if (!Number.isFinite(rawValue) || rawValue <= 0) {
      throw new Error(`Multiplier at index ${index} produces an invalid value`);
    }

    const resolvedValue = resolveInteger(rawValue, config.rounding);
    if (!Number.isSafeInteger(resolvedValue) || resolvedValue <= 0) {
      throw new Error(`Multiplier at index ${index} resolves to an invalid integer value`);
    }
    if (seenValues.has(resolvedValue)) {
      throw new Error(`Multipliers resolve to duplicate integer value ${resolvedValue}`);
    }
    seenValues.add(resolvedValue);

    const tokenName = `${config.namePrefix}${resolvedValue}`;
    const remValue = formatRem(resolvedValue, config.baseFontSize, config.precision);
    const unitValue = config.unit === "rem"
      ? remValue
      : `${resolvedValue}${config.unit}`;

    integerTokens[tokenName] = { $type: "number", $value: resolvedValue };
    remTokens[tokenName] = { $type: "dimension", $value: remValue };
    steps.push({
      tokenName,
      multiplier,
      rawValue,
      integerValue: resolvedValue,
      unitValue,
      remValue
    });
  }

  return { integerTokens, remTokens, steps };
}

module.exports = { generateDimensionalScale, validateScaleConfig };
