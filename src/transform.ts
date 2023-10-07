import generate from "@babel/generator";
import { ExportNamedDeclaration } from "@babel/types";

import * as childProcess from "node:child_process";
import * as url from "node:url";
import * as path from "node:path";
import * as fs from "node:fs";

import { expression } from "./literal.js";

const runnerPath = () => {
  try {
    // @ts-ignore
    const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
    const entryJs = path.resolve(__dirname, "entry.js");
    if (fs.existsSync(entryJs)) {
      return entryJs;
    } else {
      return path.resolve(__dirname, "entry.ts");
    }
  } catch (_) {
    return "node_modules/vite-plugin-const/dist/entry.js";
  }
};

export async function evaluate(path: string): Promise<Record<string, unknown>> {
  const child = childProcess.exec(`node ${runnerPath()} ${path}`, {
    env: {
      ...process.env,
      NODE_OPTIONS: "--experimental-loader=tsx",
    },
    maxBuffer: 1024 * 1024 * 1024,
  });

  let stdout = "";
  let stderr = "";

  child.stdout?.on("data", (chunk) => {
    stdout += chunk;
  });
  child.stderr?.on("data", (chunk) => {
    stderr += chunk;
  });

  const output = await new Promise<string>((resolve, reject) => {
    child.on("error", reject);
    child.on("exit", async (code) => {
      if (code === 0) {
        resolve(stdout);
      } else if (stderr.length > 0) {
        reject(new Error(stderr));
      } else {
        reject("No output from const runner.");
      }
    });
  });

  return JSON.parse(output);
}

export async function transform(path: string): Promise<string> {
  const exports = await evaluate(path);
  const body: ExportNamedDeclaration[] = [];

  for (const [name, value] of Object.entries(exports)) {
    if (name === "default") {
    } else {
      body.push({
        type: "ExportNamedDeclaration",
        declaration: {
          type: "VariableDeclaration",
          kind: "const",
          declarations: [
            {
              type: "VariableDeclarator",
              id: {
                type: "Identifier",
                name,
              },
              init: expression(value),
            },
          ],
        },
        specifiers: [],
        source: null,
      });
    }
  }

  const generated = generate.default({
    type: "File",
    program: {
      type: "Program",
      sourceType: "module",
      sourceFile: path,
      directives: [],
      body,
    },
  });

  return generated.code;
}
