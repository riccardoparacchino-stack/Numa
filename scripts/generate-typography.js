const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

const scalePresetMap = {
  "minor-second": 1.067,
  "major-second": 1.125,
  "minor-third": 1.2,
  "major-third": 1.25,
  "perfect-fourth": 1.333,
  "augmented-fourth": 1.414,
  "perfect-fifth": 1.5,
  "golden-ratio": 1.618
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function formatRem(value) {
  if (value === 0) return "0rem";
  return `${Number(value).toFixed(3)}rem`;
}

function getScaleRatio(config) {
  const candidate = config.scaleRatioPresetKey;
  const presetValue = scalePresetMap[candidate];
  if (presetValue) return presetValue;

  const customRatio = Number(candidate);
  if (Number.isFinite(customRatio) && customRatio > 0) return customRatio;
  return config.scaleRatio;
}

function buildRemPrimitiveCollection(numericTokens) {
  const primitiveEntries = Object.entries(numericTokens)
    .map(([name, token]) => ({
      name,
      intValue: Number(token.$value)
    }))
    .sort((a, b) => a.intValue - b.intValue);

  const remTokens = {};
  for (const entry of primitiveEntries) {
    const remValue = entry.intValue / 16;
    const tokenName = entry.name.replace("numa-sys-int-", "numa-sys-rem-");
    remTokens[tokenName] = {
      $type: "dimension",
      $value: formatRem(remValue)
    };
  }

  return { remTokens, primitiveEntries };
}

function resolveClosestPrimitive(rawPx, primitiveEntries) {
  return primitiveEntries.reduce((current, candidate) => {
    const currentDifference = Math.abs(rawPx - current.intValue);
    const candidateDifference = Math.abs(rawPx - candidate.intValue);
    if (candidateDifference < currentDifference) return candidate;
    if (candidateDifference === currentDifference && candidate.intValue < current.intValue) {
      return candidate;
    }
    return current;
  });
}

function validateConfig(config) {
  const errors = [];
  if (!Number.isFinite(config.baseSize) || config.baseSize <= 0) {
    errors.push("baseSize must be a positive finite number");
  }
  if (!Number.isInteger(config.numberOfScaleItems) || config.numberOfScaleItems < 1) {
    errors.push("numberOfScaleItems must be a positive integer");
  }
  if (!Number.isFinite(config.lineHeightRatio) || config.lineHeightRatio <= 0) {
    errors.push("lineHeightRatio must be a positive finite number");
  }
  if (!Number.isFinite(config.letterSpacing) || config.letterSpacing < 0) {
    errors.push("letterSpacing must be a non-negative finite number");
  }
  const ratioKey = config.scaleRatioPresetKey;
  if (ratioKey !== undefined && !Object.hasOwn(scalePresetMap, ratioKey) &&
      !(Number.isFinite(Number(ratioKey)) && Number(ratioKey) > 0)) {
    errors.push("scaleRatioPresetKey must be a known preset key or a positive numeric ratio");
  }
  if (!Number.isFinite(config.scaleRatio) || config.scaleRatio <= 0) {
    errors.push("scaleRatio must be a positive finite number");
  }
  if (!Number.isFinite(getScaleRatio(config)) || getScaleRatio(config) <= 0) {
    errors.push("scaleRatioPresetKey or scaleRatio must identify a positive ratio");
  }
  if (!Array.isArray(config.fontFamily) || config.fontFamily.length === 0 ||
      config.fontFamily.some((family) => typeof family !== "string" || family.length === 0)) {
    errors.push("fontFamily must be a non-empty array of non-empty strings");
  } else if (!config.fontFamily.includes("Rubik")) {
    errors.push("fontFamily must include the established Rubik primary family");
  }
  if (typeof config.googleFontsUrl !== "string" || config.googleFontsUrl.length === 0) {
    errors.push("googleFontsUrl must be a non-empty string");
  } else {
    try {
      const fontUrl = new URL(config.googleFontsUrl);
      if (fontUrl.protocol !== "https:" ||
          fontUrl.hostname !== "fonts.googleapis.com" ||
          !fontUrl.pathname.startsWith("/css2") ||
          !fontUrl.searchParams.has("family") ||
          !fontUrl.searchParams.get("family").startsWith("Rubik:")) {
        errors.push("googleFontsUrl must be an HTTPS Google Fonts CSS2 URL for Rubik");
      }
    } catch {
      errors.push("googleFontsUrl must be a valid HTTPS Google Fonts CSS2 URL for Rubik");
    }
  }
  if (errors.length > 0) throw new Error(`Invalid typography configuration:\n- ${errors.join("\n- ")}`);
}

function generateTypographyTokens(config, numericTokens) {
  validateConfig(config);
  const { remTokens, primitiveEntries } = buildRemPrimitiveCollection(numericTokens);
  if (primitiveEntries.length === 0) {
    throw new Error("Cannot generate typography without integer primitives");
  }

  const scaleRatio = getScaleRatio(config);
  const totalItems = config.numberOfScaleItems;
  const baseIndex = totalItems % 2 === 0 ? totalItems / 2 : (totalItems + 1) / 2;
  const fontSizeTokens = {};
  const lineHeightTokens = {};
  const letterSpacingTokens = {};
  const report = { fontSize: {}, lineHeight: {}, letterSpacing: {} };

  for (let index = 1; index <= totalItems; index += 1) {
    const calculatedPx = config.baseSize * Math.pow(scaleRatio, index - baseIndex);
    const resolvedPrimitive = resolveClosestPrimitive(calculatedPx, primitiveEntries);
    const resolvedIntToken = `numa-sys-int-${resolvedPrimitive.intValue}`;
    const resolvedRemToken = `numa-sys-rem-${resolvedPrimitive.intValue}`;
    fontSizeTokens[`numa-text-size-${index}`] = {
      $type: "dimension",
      $value: `{${resolvedRemToken}}`
    };
    report.fontSize[`numa-text-size-${index}`] = {
      originalCalculatedValue: Number(calculatedPx.toFixed(3)),
      resolvedIntPrimitive: resolvedIntToken,
      correspondingRemPrimitive: resolvedRemToken,
      absoluteRoundingDifference: Number(Math.abs(calculatedPx - resolvedPrimitive.intValue).toFixed(3))
    };

    const lineHeightPx = calculatedPx * config.lineHeightRatio;
    const lineHeightPrimitive = resolveClosestPrimitive(lineHeightPx, primitiveEntries);
    lineHeightTokens[`numa-text-line-height-${index}`] = {
      $type: "dimension",
      $value: `{numa-sys-rem-${lineHeightPrimitive.intValue}}`
    };
    report.lineHeight[`numa-text-line-height-${index}`] = {
      originalCalculatedValue: Number(lineHeightPx.toFixed(3)),
      resolvedIntPrimitive: `numa-sys-int-${lineHeightPrimitive.intValue}`,
      correspondingRemPrimitive: `numa-sys-rem-${lineHeightPrimitive.intValue}`,
      absoluteRoundingDifference: Number(Math.abs(lineHeightPx - lineHeightPrimitive.intValue).toFixed(3))
    };

    const letterSpacingPx = calculatedPx * config.letterSpacing;
    const spacingPrimitive = resolveClosestPrimitive(letterSpacingPx, primitiveEntries);
    letterSpacingTokens[`numa-text-letter-spacing-${index}`] = {
      $type: "dimension",
      $value: `{numa-sys-rem-${spacingPrimitive.intValue}}`
    };
    report.letterSpacing[`numa-text-letter-spacing-${index}`] = {
      originalCalculatedValue: Number(letterSpacingPx.toFixed(3)),
      resolvedIntPrimitive: `numa-sys-int-${spacingPrimitive.intValue}`,
      correspondingRemPrimitive: `numa-sys-rem-${spacingPrimitive.intValue}`,
      absoluteRoundingDifference: Number(Math.abs(letterSpacingPx - spacingPrimitive.intValue).toFixed(3))
    };
  }

  const typographyTokens = {
    "numa-text-family-primary": { $type: "fontFamily", $value: config.fontFamily },
    "numa-text-weight-100": { $type: "fontWeight", $value: 100 },
    "numa-text-weight-200": { $type: "fontWeight", $value: 200 },
    "numa-text-weight-300": { $type: "fontWeight", $value: 300 },
    "numa-text-weight-400": { $type: "fontWeight", $value: 400 },
    "numa-text-weight-500": { $type: "fontWeight", $value: 500 },
    "numa-text-weight-600": { $type: "fontWeight", $value: 600 },
    "numa-text-weight-700": { $type: "fontWeight", $value: 700 },
    "numa-text-weight-800": { $type: "fontWeight", $value: 800 },
    "numa-text-weight-900": { $type: "fontWeight", $value: 900 },
    "numa-text-style-normal": { $type: "fontStyle", $value: "normal" },
    "numa-text-style-italic": { $type: "fontStyle", $value: "italic" },
    "numa-text-decoration-none": { $type: "textDecoration", $value: "none" },
    "numa-text-decoration-underline": { $type: "textDecoration", $value: "underline" },
    "numa-text-decoration-line-through": { $type: "textDecoration", $value: "line-through" },
    "numa-text-transform-none": { $type: "textCase", $value: "none" },
    "numa-text-transform-uppercase": { $type: "textCase", $value: "uppercase" },
    "numa-text-transform-lowercase": { $type: "textCase", $value: "lowercase" },
    "numa-text-transform-capitalize": { $type: "textCase", $value: "capitalize" },
    "numa-text-align-start": { $type: "textAlign", $value: "start" },
    "numa-text-align-center": { $type: "textAlign", $value: "center" },
    "numa-text-align-end": { $type: "textAlign", $value: "end" },
    "numa-text-align-justify": { $type: "textAlign", $value: "justify" },
    ...fontSizeTokens,
    ...lineHeightTokens,
    ...letterSpacingTokens
  };

  return { remTokens, typographyTokens, report };
}

function buildReadme(config) {
  return `# Numa Typography Tokens

This token set documents the primary web font source for Numa.

## Font source

Rubik is the primary typeface used by the Numa web implementation.

@import url('${config.googleFontsUrl}');

The CSS2 import uses the official Google Fonts URL and supports Rubik weights 300 through 900 along with the italic variants.
`;
}

function serializeJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function createGeneratedFiles(config, numericTokens) {
  const { remTokens, typographyTokens, report } = generateTypographyTokens(config, numericTokens);
  return {
    "tokens/primitive/rem.json": serializeJson(remTokens),
    "tokens/typography/tokens.json": serializeJson(typographyTokens),
    "tokens/typography/report.json": serializeJson(report),
    "tokens/typography/README.md": buildReadme(config),
    "tokens/text/config.json": serializeJson(config),
    "tokens/text/typography.json": serializeJson(typographyTokens)
  };
}

function writeGeneratedFiles(outputRoot, generatedFiles) {
  for (const [relativePath, contents] of Object.entries(generatedFiles)) {
    const filePath = path.join(outputRoot, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, contents);
  }
}

function generateRepositoryFiles(repositoryRoot = rootDir) {
  const numericTokens = readJson(path.join(repositoryRoot, "tokens/primitive/numeric.json"));
  const config = readJson(path.join(repositoryRoot, "tokens/typography/config.json"));
  const generatedFiles = createGeneratedFiles(config, numericTokens);
  writeGeneratedFiles(repositoryRoot, generatedFiles);
  return generatedFiles;
}

if (require.main === module) {
  try {
    generateRepositoryFiles();
  } catch (error) {
    console.error(`Typography generation failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  buildRemPrimitiveCollection,
  createGeneratedFiles,
  generateRepositoryFiles,
  generateTypographyTokens,
  getScaleRatio,
  resolveClosestPrimitive,
  validateConfig,
  writeGeneratedFiles
};
