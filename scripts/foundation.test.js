const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const {
  generateRepositoryFiles,
  generateTypographyTokens,
  resolveClosestPrimitive,
  validateConfig
} = require("./generate-typography");
const { findDuplicateObjectKeys, validateAliases, validateFoundation } = require("./validate-foundation");
const { generateDimensionalScale } = require("./dimensional-scale");
const { generateGap } = require("./generate-gap");

const rootDir = path.resolve(__dirname, "..");
const config = JSON.parse(fs.readFileSync(path.join(rootDir, "tokens/typography/config.json"), "utf8"));
const numericTokens = JSON.parse(fs.readFileSync(path.join(rootDir, "tokens/primitive/numeric.json"), "utf8"));

test("all checked-in token collections and generated artifacts validate", () => {
  assert.deepEqual(validateFoundation(), []);
});

test("even scales place the base size at the lower central position", () => {
  const scaleConfig = { ...config, baseSize: 16, numberOfScaleItems: 4, scaleRatioPresetKey: 2, lineHeightRatio: 1.5 };
  const result = generateTypographyTokens(scaleConfig, numericTokens);
  assert.equal(result.report.fontSize["numa-text-size-1"].originalCalculatedValue, 8);
  assert.equal(result.report.fontSize["numa-text-size-2"].originalCalculatedValue, 16);
  assert.equal(result.report.fontSize["numa-text-size-3"].originalCalculatedValue, 32);
  assert.equal(result.report.fontSize["numa-text-size-4"].originalCalculatedValue, 64);
});

test("odd scales place the base size at the central position", () => {
  const scaleConfig = { ...config, baseSize: 16, numberOfScaleItems: 3, scaleRatioPresetKey: "1.5" };
  const result = generateTypographyTokens(scaleConfig, numericTokens);
  assert.equal(result.report.fontSize["numa-text-size-1"].originalCalculatedValue, 10.667);
  assert.equal(result.report.fontSize["numa-text-size-2"].originalCalculatedValue, 16);
  assert.equal(result.report.fontSize["numa-text-size-3"].originalCalculatedValue, 24);
});

test("custom scale parameters affect size, line-height, and letter-spacing output", () => {
  const scaleConfig = {
    ...config,
    baseSize: 16,
    numberOfScaleItems: 3,
    scaleRatioPresetKey: 1.5,
    lineHeightRatio: 2,
    letterSpacing: 0.25
  };
  const result = generateTypographyTokens(scaleConfig, numericTokens);
  assert.equal(result.report.fontSize["numa-text-size-3"].originalCalculatedValue, 24);
  assert.equal(result.report.lineHeight["numa-text-line-height-3"].originalCalculatedValue, 48);
  assert.equal(result.report.letterSpacing["numa-text-letter-spacing-3"].originalCalculatedValue, 6);
  assert.equal(result.typographyTokens["numa-text-size-3"].$value, "{numa-sys-rem-24}");
});

test("quantization picks the closest primitive and the smaller primitive on ties", () => {
  const primitives = [{ intValue: 8 }, { intValue: 12 }];
  assert.equal(resolveClosestPrimitive(9, primitives).intValue, 8);
  assert.equal(resolveClosestPrimitive(11, primitives).intValue, 12);
  assert.equal(resolveClosestPrimitive(10, primitives).intValue, 8);
});

test("invalid configuration fails with a field-specific error", () => {
  assert.throws(
    () => validateConfig({ ...config, numberOfScaleItems: 0 }),
    /numberOfScaleItems must be a positive integer/
  );
  assert.throws(
    () => validateConfig({ ...config, googleFontsUrl: "http://example.test/font.css" }),
    /googleFontsUrl must be an HTTPS Google Fonts CSS2 URL for Rubik/
  );
});

