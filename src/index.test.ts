import constPlugin from "./index.js";
import { describe, expect, test } from "vitest";

import * as os from "node:os";
import * as fs from "node:fs/promises";
import * as path from "node:path";

interface TmpDirFixture {
  tmpdir: string;
}

async function createTempDir() {
  const ostmpdir = os.tmpdir();
  const tmpdir = path.join(ostmpdir, "unit-test-");
  return await fs.mkdtemp(tmpdir);
}

export const tmpdirTest = test.extend<TmpDirFixture>({
  // biome-ignore lint/correctness/noEmptyPattern: <explanation>
  tmpdir: async ({}, use) => {
    const directory = await createTempDir();

    await use(directory);

    await fs.rm(directory, { recursive: true });
  },
});

export async function newTmpFile(tmpdir: string, content: string) {
  const filename = path.join(tmpdir, "file.const.ts");
  await fs.writeFile(filename, content);
  return filename;
}

describe("loader", () => {
  tmpdirTest("should build without errors", async ({ tmpdir }) => {
    const plugin = constPlugin();
    const filename = await newTmpFile(
      tmpdir,
      "export const foo: number = 5 + 5;",
    );
    expect(plugin.transform).toBeDefined();
    // @ts-ignore
    const output = await plugin.transform("ignored", filename);
    expect(output).toMatchInlineSnapshot(`
      "function deserialize(value) {
          switch (value.__const_type) {
              case "Date":
                  return new Date(value.value);
              case "Map":
                  return new Map(value.value);
              case "Set":
                  return new Set(value.value);
              case "ArrayBuffer":
                  return new Uint8Array(value.value).buffer;
              case "Uint8Array":
                  return new Uint8Array(value.value);
              case "primitive/array": {
                  const arr = [];
                  for (const v of Object.values(value.value)) {
                      arr.push(deserialize(v));
                  }
                  return arr;
              }
              case "primitive/object": {
                  const obj = {};
                  for (const [k, v] of Object.entries(value.value)) {
                      obj[k] = deserialize(v);
                  }
                  return obj;
              }
              case "primitive":
                  return value.value;
          }
      }
      const __module = deserialize({
        "__const_type": "primitive/object",
        "value": {
          "foo": {
            "__const_type": "primitive",
            "value": 10
          }
        }
      });
      export const foo = __module.foo;
      "
    `);
  });
});
