import { createDecoratorPlugin } from "./babel-plugins/decorator";

const viteRollupBabelPlugins = [[], [createDecoratorPlugin()]];

export default viteRollupBabelPlugins;
