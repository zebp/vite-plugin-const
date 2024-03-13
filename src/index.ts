import type { Plugin } from "vite";
import { asConst } from "const-module";

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type ConstPluginOptions = {};

const constFileRegex = /\.const\.(ts|js)$/;

export default function constPlugin(_: ConstPluginOptions = {}): Plugin {
  return {
    name: "const",
    async transform(_, id): Promise<string | undefined> {
      if (!constFileRegex.test(id)) return undefined;
      return await asConst(id);
    },
  };
}
