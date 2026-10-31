const { validateFoundation } = require("./validate-foundation");

const errors = validateFoundation();
if (errors.length > 0) {
  console.error(`Typography and Foundation validation failed (${errors.length} issue${errors.length === 1 ? "" : "s"}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("Typography and Foundation validation passed.");
}
