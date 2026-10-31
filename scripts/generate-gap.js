const fs = require("node:fs");
const path = require("node:path");
const { generateDimensionalScale } = require("./dimensional-scale");

const rootDir = path.resolve(__dirname, "..");

function generateGap(repositoryRoot = rootDir) {
  const configPath = path.join(repositoryRoot, "tokens/gap/config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const { integerTokens, remTokens } = generateDimensionalScale(config);

  fs.mkdirSync(path.join(repositoryRoot, "tokens/gap"), { recursive: true });
  fs.writeFileSync(
    path.join(repositoryRoot, "tokens/gap/integer.json"),
    `${JSON.stringify(integerTokens, null, 2)}\n`
  );
  fs.writeFileSync(
    path.join(repositoryRoot, "tokens/gap/rem.json"),
    `${JSON.stringify(remTokens, null, 2)}\n`
  );
  return { integerTokens, remTokens };
}

if (require.main === module) {
  try {
    generateGap();
  } catch (error) {
    console.error(`Gap generation failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { generateGap };
