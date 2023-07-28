import path from 'path';
import fs from 'fs';

class GenerateAst {
  static output = '';

  public static defineAst(baseName: string, outputDir: string, types: Map<string, string>) {
    this.defineBase(baseName);
    this.defineVisitors(baseName, types);
    this.defineTypes(baseName, types);
    try {
      fs.writeFileSync(outputDir, this.output);
    } catch (err) {
      console.error(err);
    }

    this.output = '';
  }

  private static defineBase(baseName: string) {
    this.output +=
      'export abstract class ' +
      baseName +
      ' {' +
      '\n' +
      'abstract accept<R>(visitor: Visitor<R>): R' +
      '\n' +
      '}' +
      '\n \n';
  }

  private static defineVisitors(baseName: string, types: Map<string, string>) {
    this.output += 'interface Visitor<R> {' + '\n';

    types.forEach((_value, key) => {
      this.output += `visit${key}${baseName}: (${baseName.toLowerCase()}: ${key}) => R;` + '\n';
    });

    this.output += '}' + '\n \n';
  }

  private static defineProperties(value: string) {
    const values = value.split(',');
    values.forEach((value) => {
      this.output += `readonly ${value.trim()};` + '\n';
    });

    this.addNewLine();
  }

  private static addNewLine() {
    this.output += '\n';
  }

  private static initProperties(value: string) {
    const values = value.split(',');

    values.forEach((value) => {
      const [prop] = value.split(':');
      prop.trim();
      this.output += `this.${prop.trim()} = ${prop.trim()};` + '\n';
    });
  }

  private static defineTypes(baseName: string, types: Map<string, string>) {
    types.forEach((value, key) => {
      this.output += `export class ${key} extends ${baseName} {` + '\n';
      this.defineProperties(value);
      this.output += `constructor (${value}) {` + '\n' + 'super();' + '\n';
      this.initProperties(value);
      this.output += '}' + '\n';
      this.output +=
        `public accept<R>(visitor: Visitor<R>): R {` +
        '\n' +
        `return visitor.visit${key}${baseName}(this);` +
        '\n' +
        '}' +
        '\n' +
        '}';
    });
  }
}

(() => {
  GenerateAst.defineAst(
    'Expression',
    path.resolve(process.cwd()),
    new Map([
      ['Binary', 'left: Expression, operator: Token, right: Expression'],
      ['Grouping', 'expression: Expression'],
      ['Literal', 'value: LoxLiteral'],
      ['Unary', 'operator: Token, right: Expression'],
      ['Variable', 'name: Token'],
    ])
  );

  // GenerateAst.defineAst(
  //   'Statement',
  //   path.resolve(process.cwd()),
  //   new Map([
  //     ['Binary', 'left: Expression, operator: Token, right: Expression'],
  //     ['Grouping', 'expression: Expression'],
  //     ['Literal', 'value: LoxLiteral'],
  //     ['Unary', 'operator: Token, right: Expression'],
  //     ['Variable', 'name: Token'],
  //   ])
  // );
})();
