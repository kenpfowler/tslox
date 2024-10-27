class GenerateAst {
  static output = "";

  public static defineAst(
    baseName: string,
    outputDir: string,
    types: Map<string, string>
  ) {
    this.defineBase(baseName);
    this.defineVisitors(baseName, types);
    this.defineTypes(baseName, types);

    try {
      Deno.writeTextFileSync(`${outputDir}/${baseName}.ts`, this.output);
    } catch (err) {
      console.error(err);
    }

    this.output = "";
  }

  private static defineBase(baseName: string) {
    this.output +=
      "export abstract class " +
      baseName +
      " {" +
      "\n" +
      `abstract accept<R>(visitor: ${baseName}Visitor<R>): R` +
      "\n" +
      "}" +
      "\n \n";
  }

  private static defineVisitors(baseName: string, types: Map<string, string>) {
    this.output += `export interface ${baseName}Visitor<R> {` + "\n";

    types.forEach((_value, key) => {
      this.output +=
        `visit${key}${baseName}: (${baseName.toLowerCase()}: ${key}) => R;` +
        "\n";
    });

    this.output += "}" + "\n \n";
  }

  private static defineProperties(value: string) {
    const values = value.split(",");
    values.forEach((value) => {
      this.output += `readonly ${value.trim()};` + "\n";
    });

    this.addNewLine();
  }

  private static addNewLine() {
    this.output += "\n";
  }

  private static initProperties(value: string) {
    const values = value.split(",");

    values.forEach((value) => {
      const [prop] = value.split(":");
      prop.trim();
      this.output += `this.${prop.trim()} = ${prop.trim()};` + "\n";
    });
  }

  private static defineTypes(baseName: string, types: Map<string, string>) {
    types.forEach((value, key) => {
      this.output += `/**\n* represents a ${key}${baseName}\n */\n`;
      this.output += `export class ${key} extends ${baseName} {` + "\n";
      this.defineProperties(value);
      this.output += `constructor (${value}) {` + "\n" + "super();" + "\n";
      this.initProperties(value);
      this.output += "}" + "\n";
      this.output +=
        `public accept<R>(visitor: ${baseName}Visitor<R>): R {` +
        "\n" +
        `return visitor.visit${key}${baseName}(this);` +
        "\n" +
        "}" +
        "\n" +
        "}";
    });
  }
}

(function main() {
  GenerateAst.defineAst(
    "Expr",
    Deno.cwd(),
    new Map([
      ["Assign", "name: Token, value: Expr"],
      ["Logical", "left: Expr, operator: Token, right: Expr"],
      ["Binary", "left: Expr, operator: Token, right: Expr"],
      ["Call", "callee: Expr, paren: Token, args: Array<Expr>"],
      ["Grouping", "expr: Expr"],
      ["Literal", "value: LoxLiteral"],
      ["Unary", "operator: Token, right: Expr"],
      ["Variable", "name: Token"],
    ])
  );

  GenerateAst.defineAst(
    "Stmt",
    Deno.cwd(),
    new Map([
      ["While", "condition: Expr, body: Stmt"],
      ["If", "condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null"],
      ["Block", "statements: Array<Stmt>"],
      ["Return", "keyword: Token, value: Expr | null"],
      ["ExpressionStatement", "expr: Expr"],
      ["Func", "name: Token, params: Array<Token>, body: Array<Stmt>"],
      ["Print", "expression: Expr"],
      ["Var", "name: Token, initializer: Expr"],
    ])
  );
})();
