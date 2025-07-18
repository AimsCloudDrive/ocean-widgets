import { Plugin } from "vite";
import { createDecoratorPlugin as cDP } from "../babel-plugins/decorator";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { CodeGenerator } from "@babel/generator";

export default function createDecoratorPlugin(): Plugin {
  return {
    name: "decorator",
    enforce: "post",
    apply: "serve",
    transform(code, id) {
      // TODO: 将字符串源代码code转换为抽象语法树
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });
      const { Program } = cDP().visitor;
      // 调用
      if (Program) {
        // TODO: 将抽象语法树的Program部分传Program方法
        traverse["default"](ast, {
          Program: Program as any,
        });
      }
      // TODO: 将抽象语法树转回字符串格式的原始代码并返回
      const output = new CodeGenerator(
        ast,
        { sourceMaps: true },
        code
      ).generate();
      return output;
    },
  };
}
