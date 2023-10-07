import * as fs from "node:fs";
import * as parser from "@babel/parser";
import { expect, describe, it } from "bun:test";

import * as transform from "../src/transform.js";

describe("evaluate", () => {
  it("should be able to evaluate a file with serializable exports", async () => {
    const evaluated = await transform.evaluate("tests/data/sample.const.js");
    expect(evaluated).toEqual({
      array: [1, 2, 3],
      boolean: true,
      number: 1,
      object: {
        a: 1,
        b: 2,
        c: 3,
      },
      string: "string",
    });
  });

  it("should be able to evaluate a typescript", async () => {
    const evaluated = await transform.evaluate("tests/data/default.const.js");
    expect(evaluated).toEqual({
      default: "default",
    });
  });

  it("should preserve default exports", async () => {
    expect(() =>
      transform.evaluate("tests/data/sample.const.js")
    ).not.toThrow();
  });

  it("should fail to evaluate module with function export", () => {
    expect(() => transform.evaluate("tests/data/invalid.const.js")).toThrow();
  });

  it("should fail to evaluate module with nexted function export", () => {
    expect(() =>
      transform.evaluate("tests/data/nexted-function.const.js")
    ).toThrow();
  });
});

describe("transform", () => {
  it("should generate a valid module", async () => {
    const mod = await transform.transform("tests/data/sample.const.js");
    expect(() => parser.parse(mod, { sourceType: "module" })).not.toThrow();
  });

  it("should generate readable code", async () => {
    const mod = await transform.transform("tests/data/sample.const.js");
    const expected = fs.readFileSync("tests/data/sample.js", "utf8");
    expect(mod).toBe(expected);
  });

  it("should allow invalid identifiers", async () => {
    const mod = await transform.transform("tests/data/invalid-ident.const.js");
    const expected = fs.readFileSync("tests/data/invalid-ident.js", "utf8");
    expect(mod).toBe(expected);
  });
});
