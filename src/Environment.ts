import RuntimeError from './RuntimeError';
import Token, { LoxLiteral } from './Token';

/**
 * Map of scoped variables that declared in the program.
 */
class Environment {
  private readonly values: Map<string, LoxLiteral> = new Map();

  /**
   *
   * @param name token containing the variable name
   * @returns returns the value mapped to the variable name else returns a runtime error if the variable does not exist
   */
  public get(name: Token) {
    const variable = this.values.get(name.lexeme);
    if (variable) {
      return variable;
    }

    throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
  }

  /**
   *
   * @param name token containing the variable name
   * @param value value being assigned
   * @returns if assignment is successful returns void, else returns a runtime error if the variable does not exist
   */
  public assign(name: Token, value: LoxLiteral) {
    const variable = this.values.get(name.lexeme);

    if (variable) {
      this.values.set(name.lexeme, value);
      return;
    }

    throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
  }

  /**
   *
   * @param name token containing the name of the variable being defined
   * @param value value being assigned to the variable name
   */
  public define(name: Token, value: LoxLiteral) {
    this.values.set(name.lexeme, value);
  }
}

export default Environment;
