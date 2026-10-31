const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const typographyDir = path.join(rootDir, "tokens", "typography");
const readmePath = path.join(typographyDir, "README.md");
const remPath = path.join(rootDir, "tokens", "primitive", "rem.json");
const typographyPath = path.join(typographyDir, "tokens.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const remTokens = readJson(remPath);
const typographyTokens = readJson(typographyPath);
const readme = fs.readFileSync(readmePath, "utf8");

assert(remTokens["numa-sys-rem-0"].$value === "0rem", "numa-sys-rem-0 should remain 0rem");
assert(remTokens["numa-sys-rem-4"].$value === "0.250rem", "numa-sys-rem-4 should resolve to 0.250rem");
assert(remTokens["numa-sys-rem-16"].$value === "1.000rem", "numa-sys-rem-16 should resolve to 1.000rem");
assert(remTokens["numa-sys-rem-24"].$value === "1.500rem", "numa-sys-rem-24 should resolve to 1.500rem");

assert(typographyTokens["numa-text-family-primary"].$value[0] === "Rubik", "Primary font should be Rubik");
assert(typographyTokens["numa-text-weight-100"].$value === 100, "Weight 100 should resolve to 100");
assert(typographyTokens["numa-text-weight-900"].$value === 900, "Weight 900 should resolve to 900");
assert(typographyTokens["numa-text-style-normal"].$value === "normal", "Normal style token should resolve to normal");
assert(typographyTokens["numa-text-decoration-underline"].$value === "underline", "Underline decoration token should resolve to underline");
assert(typographyTokens["numa-text-transform-uppercase"].$value === "uppercase", "Uppercase transform token should resolve to uppercase");
assert(typographyTokens["numa-text-align-center"].$value === "center", "Center alignment token should resolve to center");

assert(typographyTokens["numa-text-size-6"].$value === "{numa-sys-rem-16}", "size-6 should resolve to the base 16px rem token");
assert(typographyTokens["numa-text-line-height-6"].$value === "{numa-sys-rem-24}", "line-height-6 should resolve to 24px (1.5x)");
assert(typographyTokens["numa-text-letter-spacing-6"].$value === "{numa-sys-rem-0}", "Default letter spacing should be 0rem");
assert(readme.includes("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"), "README must include the Rubik Google Fonts URL");

console.log("Typography token validation passed.");
