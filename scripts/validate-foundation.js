const fs = require("fs");
const path = require("path");
const { createGeneratedFiles } = require("./generate-typography");
const { generateDimensionalScale } = require("./dimensional-scale");

const rootDir = path.resolve(__dirname, "..");
const tokenFiles = [
  "tokens/primitive/color.json",
  "tokens/primitive/numeric.json",
  "tokens/primitive/rem.json",
  "tokens/primitive/percentage.json",
  "tokens/typography/tokens.json"
];
const generatedFiles = [
  "tokens/primitive/rem.json",
  "tokens/typography/tokens.json",
  "tokens/typography/report.json",
  "tokens/typography/README.md",
  "tokens/text/config.json",
  "tokens/text/typography.json"
];
const typographyGroups = {
  family: /^numa-text-family-[a-z0-9-]+$/,
  weight: /^numa-text-weight-(?:[1-9]00)$/,
  style: /^numa-text-style-[a-z0-9-]+$/,
  decoration: /^numa-text-decoration-[a-z0-9-]+$/,
  transform: /^numa-text-transform-[a-z0-9-]+$/,
  align: /^numa-text-align-[a-z0-9-]+$/,
  size: /^numa-text-size-[1-9]\d*$/,
  "line-height": /^numa-text-line-height-[1-9]\d*$/,
  "letter-spacing": /^numa-text-letter-spacing-[1-9]\d*$/
};

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function findDuplicateObjectKeys(source) {
  const duplicates = [];
  const stack = [];
  let index = 0;
  while (index < source.length) {
    const character = source[index];
    if (character === '"') {
      const start = index;
      index += 1;
      while (index < source.length) {
        if (source[index] === "\\") {
          index += 2;
        } else if (source[index] === '"') {
          index += 1;
          break;
        } else {
          index += 1;
        }
      }
      const current = stack[stack.length - 1];
      if (current && current.kind === "object" && current.expectingKey) {
        const key = JSON.parse(source.slice(start, index));
        if (current.keys.has(key)) duplicates.push(key);
        current.keys.add(key);
        current.expectingKey = false;
      }
      continue;
    }
    if (character === "{") {
      stack.push({ kind: "object", keys: new Set(), expectingKey: true });
    } else if (character === "[") {
      stack.push({ kind: "array" });
    } else if (character === "}" || character === "]") {
      stack.pop();
    } else if (character === ":") {
      const current = stack[stack.length - 1];
      if (current && current.kind === "object") current.expectingKey = false;
    } else if (character === ",") {
      const current = stack[stack.length - 1];
      if (current && current.kind === "object") current.expectingKey = true;
    }
    index += 1;
  }
  return duplicates;
}

function validateTokenValue(name, token, errors) {
  const { $type: type, $value: value } = token;
  const invalid = (expected) => errors.push(`${name}: $value must be ${expected}`);
  switch (type) {
    case "color":
      if (typeof value !== "string" || !/^#[\da-fA-F]{6}$/.test(value)) invalid("a six-digit HEX color");
      break;
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value)) invalid("a finite number");
      break;
    case "dimension":
      if (typeof value !== "string" || !/^(?:\{[^{}]+\}|(?:0|(?:\d+|\d*\.\d+))rem)$/.test(value)) {
        invalid("a REM dimension or complete token reference");
      }
      break;
    case "fontFamily":
      if (!Array.isArray(value) || value.length === 0 ||
          value.some((entry) => typeof entry !== "string" || entry.length === 0)) {
        invalid("a non-empty array of non-empty font-family strings");
      }
      break;
    case "fontWeight":
      if (!Number.isInteger(value) || value < 100 || value > 900 || value % 100 !== 0) {
        invalid("a font weight from 100 through 900 in increments of 100");
      }
      break;
    case "fontStyle":
      if (!["normal", "italic"].includes(value)) invalid("normal or italic");
      break;
    case "textDecoration":
      if (!["none", "underline", "line-through"].includes(value)) invalid("a documented text decoration");
      break;
    case "textCase":
      if (!["none", "uppercase", "lowercase", "capitalize"].includes(value)) invalid("a documented text case");
      break;
    case "textAlign":
      if (!["start", "center", "end", "justify"].includes(value)) invalid("a documented text alignment");
      break;
    default:
      errors.push(`${name}: unsupported token type ${JSON.stringify(type)}`);
  }
}

function expectedNamePattern(file) {
  if (file.endsWith("/color.json")) return /^numa-sys-col-[a-z]+-(?:50|100|200|300|400|500|600|700|800|900|950)$/;
  if (file.endsWith("/numeric.json")) return /^numa-sys-int-\d+$/;
  if (file.endsWith("/rem.json")) return /^numa-sys-rem-\d+$/;
  if (file.endsWith("/percentage.json")) return /^numa-sys-per-\d{3}$/;
  return (name) => Object.values(typographyGroups).some((pattern) => pattern.test(name));
}

