import { Plugin } from "vite";

import * as transform from "./transform.js";

export type ConstPluginOptions = {};

const constFileRegex = /\.const\.(ts|js)$/;

export default function constPlugin({}: ConstPluginOptions = {}): Plugin {
  return {
    name: "const",
    async transform(_, id): Promise<string | undefined> {
      if (!constFileRegex.test(id)) return undefined;
      return await transform.transform(id);
    },
  };
}
