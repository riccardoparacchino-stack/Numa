const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const tokensDir = path.join(rootDir, "tokens");
const primitiveDir = path.join(tokensDir, "primitive");
const typographyDir = path.join(tokensDir, "typography");
const textDir = path.join(tokensDir, "text");

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

const config = {
  baseSize: 16,
  scaleRatioPreset: "Minor Third",
  scaleRatioPresetKey: "minor-third",
  scaleRatio: 1.2,
  numberOfScaleItems: 12,
  lineHeightRatio: 1.5,
  letterSpacing: 0,
  fontFamily: ["Rubik", "Helvetica Neue", "Arial", "sans-serif"],
  googleFontsUrl:
    "https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function formatRem(value) {
  if (value === 0) return "0rem";
  return `${Number(value).toFixed(3)}rem`;
}

function getScaleRatio(selectedPresetKey) {
  const candidate = selectedPresetKey || config.scaleRatioPresetKey;
  const presetValue = scalePresetMap[candidate];
  if (presetValue) {
    return presetValue;
  }

  const normalized = Number(candidate);
  return Number.isFinite(normalized) && normalized > 0 ? normalized : config.scaleRatio;
}

function buildRemPrimitiveCollection() {
  const primitiveTokens = readJson(path.join(primitiveDir, "numeric.json"));
  const primitiveEntries = Object.entries(primitiveTokens)
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
  const closest = primitiveEntries.reduce((current, candidate) => {
    const currentDifference = Math.abs(rawPx - current.intValue);
    const candidateDifference = Math.abs(rawPx - candidate.intValue);
    if (candidateDifference < currentDifference) {
      return candidate;
    }
    if (candidateDifference === currentDifference && candidate.intValue < current.intValue) {
      return candidate;
    }
    return current;
  });

  return closest;
}

function generateTypographyTokens() {
  const { remTokens, primitiveEntries } = buildRemPrimitiveCollection();
  const scaleRatio = getScaleRatio(config.scaleRatioPresetKey);
  const totalItems = config.numberOfScaleItems;
  const baseIndex = totalItems % 2 === 0 ? totalItems / 2 : (totalItems + 1) / 2;

  const fontSizeTokens = {};
  const lineHeightTokens = {};
  const letterSpacingTokens = {};
  const report = {
    fontSize: {},
    lineHeight: {},
    letterSpacing: {}
  };

  for (let index = 1; index <= totalItems; index += 1) {
    const calculatedPx = config.baseSize * Math.pow(scaleRatio, index - baseIndex);
    const resolvedPrimitive = resolveClosestPrimitive(calculatedPx, primitiveEntries);
    const resolvedIntToken = `numa-sys-int-${resolvedPrimitive.intValue}`;
    const resolvedRemToken = `numa-sys-rem-${resolvedPrimitive.intValue}`;
    const sizeAlias = `{${resolvedRemToken}}`;

    fontSizeTokens[`numa-text-size-${index}`] = {
      $type: "dimension",
      $value: sizeAlias
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
    "numa-text-family-primary": {
      $type: "fontFamily",
      $value: config.fontFamily
    },
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

  return { config, remTokens, typographyTokens, report };
}

function buildReadme() {
  return `# Numa Typography Tokens

This token set documents the primary web font source for Numa.

## Font source

Rubik is the primary typeface used by the Numa web implementation.

@import url('${config.googleFontsUrl}');

The CSS2 import uses the official Google Fonts URL and supports Rubik weights 300 through 900 along with the italic variants.
`;
}

(function main() {
  const { config: currentConfig, remTokens, typographyTokens, report } = generateTypographyTokens();

  fs.mkdirSync(typographyDir, { recursive: true });
  fs.mkdirSync(textDir, { recursive: true });

  writeJson(path.join(primitiveDir, "rem.json"), remTokens);
  writeJson(path.join(typographyDir, "config.json"), currentConfig);
  writeJson(path.join(typographyDir, "tokens.json"), typographyTokens);
  writeJson(path.join(typographyDir, "report.json"), report);
  writeJson(path.join(textDir, "typography.json"), typographyTokens);
  writeJson(path.join(textDir, "config.json"), currentConfig);

  fs.writeFileSync(path.join(typographyDir, "README.md"), buildReadme());
})();