function isValidName(file, name) {
  const pattern = expectedNamePattern(file);
  return typeof pattern === "function" ? pattern(name) : pattern.test(name);
}

function expectedType(file, name) {
  if (file.endsWith("/color.json")) return "color";
  if (file.endsWith("/numeric.json") || file.endsWith("/percentage.json")) return "number";
  if (file.endsWith("/rem.json")) return "dimension";
  if (name.startsWith("numa-text-family-")) return "fontFamily";
  if (name.startsWith("numa-text-weight-")) return "fontWeight";
  if (name.startsWith("numa-text-style-")) return "fontStyle";
  if (name.startsWith("numa-text-decoration-")) return "textDecoration";
  if (name.startsWith("numa-text-transform-")) return "textCase";
  if (name.startsWith("numa-text-align-")) return "textAlign";
  return "dimension";
}

function loadJson(repositoryRoot, relativePath, errors) {
  const filePath = path.join(repositoryRoot, relativePath);
  try {
    const source = fs.readFileSync(filePath, "utf8");
    for (const duplicate of findDuplicateObjectKeys(source)) {
      errors.push(`${relativePath}: duplicate JSON object key ${JSON.stringify(duplicate)}`);
    }
    return JSON.parse(source);
  } catch (error) {
    errors.push(`${relativePath}: unable to read valid JSON (${error.message})`);
    return null;
  }
}

function inspectTokenFile(repositoryRoot, file, errors, allTokens) {
  const definitions = loadJson(repositoryRoot, file, errors);
  if (!definitions) return {};
  if (!isRecord(definitions)) {
    errors.push(`${file}: expected a JSON object mapping token names to definitions`);
    return {};
  }

  for (const [name, token] of Object.entries(definitions)) {
    if (!isValidName(file, name)) errors.push(`${file}: ${name} does not match the collection naming convention`);
    if (!isRecord(token)) {
      errors.push(`${file}: ${name} must be a token object`);
      continue;
    }
    if (typeof token.$type !== "string" || !Object.hasOwn(token, "$value")) {
      errors.push(`${file}: ${name} requires $type and $value`);
      continue;
    }
    if (token.$type !== expectedType(file, name)) {
      errors.push(`${file}: ${name} must use token type ${expectedType(file, name)}`);
    }
    validateTokenValue(name, token, errors);
    if (Object.hasOwn(allTokens, name)) {
      errors.push(`${file}: duplicate token name ${name} also exists in ${allTokens[name].file}`);
    } else {
      allTokens[name] = { ...token, file };
    }
  }
  return definitions;
}

function validatePrimitiveConventions(tokenSets, errors) {
  const integerTokens = tokenSets["tokens/primitive/numeric.json"] || {};
  const remTokens = tokenSets["tokens/primitive/rem.json"] || {};
  const percentageTokens = tokenSets["tokens/primitive/percentage.json"] || {};

  for (const [name, token] of Object.entries(integerTokens)) {
    const suffix = name.slice("numa-sys-int-".length);
    if (!Number.isInteger(token.$value) || Number(token.$value) !== Number(suffix)) {
      errors.push(`${name}: integer value must be an integer matching its name`);
    }
    const remName = `numa-sys-rem-${suffix}`;
    if (!Object.hasOwn(remTokens, remName)) errors.push(`${name}: missing corresponding ${remName}`);
  }
  for (const [name, token] of Object.entries(remTokens)) {
    const suffix = name.slice("numa-sys-rem-".length);
    const numericToken = integerTokens[`numa-sys-int-${suffix}`];
    if (!numericToken) errors.push(`${name}: has no corresponding integer primitive`);
    else if (token.$value !== (numericToken.$value === 0 ? "0rem" : `${(numericToken.$value / 16).toFixed(3)}rem`)) {
      errors.push(`${name}: REM value does not equal its integer primitive divided by 16`);
    }
  }
  for (const [name, token] of Object.entries(percentageTokens)) {
    const suffixValue = Number(name.slice("numa-sys-per-".length));
    if (token.$value !== suffixValue || suffixValue < 0 || suffixValue > 200 || suffixValue % 5 !== 0) {
      errors.push(`${name}: percentage must match its zero-padded name and be a multiple of 5 from 0 to 200`);
    }
  }
}

