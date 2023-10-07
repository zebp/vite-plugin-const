// This file is the entry point for the const evaluation process.
// It is responsible for importing the const module and evaluating it and then dumping the result to stdout.
import * as path from "node:path";

async function main() {
  try {
    const [_node, _entry, modulePath] = process.argv;

    if (!modulePath) throw new Error("No module path provided.");

    const absoluteModulePath = path.resolve(modulePath);
    const mod = await import(absoluteModulePath);

    const serializedModule = JSON.stringify(mod, replacer, 2);
    console.log(serializedModule);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

function replacer(key: string, value: any) {
  if (typeof value === "function") {
    throw new Error(
      `Functions cannot be serialized in const modules. (function ${key})`
    );
  }

  return value;
}

main();
