import * as helpers from "@babel/helper-validator-identifier";
import { Expression, ObjectProperty } from "@babel/types";

export function expression(value: unknown): Expression {
  if (typeof value === "string") {
    return { type: "StringLiteral", value };
  }

  if (typeof value === "number") {
    return { type: "NumericLiteral", value };
  }

  if (typeof value === "boolean") {
    return { type: "BooleanLiteral", value };
  }

  if (value === null) {
    return { type: "NullLiteral" };
  }

  if (Array.isArray(value)) {
    return {
      type: "ArrayExpression",
      elements: value.map(expression),
    };
  }

  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    const properties: ObjectProperty[] = [];

    for (const [key, value] of Object.entries(obj)) {
      const objectKey = helpers.isIdentifierName(key)
        ? ({ type: "Identifier", name: key } as const)
        : ({ type: "StringLiteral", value: key } as const);

      properties.push({
        type: "ObjectProperty",
        key: objectKey,
        value: expression(value),
        computed: false,
        shorthand: false,
      });
    }

    return {
      type: "ObjectExpression",
      properties,
    };
  }

  throw new Error(`Unknown type for value: ${value} (type: ${typeof value})`);
}