function validateRequiredTypography(tokenSets, errors) {
  const typography = tokenSets["tokens/typography/tokens.json"] || {};
  const requiredNames = [
    "numa-text-family-primary",
    ...Array.from({ length: 9 }, (_, index) => `numa-text-weight-${(index + 1) * 100}`),
    "numa-text-style-normal", "numa-text-style-italic",
    "numa-text-decoration-none", "numa-text-decoration-underline", "numa-text-decoration-line-through",
    "numa-text-transform-none", "numa-text-transform-uppercase", "numa-text-transform-lowercase",
    "numa-text-transform-capitalize",
    "numa-text-align-start", "numa-text-align-center", "numa-text-align-end", "numa-text-align-justify"
  ];
  for (const name of requiredNames) {
    if (!Object.hasOwn(typography, name)) errors.push(`tokens/typography/tokens.json: missing required token ${name}`);
  }
}

function validateAliases(allTokens, errors) {
  const edges = new Map();
  for (const [name, token] of Object.entries(allTokens)) {
    const value = token.$value;
    if (typeof value !== "string" || (!value.includes("{") && !value.includes("}"))) continue;
    const match = value.match(/^\{([^{}]+)\}$/);
    if (!match) {
      errors.push(`${token.file}: ${name} contains a malformed token reference`);
      continue;
    }
    const targetName = match[1];
    const target = allTokens[targetName];
    if (!target) {
      errors.push(`${token.file}: ${name} references missing token ${targetName}`);
      continue;
    }
    if (target.$type !== token.$type) {
      errors.push(`${token.file}: ${name} (${token.$type}) references incompatible ${targetName} (${target.$type})`);
    }
    edges.set(name, targetName);
  }

  const visited = new Set();
  const active = new Set();
  function visit(name, chain) {
    if (active.has(name)) {
      errors.push(`Circular token reference: ${[...chain, name].join(" -> ")}`);
      return;
    }
    if (visited.has(name)) return;
    active.add(name);
    const target = edges.get(name);
    if (target) visit(target, [...chain, name]);
    active.delete(name);
    visited.add(name);
  }
  for (const name of edges.keys()) visit(name, []);
}

function validateGeneratedFiles(repositoryRoot, config, numericTokens, errors) {
  let expected;
  try {
    expected = createGeneratedFiles(config, numericTokens);
  } catch (error) {
    errors.push(`Typography configuration or source primitives are invalid: ${error.message}`);
    return;
  }

  for (const relativePath of generatedFiles) {
    const filePath = path.join(repositoryRoot, relativePath);
    try {
      const actual = fs.readFileSync(filePath, "utf8");
      if (actual !== expected[relativePath]) {
        errors.push(`${relativePath}: generated output is stale; run npm run generate:tokens and review the diff`);
      }
    } catch (error) {
      errors.push(`${relativePath}: unable to read generated output (${error.message})`);
    }
  }
  const mirror = loadJson(repositoryRoot, "tokens/text/typography.json", errors);
  const canonicalTypography = loadJson(repositoryRoot, "tokens/typography/tokens.json", errors);
  if (JSON.stringify(mirror) !== JSON.stringify(canonicalTypography)) {
    errors.push("tokens/text/typography.json: generated typography mirror differs from tokens/typography/tokens.json");
  }
}

function validateGapFiles(repositoryRoot, errors) {
  const config = loadJson(repositoryRoot, "tokens/gap/config.json", errors);
  if (!config) return;

  let expected;
  try {
    expected = generateDimensionalScale(config);
  } catch (error) {
    errors.push(`tokens/gap/config.json: ${error.message}`);
    return;
  }

  for (const [file, tokens] of [
    ["tokens/gap/integer.json", expected.integerTokens],
    ["tokens/gap/rem.json", expected.remTokens]
  ]) {
    const actual = loadJson(repositoryRoot, file, errors);
    if (JSON.stringify(actual) !== JSON.stringify(tokens)) {
      errors.push(`${file}: does not match tokens/gap/config.json; run npm run generate:gap`);
    }
  }
}

function validateFoundation(repositoryRoot = rootDir) {
  const errors = [];
  const allTokens = {};
  const tokenSets = {};
  for (const file of tokenFiles) {
    tokenSets[file] = inspectTokenFile(repositoryRoot, file, errors, allTokens);
  }

  validatePrimitiveConventions(tokenSets, errors);
  validateRequiredTypography(tokenSets, errors);
  validateAliases(allTokens, errors);

  const config = loadJson(repositoryRoot, "tokens/typography/config.json", errors);
  const numericTokens = tokenSets["tokens/primitive/numeric.json"];
  if (config && numericTokens) validateGeneratedFiles(repositoryRoot, config, numericTokens, errors);
  validateGapFiles(repositoryRoot, errors);

  return errors;
}

if (require.main === module) {
  const errors = validateFoundation();
  if (errors.length > 0) {
    console.error(`Foundation validation failed (${errors.length} issue${errors.length === 1 ? "" : "s"}):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log("Foundation token validation passed.");
  }
}

module.exports = {
  findDuplicateObjectKeys,
  validateAliases,
  validateFoundation,
  validateGapFiles,
  validateTokenValue
};