test("aliases reject missing, incompatible, and circular references", () => {
  const errors = [];
  validateAliases({
    first: { $type: "dimension", $value: "{missing}", file: "fixture.json" },
    second: { $type: "dimension", $value: "{color}", file: "fixture.json" },
    color: { $type: "color", $value: "#ffffff", file: "fixture.json" },
    loopA: { $type: "dimension", $value: "{loopB}", file: "fixture.json" },
    loopB: { $type: "dimension", $value: "{loopA}", file: "fixture.json" }
  }, errors);
  assert.match(errors.join("\n"), /first references missing token missing/);
  assert.match(errors.join("\n"), /second \(dimension\) references incompatible color \(color\)/);
  assert.match(errors.join("\n"), /Circular token reference: loopA -> loopB -> loopA/);
});

test("duplicate JSON object keys are reported instead of silently overwritten", () => {
  assert.deepEqual(findDuplicateObjectKeys('{"token": {"$type": "number", "$value": 1, "$value": 2}}'), ["$value"]);
});

test("generic scale generation accepts base values 2, 4, and custom values", () => {
  const scale = {
    ...JSON.parse(fs.readFileSync(path.join(rootDir, "tokens/gap/config.json"), "utf8")),
    multipliers: [1, 2, 3]
  };
  assert.deepEqual(
    generateDimensionalScale({ ...scale, baseValue: 2 }).steps.map((step) => step.integerValue),
    [2, 4, 6]
  );
  assert.deepEqual(
    generateDimensionalScale({ ...scale, baseValue: 4 }).steps.map((step) => step.integerValue),
    [4, 8, 12]
  );
  assert.deepEqual(
    generateDimensionalScale({ ...scale, baseValue: 3 }).steps.map((step) => step.integerValue),
    [3, 6, 9]
  );
});

test("gap multiplier sequence is configurable and outputs preserve aligned token names", () => {
  const config = JSON.parse(fs.readFileSync(path.join(rootDir, "tokens/gap/config.json"), "utf8"));
  const result = generateDimensionalScale({ ...config, multipliers: [1, 1.5, 2, 4] });
  assert.deepEqual(result.steps.map((step) => step.integerValue), [2, 3, 4, 8]);
  assert.deepEqual(Object.keys(result.integerTokens), Object.keys(result.remTokens));
  for (const [name, integerToken] of Object.entries(result.integerTokens)) {
    assert.equal(result.remTokens[name].$value, `${(integerToken.$value / config.baseFontSize).toFixed(3)}rem`);
  }
  const pixelScale = generateDimensionalScale({
    ...config,
    baseValue: 2,
    multipliers: [4],
    unit: "px",
    baseFontSize: 8
  });
  assert.equal(pixelScale.steps[0].unitValue, "8px");
  assert.equal(pixelScale.steps[0].remValue, "1.000rem");
});

test("rounding strategies are deterministic and duplicate resolved values fail", () => {
  const config = {
    baseValue: 1,
    multipliers: [1.5],
    rounding: { strategy: "nearest", tieBreak: "down" },
    unit: "rem",
    baseFontSize: 16,
    precision: 3,
    namePrefix: "numa-sys-gap-"
  };
  assert.equal(generateDimensionalScale(config).steps[0].integerValue, 1);
  assert.equal(generateDimensionalScale({
    ...config,
    rounding: { strategy: "nearest", tieBreak: "up" }
  }).steps[0].integerValue, 2);
  assert.equal(generateDimensionalScale({
    ...config,
    rounding: { strategy: "floor", tieBreak: "down" }
  }).steps[0].integerValue, 1);
  assert.equal(generateDimensionalScale({
    ...config,
    rounding: { strategy: "ceil", tieBreak: "down" }
  }).steps[0].integerValue, 2);
  assert.throws(
    () => generateDimensionalScale({ ...config, multipliers: [1, 1.2] }),
    /duplicate integer value/
  );
});

