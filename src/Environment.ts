import RuntimeError from './RuntimeError';
import Token, { LoxLiteral } from './Token';

/**
 * Map of scoped variables that declared in the program.
 */
class Environment {
  private readonly enclosing: Environment | null = null;
  private readonly values: Map<string, LoxLiteral> = new Map();

  constructor(enclosing?: Environment) {
    this.enclosing = enclosing ?? null;
  }

  /**
   *
   * @param name token containing the variable name
   * @returns returns the value mapped to the variable name else returns a runtime error if the variable does not exist
   */
  public get(name: Token): LoxLiteral {
    const variable = this.values.get(name.lexeme);

    if (variable !== undefined) {
      return variable;
    }

    if (this.enclosing) {
      return this.enclosing.get(name);
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
    // try to access the value
    const variable = this.values.get(name.lexeme);

    // if the variable exists in the current scope the we assign the new one
    if (variable !== undefined) {
      this.values.set(name.lexeme, value);
      return;
    }

    // if the variable IS undefined then start the recursive process of checking for the variable in an enclosing scope.
    if (this.enclosing) {
      this.enclosing.assign(name, value);
      return;
    }

    // finally, throw if the variable wasn't found in any scope.
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