test("invalid generic scale inputs report useful errors", () => {
  const config = JSON.parse(fs.readFileSync(path.join(rootDir, "tokens/gap/config.json"), "utf8"));
  assert.throws(() => generateDimensionalScale({ ...config, baseValue: 0 }), /baseValue must be a positive finite number/);
  assert.throws(() => generateDimensionalScale({ ...config, multipliers: [1, NaN] }), /multipliers must be a non-empty array/);
  assert.throws(() => generateDimensionalScale({ ...config, rounding: { strategy: "random" } }), /rounding.strategy must be nearest, floor, or ceil/);
  assert.throws(() => generateDimensionalScale({ ...config, baseFontSize: 0 }), /baseFontSize must be a positive finite number/);
});

test("gap generation is deterministic, leaves configuration and broad primitives intact", () => {
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "numa-gap-"));
  try {
    for (const relativePath of [
      "tokens/gap/config.json",
      "tokens/primitive/numeric.json",
      "tokens/primitive/rem.json"
    ]) {
      const target = path.join(temporaryDirectory, relativePath);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(rootDir, relativePath), target);
    }
    const configPath = path.join(temporaryDirectory, "tokens/gap/config.json");
    const integerPath = path.join(temporaryDirectory, "tokens/primitive/numeric.json");
    const remPath = path.join(temporaryDirectory, "tokens/primitive/rem.json");
    const configBefore = fs.readFileSync(configPath, "utf8");
    const integerBefore = fs.readFileSync(integerPath, "utf8");
    const remBefore = fs.readFileSync(remPath, "utf8");

    generateGap(temporaryDirectory);
    const generatedInteger = fs.readFileSync(path.join(temporaryDirectory, "tokens/gap/integer.json"), "utf8");
    const generatedRem = fs.readFileSync(path.join(temporaryDirectory, "tokens/gap/rem.json"), "utf8");
    generateGap(temporaryDirectory);

    assert.equal(fs.readFileSync(path.join(temporaryDirectory, "tokens/gap/integer.json"), "utf8"), generatedInteger);
    assert.equal(fs.readFileSync(path.join(temporaryDirectory, "tokens/gap/rem.json"), "utf8"), generatedRem);
    assert.equal(fs.readFileSync(configPath, "utf8"), configBefore);
    assert.equal(fs.readFileSync(integerPath, "utf8"), integerBefore);
    assert.equal(fs.readFileSync(remPath, "utf8"), remBefore);
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
});

test("generation is deterministic and does not mutate canonical primitive input", () => {
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "numa-foundation-"));
  try {
    for (const relativePath of [
      "tokens/primitive/color.json",
      "tokens/primitive/numeric.json",
      "tokens/primitive/percentage.json",
      "tokens/typography/config.json"
    ]) {
      const target = path.join(temporaryDirectory, relativePath);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(rootDir, relativePath), target);
    }

    const sourceFiles = [
      "tokens/primitive/color.json",
      "tokens/primitive/numeric.json",
      "tokens/primitive/percentage.json",
      "tokens/typography/config.json"
    ];
    const sourceSnapshot = Object.fromEntries(
      sourceFiles.map((relativePath) => [
        relativePath,
        fs.readFileSync(path.join(temporaryDirectory, relativePath), "utf8")
      ])
    );
    const first = generateRepositoryFiles(temporaryDirectory);
    const firstSnapshot = Object.fromEntries(
      Object.keys(first).map((relativePath) => [
        relativePath,
        fs.readFileSync(path.join(temporaryDirectory, relativePath), "utf8")
      ])
    );
    const second = generateRepositoryFiles(temporaryDirectory);
    const repeatedSnapshot = Object.fromEntries(
      Object.keys(second).map((relativePath) => [
        relativePath,
        fs.readFileSync(path.join(temporaryDirectory, relativePath), "utf8")
      ])
    );
    const sourceAfterGeneration = Object.fromEntries(
      sourceFiles.map((relativePath) => [
        relativePath,
        fs.readFileSync(path.join(temporaryDirectory, relativePath), "utf8")
      ])
    );
    assert.deepEqual(sourceAfterGeneration, sourceSnapshot);
    assert.deepEqual(repeatedSnapshot, firstSnapshot);
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
});
